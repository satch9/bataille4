const {
  forEach
} = require("lodash");
const socketio = require("socket.io");

const initializeSocket = (server) => {
  /* const io = socketio(server, {
    cors: {
      origin: "https://fluffy-engine-g4ppg4xj655hwwp6-5173.app.github.dev", // Modifier en fonction de votre configuration frontend
      methods: ["GET", "POST"],
    }
  }) */

  const io = socketio(server, {
    cors: {
      origin: "http://localhost:5173", // Modifier en fonction de votre configuration frontend
      methods: ["GET", "POST"],
    }
  })

  /* const io = socketio(server, {
    cors: {
      origin: "https://xg3tgf-5173.csb.app", // Modifier en fonction de votre configuration frontend
      methods: ["GET", "POST"],
    },
  }); */

  const Room = require("./src/models/Room");
  const Player = require("./src/models/Player");
  const Game = require("./src/models/Game");
  const GamePlayers = require("./src/models/GamesPlayers");

  const INTERVAL_TIME = 5000;
  let disconnectedUsers = {};

  io.on("connection", async (socket) => {
    const userId = socket.id;
    console.log(`New connection: ${userId}`);

    // Disconnect
    socket.on("disconnect", async () => {
      try {
        console.log(`User ${userId} has disconnected.`);
        disconnectedUsers[userId] = true;
        const roomId = findRoomIdByUserId(userId);
        if (roomId) {
          socket.leave(roomId);
          // Mettre à jour les données de la salle pour retirer l'utilisateur
          // Par exemple :
          const room = await Room.findRoomById(roomId);
          room.removePlayer(userId);
          io.to(roomId).emit("player left room", userId);
        }
      } catch (error) {
        console.error(`Erreur lors de la déconnexion de l'utilisateur ${userId}:`, error);
      }

    });

    // Gestion de la reconnexion
    socket.on("connect", () => {
      console.log(`User ${userId} has reconnected.`);
      // Vérifier si l'utilisateur était précédemment déconnecté
      if (disconnectedUsers[userId]) {
        // Utilisateur précédemment déconnecté, rétablir l'état et les données si nécessaire
        const roomId = findRoomIdByUserId(userId);
        if (roomId) {
          // Reconnecter l'utilisateur à la salle
          socket.join(roomId);
          // Mettre à jour les informations de la salle ou de l'utilisateur si nécessaire
        }
        // Supprimer l'utilisateur de la liste des déconnectés
        delete disconnectedUsers[userId];
      }
    });

    setInterval(async () => {
      try {
        Room.getAllRooms((err, rooms) => {
          if (err) {
            console.error(
              `Erreur lors de la récupération de toutes les salles :`,
              err,
            );
            return;
          }
          //console.log("All rooms:", JSON.stringify(rooms, null, 2));
          io.emit("get all rooms", rooms);
        });
      } catch (error) {
        console.log(error);
      }
    }, INTERVAL_TIME);

    socket.on("create room", async (values) => {
      console.log("Creating a new room...", values);

      try {
        const creator = new Player(userId, values.roomCreator);
        const player = await creator.saveCreatorToDatabase();
        console.log("player saved in database [create room] : ", player);

        const room = new Room(
          values.roomName,
          values.roomNumCards,
          player.player_id,
        );
        const roomCreated = await room.createRoomToDatabase();
        console.log("roomCreated", JSON.stringify(roomCreated, null, 2));

        socket.emit("created room", roomCreated);
        socket.join(roomCreated.room_id);

        const game = new Game(roomCreated.room_id);
        const gameCreated = await game.createGameToDatabase();

        socket.emit("created game", gameCreated)

        const gamePlayers = new GamePlayers(
          parseInt(gameCreated.game_id),
          parseInt(player.player_id),
        );
        const gamePlayersCreated =
          await gamePlayers.createGamePlayersToDatabase();
      } catch (error) {
        // Gérer l'erreur ici, par exemple, émettre un événement pour informer le client de l'échec de la création de la salle
        socket.emit("create room error", {
          message: "Error creating room"
        });
      }

    });

    socket.on("joinRoom", async ({
      roomId,
      username
    }) => {
      try {
        // Vérifier si la salle existe
        const room = await Room.findRoomById(roomId)
        if (!room) throw "La salle n'existe pas."

        // Ajouter le joueur à la salle
        const player = await Player.findPlayerByName(username)
        console.log("player joinRoom", player)
        if (player.length === 0) {
          const playerCreated = await Player.addPlayer(username, userId)

          if (room.room_creator !== playerCreated.player_id) {
            console.log("room joined", roomId);
            socket.join(roomId);
            // Mettre à jour les données de la salle pour inclure le joueur
            await GamePlayers.addPlayerToRoom(roomId, playerCreated);
            io.to(roomId).emit("player joined room", playerCreated);
          }
        } else {
          socket.join(roomId);
          io.to(roomId).emit("player joined room", player);
        }

      } catch (error) {
        console.error(
          "Erreur lors de la tentative de rejoindre la salle :",
          error,
        );
        socket.emit("joinRoomError", error.message);
      }
    });

    socket.on("start game", (roomId) => {
      console.log("roomId [start game]", roomId)

      io.to(roomId).emit('game started', 'Game has been started');
      GamePlayers.startGame(roomId);
    });



  });

  const findRoomIdByUserId = (userId) => {
    // Parcourir toutes les salles pour trouver celle où l'utilisateur est présent
    for (const roomId of Object.keys(io.sockets.adapter.rooms)) {
      // Vérifier si l'utilisateur est présent dans la salle
      if (io.sockets.adapter.rooms[roomId].sockets[userId]) {
        // L'utilisateur est présent dans cette salle
        return roomId;
      }
    }
    // Si l'utilisateur n'est pas présent dans aucune salle, retourner null
    return null;
  };

};

module.exports = initializeSocket;
const socketio = require("socket.io");

const initializeSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "https://fluffy-engine-g4ppg4xj655hwwp6-5173.app.github.dev", // Modifier en fonction de votre configuration frontend
      methods: ["GET", "POST"],
    }
  })

  /* const io = socketio(server, {
        cors: {
            origin: "http://localhost:5173", // Modifier en fonction de votre configuration frontend
            methods: ["GET", "POST"],
        }
    }) */

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

  io.on("connection", async (socket) => {
    const userId = socket.id;
    console.log(`New connection: ${userId}`);

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

      const creator = new Player(userId, values.roomCreator);
      const player = await creator.saveCreatorToDatabase();
      //console.log("player", player)

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

      const gamePlayers = new GamePlayers(
        parseInt(gameCreated.game_id),
        parseInt(player.player_id),
      );
      const gamePlayersCreated =
        await gamePlayers.createGamePlayersToDatabase();
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
        
        if (player.length === 0) {
          const playerCreated = await Player.addPlayer(username, userId)

          if (room.room_creator !== playerCreated.player_id) {
            console.log("room joined", roomId);
            // Mettre à jour les données de la salle pour inclure le joueur
            await GamePlayers.addPlayerToRoom(roomId, playerCreated);
          }
        }

        socket.to(roomId).emit("player joined room", userId);
      } catch (error) {
        console.error(
          "Erreur lors de la tentative de rejoindre la salle :",
          error,
        );
        socket.emit("joinRoomError", error.message);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User ${userId} has disconnected.`);
    });
  });
};

module.exports = initializeSocket;
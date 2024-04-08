const { forEach, isInteger } = require('lodash')
const socketio = require('socket.io')

const initializeSocket = (server) => {
  /* const io = socketio(server, {
    cors: {
      origin: "https://fluffy-engine-g4ppg4xj655hwwp6-5173.app.github.dev", // Modifier en fonction de votre configuration frontend
      methods: ["GET", "POST"],
    }
  }) */

  const io = socketio(server, {
    cors: {
      origin: 'http://localhost:5173', // Modifier en fonction de votre configuration frontend
      methods: ['GET', 'POST'],
    },
  })

  /* const io = socketio(server, {
    cors: {
      origin: "https://xg3tgf-5173.csb.app", // Modifier en fonction de votre configuration frontend
      methods: ["GET", "POST"],
    },
  }) */

  const Room = require('./src/models/Room')
  const Player = require('./src/models/Player')
  const Game = require('./src/models/Game')
  const GamePlayers = require('./src/models/GamesPlayers')

  const INTERVAL_TIME = 5000
  let disconnectedUsers = {}
  let globalGameState = {}

  const game = new Game()
  const player = new Player()
  const room = new Room()
  const gamesPlayers = new GamePlayers()

  io.on('connection', async (socket) => {
    const userId = socket.id
    console.log(`New connection: ${userId}`)

    /* socket.on('updateGameState', (gameState) => {
      const roomId = findRoomIdByUserId(userId)
      // Mettre à jour l'état global du jeu avec les données reçues du frontend
      globalGameState = gameState

      console.log('roomId updateGameState', roomId)
      console.log('globalGameState updateGameState', globalGameState)

      // Diffuser l'état mis à jour à tous les joueurs connectés
      io.to(roomId).emit('updateGameState', globalGameState)
    }) */

    // Disconnect
    socket.on('disconnect', async () => {
      try {
        console.log(`User ${userId} has disconnected.`)
        disconnectedUsers[userId] = true
        const roomId = findRoomIdByUserId(userId)
        if (roomId) {
          socket.leave(roomId)
          // Mettre à jour les données de la salle pour retirer l'utilisateur
          // Par exemple :
          const room = await Room.findRoomById(roomId)
          room.removePlayer(userId)
          io.to(roomId).emit('player left room', userId)
        }
      } catch (error) {
        console.error(
          `Erreur lors de la déconnexion de l'utilisateur ${userId}:`,
          error,
        )
      }
    })

    /* // Gestion de la reconnexion
    socket.on("connect", () => {
      console.log(`User ${userId} has reconnected.`)
      // Vérifier si l'utilisateur était précédemment déconnecté
      if (disconnectedUsers[userId]) {
        // Utilisateur précédemment déconnecté, rétablir l'état et les données si nécessaire
        const roomId = findRoomIdByUserId(userId)
        if (roomId) {
          // Reconnecter l'utilisateur à la salle
          socket.join(roomId)
          // Mettre à jour les informations de la salle ou de l'utilisateur si nécessaire
        }
        // Supprimer l'utilisateur de la liste des déconnectés
        delete disconnectedUsers[userId]
      }
    }) */

    setInterval(async () => {
      try {
        Room.getAllRooms((err, rooms) => {
          if (err) {
            console.error(
              `Erreur lors de la récupération de toutes les salles :`,
              err,
            )
            return
          }
          //console.log("All rooms:", JSON.stringify(rooms, null, 2))
          io.emit('get all rooms', rooms)
        })
      } catch (error) {
        console.log(error)
      }
    }, INTERVAL_TIME)

    socket.on('create room', async (values) => {
      console.log('Creating a new room...', values)

      try {
        const creator = await player.saveCreatorToDatabase(
          userId,
          values.roomCreator,
        )
        //console.log('player saved in database [create room] : ', player)

        const roomCreated = await room.createRoomToDatabase(
          values.roomName,
          values.roomNumCards,
          creator.player_id,
        )
        //console.log('roomCreated', JSON.stringify(roomCreated, null, 2))

        socket.emit('created room', roomCreated)
        socket.join(roomCreated.room_id)

        const gameCreated = await game.createGameToDatabase(roomCreated.room_id)

        socket.emit('created game', gameCreated)

        const gamePlayersCreated = await gamesPlayers.createGamePlayersToDatabase(
          parseInt(gameCreated.game_id),
          parseInt(creator.player_id),
        )

        //console.log('gamePlayersCreated [create room]', gamePlayersCreated)
      } catch (error) {
        // Gérer l'erreur ici, par exemple, émettre un événement pour informer le client de l'échec de la création de la salle
        socket.emit('create room error', {
          message: 'Error creating room',
        })
      }
    })

    socket.on('joinRoom', async ({ roomId, username }) => {
      try {
        // Vérifier si la salle existe
        const roomExisted = await Room.findRoomById(roomId)
        if (!roomExisted) throw "La salle n'existe pas."

        // Ajouter le joueur à la salle
        const player = await Player.findPlayerByName(username)
        //console.log('player [joinRoom]', player)
        if (player.length === 0) {
          const playerCreated = await Player.addPlayer(username, userId)
          /*console.log(
            'typeof playerCreated [joinRoom]',
            typeof playerCreated,
            playerCreated,
          )*/
          if (roomExisted.room_creator !== playerCreated.player_id) {
            //console.log('room joined joinRoom', roomId)
            socket.join(roomId)
            // Mettre à jour les données de la salle pour inclure le joueur
            await GamePlayers.addPlayerToRoom(roomId, playerCreated)
            io.to(roomId).emit('player joined room', playerCreated)
          }
        } else {
          socket.join(roomId)
          //console.log('typeof player [joinRoom]', typeof player)
          io.to(roomId).emit('player joined room', player[0])
        }
      } catch (error) {
        console.error(
          'Erreur lors de la tentative de rejoindre la salle :',
          error,
        )
        socket.emit('joinRoomError', error.message)
      }
    })

    socket.on('start game', async ({ roomId, players }) => {
      //console.log('roomId [start game]', roomId)
      //console.log('players [start game]', players)

      await game.startGame(players)
      let currentPlayer = await game.getCurrentPlayer()
      let cards = await gamesPlayers.start(roomId)

      console.log('currentPlayer [start game]', currentPlayer)
      console.log('cards [start game]', cards)

      io.to(parseInt(roomId)).emit('game started', { started: true, currentPlayer, cards })
    })
  })

  const findRoomIdByUserId = (userId) => {
    console.log('userId findRoomIdByUserId', userId)
    const rooms = io.sockets.adapter.rooms
    console.log('io.sockets.adapter.rooms findRoomIdByUserId', rooms)

    for (const [roomId, roomInfo] of rooms.entries()) {
      console.log('roomId findRoomIdByUserId', roomId)
      console.log('Informations sur la salle:', roomInfo)

      if (!isNaN(roomId) && roomInfo.has(userId)) {
        // Si l'utilisateur est présent dans cette salle et que la salle ne porte pas le nom de l'utilisateur
        console.log('return roomId')
        return roomId
      }
    }

    // Si l'utilisateur n'est pas présent dans aucune salle, retourner null
    return null
  }
}

module.exports = initializeSocket

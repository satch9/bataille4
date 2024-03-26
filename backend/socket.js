const socketio = require("socket.io");
const { Game } = require("./src/database/db");

const initializeSocket = (server) => {
    const io = socketio(server, {
        cors: {
            origin: "https://fluffy-engine-g4ppg4xj655hwwp6-5173.app.github.dev", // Modifier en fonction de votre configuration frontend
            methods: ["GET", "POST"],
        }
    });

    const Room = require("./src/models/Room");
    const Player = require("./src/models/Player");
    const Game = require("./src/models/Game");


    io.on("connection", (socket) => {
        const userId = socket.id
        console.log(`New connection: ${userId}`)

        socket.on("create room", async (values) => {
            console.log("Creating a new room...", values)

            const creator = new Player(userId, values.roomCreator)
            const playerId = await creator.saveCreatorToDatabase()
            console.log("playerId", playerId)

            const room = new Room(values.roomName, values.roomNumCards, playerId)
            const roomCreated = await room.createRoomToDatabase()

            socket.emit("created room", roomCreated)

            const game = new Game(roomCreated.room_id)
            const gameCreated = await game.createGameToDatabase()
        })

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`User ${userId} has disconnected.`);
        })

    })
}

module.exports = initializeSocket
const socketio = require("socket.io");

const initializeSocket = (server) => {
    /* const io = socketio(server, {
        cors: {
            origin: "https://fluffy-engine-g4ppg4xj655hwwp6-5173.app.github.dev", // Modifier en fonction de votre configuration frontend
            methods: ["GET", "POST"],
        }
    }); */
    const io = socketio(server, {
        cors: {
            origin: "http://localhost:5173", // Modifier en fonction de votre configuration frontend
            methods: ["GET", "POST"],
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.id;
        console.log(`User ${userId} has connected.`);

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log(`User ${userId} has disconnected.`);
        });
    })

}

module.exports = initializeSocket;
const express = require("express");
const http = require("http");
const cors = require("cors");
const initializeSocket = require("./socket");
const {
    sequelize
} = require("./src/database/db")

const app = express();
app.use(cors());
const server = http.createServer(app);
const port = process.env.Port || 4000;



// Synchronisez vos modèles avec la base de données
sequelize.sync()
    .then(() => {
        console.log('Base de données synchronisée avec succès.');
    })
    .catch((error) => {
        console.error('Erreur lors de la synchronisation de la base de données :', error);
    });

initializeSocket(server);

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})
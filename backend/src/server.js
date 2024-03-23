const express = require("express");
const http = require("http");
const cors = require("cors");
const initializeSocket = require("../src/utils/socket");

const app = express();
app.use(cors());
const server = http.createServer(app);
const port = process.env.Port || 4000;

initializeSocket(server);

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})
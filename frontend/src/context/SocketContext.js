import React from "react";
import socketio from "socket.io-client";

export const socket = socketio.connect('https://fluffy-engine-g4ppg4xj655hwwp6-4000.app.github.dev');
//export const socket = socketio.connect('http://localhost:4000');
//export const socket = socketio.connect("https://xg3tgf-4000.csb.app");
//console.log("socket [SocketContext]", socket)

export const SocketContext = React.createContext();

const express = require('express');
const app=express();
const server = require('http').Server(app);//to create a server to be used with socket.io
const { ExpressPeerServer } = require("peer"); 
const peerServer = ExpressPeerServer(server, { //to create a peer server to be used with peerjs
	debug: true,
	path: "/VidCall"
});
const cors = require('cors');

const PORT=process.env.PORT || 5000;

app.use(cors());

app.use("/", peerServer); 

app.get('/', (req, res) => { res.send("Server is running") }); //to check if server is running

server.listen(PORT, ()=>{console.log("App is available at http://localhost:"+PORT)});
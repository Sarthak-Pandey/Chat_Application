import {Server} from 'socket.io'


let io;

export function initializeServer(httpServer){

    
    io = new Server(httpServer,{
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    })

    console.log("Socket.io server is running");

    io.on("connection",(socket)=>{
        console.log("A user conneceted : " + socket.id);
    })
}


export function getIO(){

    if(!io){
        throw new Error("Socket.io is not initlized!");
    }
    return io;
}





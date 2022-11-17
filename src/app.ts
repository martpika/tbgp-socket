import { 
    Server, 
    Socket } from "socket.io"
import { createServer } from "http"
import express from "express"
import { Events } from "../events"
import { 
    Chat,
    CollabRooms, 
    WriteupRoom} from "../room"


const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://tbgpublications.vercel.app"
        ],
        credentials: true
    }
})

const collabRooms = new CollabRooms()

io.on(Events.connection, ( socket: Socket ) => {
    
    socket.on(Events.clients.create_collab_room, (writeupRoom: WriteupRoom) => {
        const collabRoom = collabRooms.checkIfRoomExist(writeupRoom.writeup)
     
        if ( !collabRoom ) {
            collabRooms.createRoomAndAddMember(writeupRoom, socket.id)
            
        } else {
            collabRooms.addMemberToRoom(writeupRoom, collabRoom, socket.id)
            socket.emit(Events.server.broadcast_previous_chats, collabRoom?.chats)
        }

        socket.join(writeupRoom.writeup)
    })
    
    socket.on(Events.clients.emit_title, ({ writeup, title }: { writeup: string, title: string }) => {
        socket.broadcast.to(writeup).emit(Events.server.broadcast_title, title)
    })

    socket.on(Events.clients.emit_caption, ({ writeup, caption }: { writeup: string, caption: string }) => {
        socket.broadcast.to(writeup).emit(Events.server.broadcast_caption, caption)
    })

    socket.on(Events.clients.emit_slate, ({ writeup, slate, editorId }: { writeup: string, slate: any, editorId: string }) => {
        socket.broadcast.to(writeup).emit(Events.server.broadcast_slate, {
            slate,
            editorId
        })
    })

    socket.on(Events.clients.send_chat, ( chat: Chat ) => {
        collabRooms.pushChatToRoom(chat)
        const { writeup, ...rest } = chat
        socket.broadcast.to(writeup).emit(Events.server.broadcast_chat, rest)
    })

    socket.on(Events.disconnect, () => {
        collabRooms.removeMemberFromRoom(socket.id)
    })
})

httpServer.listen(4000, () =>{
    console.log("Starting server at port 4000")
})
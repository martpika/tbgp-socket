import { 
    Server, 
    Socket } from "socket.io"
import { createServer } from "http"
import express from "express"
import { SocketEvents } from "../events"
import { 
    Chat,
    CollabRooms, 
    PartSubmission, 
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

io.on(SocketEvents.connection, ( socket: Socket ) => {
    
    socket.on(SocketEvents.clients.create_collab_room, (writeupRoom: WriteupRoom) => {
        const collabRoom = collabRooms.checkIfRoomExist(writeupRoom.writeup)
     
        if ( !collabRoom ) {
            collabRooms.createRoomAndAddMember(writeupRoom, socket.id)
        } else {
            collabRooms.addMemberToRoom(writeupRoom, collabRoom, socket.id)
            socket.emit(SocketEvents.server.broadcast_previous_chats, collabRoom?.chats)
            socket.broadcast.to(writeupRoom.writeup).emit(SocketEvents.server.broadcast_request_previous_slate, socket.id)
        }

        socket.join(writeupRoom.writeup)
    })

    socket.on(SocketEvents.clients.emit_previous_slate, ({ socketId, slate }: { socketId: string, slate: any }) => {
        socket.to(socketId).emit(SocketEvents.server.broadcast_previous_slate, slate)
    })
    
    socket.on(SocketEvents.clients.emit_title, ({ writeup, title }: { writeup: string, title: string }) => {
        socket.broadcast.to(writeup).emit(SocketEvents.server.broadcast_title, title)
    })

    socket.on(SocketEvents.clients.emit_caption, ({ writeup, caption }: { writeup: string, caption: string }) => {
        socket.broadcast.to(writeup).emit(SocketEvents.server.broadcast_caption, caption)
    })

    socket.on(SocketEvents.clients.emit_slate, ({ writeup, slate, editorId }: { writeup: string, slate: any, editorId: string }) => {
        console.log(slate)
        socket.broadcast.to(writeup).emit(SocketEvents.server.broadcast_slate, {
            slate,
            editorId
        })
    })

    socket.on(SocketEvents.clients.emit_part_submission, (submission: PartSubmission) =>{
        const { writeup, ...rest } = submission
        socket.broadcast.to(writeup).emit(SocketEvents.server.broadcast_part_submission, rest)
    })

    socket.on(SocketEvents.clients.emit_cancel_part_submission, ({ writeup, bastionId }: { writeup: string, bastionId: string }) =>{
        socket.broadcast.to(writeup).emit(SocketEvents.server.broadcast_cancel_part_submission, bastionId)
    })

    socket.on(SocketEvents.clients.send_chat, ( chat: Chat ) => {
        collabRooms.pushChatToRoom(chat)
        const { writeup, ...rest } = chat
        socket.broadcast.to(writeup).emit(SocketEvents.server.broadcast_chat, rest)
    })

    socket.on(SocketEvents.clients.emit_submit_writeup, ( writeup: string ) => {
        socket.broadcast.to(writeup).emit(SocketEvents.server.broadcast_submission, true)
    })

    socket.on(SocketEvents.disconnect, () => {
        collabRooms.removeMemberFromRoom(socket.id)
    })
})

httpServer.listen(4000, () =>{
    console.log("Starting server at port 4000")
})
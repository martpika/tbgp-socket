"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const events_1 = require("../events");
const room_1 = require("../room");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});
const collabRooms = new room_1.CollabRooms();
io.on(events_1.Events.connection, (socket) => {
    socket.on(events_1.Events.clients.create_collab_room, (writeupRoom) => {
        const collabRoom = collabRooms.checkIfRoomExist(writeupRoom.writeup);
        if (!collabRoom) {
            collabRooms.createRoomAndAddMember(writeupRoom, socket.id);
        }
        else {
            collabRooms.addMemberToRoom(writeupRoom, collabRoom, socket.id);
            socket.emit(events_1.Events.server.broadcast_previous_chats, collabRoom === null || collabRoom === void 0 ? void 0 : collabRoom.chats);
        }
        socket.join(writeupRoom.writeup);
    });
    socket.on(events_1.Events.clients.emit_title, ({ writeup, title }) => {
        socket.broadcast.to(writeup).emit(events_1.Events.server.broadcast_title, title);
    });
    socket.on(events_1.Events.clients.emit_caption, ({ writeup, caption }) => {
        socket.broadcast.to(writeup).emit(events_1.Events.server.broadcast_caption, caption);
    });
    socket.on(events_1.Events.clients.emit_slate, ({ writeup, slate, editorId }) => {
        socket.broadcast.to(writeup).emit(events_1.Events.server.broadcast_slate, {
            slate,
            editorId
        });
    });
    socket.on(events_1.Events.clients.send_chat, (chat) => {
        collabRooms.pushChatToRoom(chat);
        const { writeup } = chat, rest = __rest(chat, ["writeup"]);
        socket.broadcast.to(writeup).emit(events_1.Events.server.broadcast_chat, rest);
    });
    socket.on(events_1.Events.disconnect, () => {
        collabRooms.removeMemberFromRoom(socket.id);
    });
});
httpServer.listen(4000, () => {
    console.log("Starting server at port 4000");
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
exports.Events = {
    connection: "connection",
    disconnect: "disconnect",
    clients: {
        create_collab_room: "create_collab_room",
        emit_title: "emit_title",
        emit_caption: "emit_caption",
        emit_slate: "emit_slate",
        send_chat: "send_chat"
    },
    server: {
        broadcast_title: "broadcast_title",
        broadcast_caption: "broadcast_caption",
        broadcast_slate: "broadcast_slate",
        broadcast_previous_chats: "broadcast_previous_chats",
        broadcast_chat: "broadcast_chat"
    }
};

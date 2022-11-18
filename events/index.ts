

export const SocketEvents = {
    connection: "connection",
    disconnect: "disconnect",
    clients: {
        create_collab_room: "create_collab_room",
        emit_title: "emit_title",
        emit_caption: "emit_caption",
        emit_slate: "emit_slate",
        emit_previous_slate: "emit_previous_slate",
        send_chat: "send_chat",
        emit_part_submission: "emit_part_submission",
        emit_cancel_part_submission: "emit_cancel_part_submission",
        emit_submit_writeup: "emit_submit_writeup"
    },
    server: {
        broadcast_title: "broadcast_title",
        broadcast_caption: "broadcast_caption",
        broadcast_slate: "broadcast_slate",
        broadcast_request_previous_slate: "broadcast_request_previous_slate",
        broadcast_previous_slate: "broadcast_previous_slate",
        broadcast_previous_chats: "broadcast_previous_chats", 
        broadcast_chat: "broadcast_chat",
        broadcast_part_submission: "broadcast_part_submission",
        broadcast_cancel_part_submission: "broadcast_cancel_part_submission",
        broadcast_submission: "broadcast_submission"
    }
}
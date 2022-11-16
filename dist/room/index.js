"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollabRooms = void 0;
class CollabRooms {
    constructor() {
        this.collabRooms = [];
    }
    getCollabRooms() {
        return this.collabRooms;
    }
    checkIfRoomExist(writeup) {
        const foundRoom = this.collabRooms.find(room => room.writeup === writeup);
        return foundRoom;
    }
    createRoomAndAddMember(writeupRoom, socketId) {
        this.collabRooms.push({
            writeup: writeupRoom.writeup,
            members: [
                {
                    firstname: writeupRoom.firstname,
                    lastname: writeupRoom.lastname,
                    socketId
                }
            ],
            chats: []
        });
    }
    addMemberToRoom(writeupRoom, collabRoom, socketId) {
        collabRoom.members.push({
            firstname: writeupRoom.firstname,
            lastname: writeupRoom.lastname,
            socketId
        });
    }
    removeMemberFromRoom(socketId) {
        const currentRoom = this.collabRooms.find(room => room.members.find(member => member.socketId === socketId));
        if (currentRoom) {
            currentRoom.members = currentRoom.members.filter(member => member.socketId !== socketId);
            if (!(currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.members.length)) {
                this.removeRoom(currentRoom.writeup);
            }
        }
    }
    removeRoom(writeup) {
        this.collabRooms = this.collabRooms.filter(room => room.writeup !== writeup);
    }
    pushChatToRoom(chat) {
        const currentRoom = this.checkIfRoomExist(chat.writeup);
        if (currentRoom) {
            currentRoom.chats.push({
                member: chat.member,
                message: chat.message
            });
        }
    }
}
exports.CollabRooms = CollabRooms;

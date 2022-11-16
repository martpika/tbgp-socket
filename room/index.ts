

export type Member = {
    firstname: string,
    lastname: string,
}

export type MemberWithSocket = Member & {
    socketId: string
}

export type Room = {
    writeup: string
}

export type WriteupRoom = Room & MemberWithSocket

export type MemberWithUsername = Member & {
    username: string
}

export type Chat = {
    member: MemberWithUsername,
    message: string,
    writeup: string
}

export type CollabRoom = {
    writeup: string,
    members: MemberWithSocket[],
    chats: {
        member: MemberWithUsername,
        message: string
    }[]
}

export class CollabRooms  {
    collabRooms: CollabRoom[]

    constructor() {
        this.collabRooms = []
    }

    getCollabRooms() {
        return this.collabRooms
    }

    checkIfRoomExist( writeup: string ) {
        const foundRoom = this.collabRooms.find(room => room.writeup===writeup)

        return foundRoom
    }

    createRoomAndAddMember( writeupRoom: WriteupRoom, socketId: string ) {
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
        })
    }

    addMemberToRoom( writeupRoom: WriteupRoom, collabRoom: CollabRoom, socketId: string ) {
        collabRoom.members.push({
            firstname: writeupRoom.firstname,
            lastname: writeupRoom.lastname,
            socketId
        })
    }

    removeMemberFromRoom( socketId: string ) {
        const currentRoom = this.collabRooms.find(room => room.members.find(member => member.socketId===socketId))
        
        if ( currentRoom ) {
            currentRoom.members = currentRoom.members.filter(member => member.socketId!==socketId)
        
            if ( !currentRoom?.members.length ) {
                this.removeRoom(currentRoom.writeup)
            }
        }
    }

    removeRoom( writeup: string ) {
        this.collabRooms = this.collabRooms.filter(room => room.writeup!==writeup)
    }

    pushChatToRoom( chat: Chat ) {
        const currentRoom = this.checkIfRoomExist(chat.writeup)
      
        if ( currentRoom ) {
            currentRoom.chats.push({
                member: chat.member,
                message: chat.message
            })
        }
    }
}
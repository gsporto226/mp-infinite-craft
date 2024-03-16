export interface LobbyConfiguration {
    name: string
    gamemode: 'normal'
}

class ConnectedServerSession {
    constructor() { }

    disconnect() { }

    createLobby() { }
    joinLobby() { }
}

import type { Unsubscriber } from "svelte/store"
import type { Destroyable } from "./services"
import type { OwnedSynchronizedStorage } from "./synchronized_storage.service"
import type { Nullable } from "../utils/types"

export interface LobbyDescription {
    name: string
    gamemode: 'normal'
}

export class Lobby implements Destroyable {
    private subscriptions: Unsubscriber[] = []

    private defaultConfiguration: LobbyDescription = {
        name: '',
        gamemode: 'normal'
    }

    private description: Nullable<LobbyDescription> = null
    private isOwner: boolean

    constructor(private dependencies: { synchronizedLobbyDescription: OwnedSynchronizedStorage<LobbyDescription> }, params: { isOwner: boolean, initialLobbyConfiguration: Partial<LobbyDescription> }) {
        this.description = Object.assign(structuredClone(this.defaultConfiguration), params.initialLobbyConfiguration)
        this.isOwner = params.isOwner
        this.subscriptions.push(this.dependencies.synchronizedLobbyDescription.subscribe((value) => this.setDescription(value)))
    }

    setDescription(description: Nullable<LobbyDescription>) {
        this.description = description
    }

    changeConfiguration<Key extends keyof LobbyDescription>(key: Key, value: LobbyDescription[Key]) {
        if (!this.isOwner) {
            return
        }
        if (!this.description) {
            return
        }
        this.description[key] = value
        this.dependencies.synchronizedLobbyDescription.set(this.description)
    }

    async destroy(): Promise<void> {
        this.subscriptions.forEach(u => u())
    }
}


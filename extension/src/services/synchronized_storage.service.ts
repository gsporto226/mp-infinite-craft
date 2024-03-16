import { readable, writable } from "svelte/store"
import { Nullable } from "../utils/types"

export class OwnedSynchronizedStorage<T> {
    static private prefix = 'SynchronizedStorage_'

    private writable = writable<Nullable<T>>(null)

    subscribe = this.writable.subscribe.bind(this.writable)

    constructor(private dependencies: { websocketConnection: WebSocket }, private params: { key: string, owned: boolean }) {
        this.dependencies.websocketConnection.addEventListener(prefix + this.params.string, (event) => {
            // TODO: figure out what the fuck event is
        })
    }

    set(value: Nullable<T>) {
        if (!this.params.owned) {
            return false
        }
        this.writable.set(value)
        this.dependencies.websocketConnection.send(JSON.stringify(value))
        return true
    }

}

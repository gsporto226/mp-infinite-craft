import type { Nullable } from "../utils/types"

/**
 * Only works with values that can be JSON.stringified and parsed without special replacers and revivers
 */
export class Storage<T> {

    private storageProvider = localStorage

    private static keys: Set<string> = new Set()

    constructor(private key: string) {
        if (Storage.keys.has(key)) {
            throw new Error(`Key is already in use ${key}`)
        }
        Storage.keys.add(key)
    }

    get(): Nullable<T> {
        const string = this.storageProvider.getItem(this.key)
        if (!string) {
            return null
        }
        return JSON.parse(string)
    }

    set(v: T): void {
        this.storageProvider.setItem(this.key, JSON.stringify(v))
    }
}

import { writable, type StartStopNotifier } from "svelte/store";
import type { Nullable } from "../utils/types";
import type { LobbyConfiguration } from "./connected_server_session.service";

export type ItemID = string

export interface ServerSession {
    token: string
    server_address: string
    status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
}

export interface DiscoveryDescription {
    player_id: string
    timestamp: Date
}

export interface ItemDescription {
    name: string
    recipe: [ItemDescription, ItemDescription]
    emoji: string
}

export interface GameSession {
    id: string
    items: Record<string, ItemDescription>
    discoveries: Record<string, DiscoveryDescription>
}

export interface PlayerData {
    user_name: string
    id: string
    saved_sessions: Array<GameSession>
}

export function updatable<T>(value: T, start?: StartStopNotifier<T | undefined>) {
    const inner_store = writable(value, start)
    return {
        update: inner_store.update,
        subscribe: inner_store.subscribe
    }
}

export const playerData = writable<Nullable<PlayerData>>(null)

export const active_server_session = updatable<ServerSession>({
    token: '',
    server_address: '',
    status: 'disconnected'
})

export const active_game_session = writable<Nullable<GameSession>>(null)
export const active_lobby_configuration = writable<Nullable<LobbyConfiguration>>(null)
export const global_events = writable<Nullable<{ event: WindowEventMap[keyof WindowEventMap] }>>(null)



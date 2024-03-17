import { active_server_session, type ItemID } from "./stores"
import type { renderer } from "../rendering/renderer.js";
import type { Nullable } from "../utils/types";
import { NativeURLWrapper } from "../utils/url";
import type { IdentityPayload, WebsocketPayload } from "../../payload.types.d.ts"
import { get } from "svelte/store";

export interface Vector2D {
    x: number
    y: number
}

const PENDING_CONNECTION_STATES: number[] = [WebSocket.CONNECTING, WebSocket.OPEN]

export class GameClient {
    private rendererInstance: Nullable<ReturnType<typeof renderer>> = null
    private websocket: Nullable<WebSocket> = null

    private websocketEventHandlers: { [key in keyof WebSocketEventMap]: (event: WebSocketEventMap[key]) => void } = {
        message: this.onWebsocketMessage.bind(this),
        close: this.onCloseMessage.bind(this),
        open: this.onOpenMessage.bind(this),
        error: this.onErrorMessage.bind(this),
    }

    constructor() { }

    private onWebsocketMessage(websocket_event: MessageEvent<unknown>) {
        const payload = parse_payload(websocket_event.data)
        if (!payload) {
            console.error('>>> Unexpected websocket message structure, closing connection.', websocket_event.data)
            this.disconnect()
            return
        }
        switch (payload.kind) {
            case 'IDENTIFY':
                return this.handleIDENTIFYMessage()
            case 'IDENTIFIED':
                return this.handleIDENTIFIEDMessage()
            default:
                return this.handleUNKNOWNMessage(payload)
        }
    }

    private handleIDENTIFYMessage() {
        const user_token = get(active_server_session)?.token
        if (!user_token) {
            console.log('NO USER TOKEN, WHAT THE FUCK ARE YOU DOING MAN')
            this.disconnect()
            return
        }
        this.websocket?.send(JSON.stringify({ kind: 'IDENTITY', user_token } as IdentityPayload))
    }

    private handleIDENTIFIEDMessage() {
        active_server_session.update(session => {
            if (session) {
                session.status = 'connected'
            }
            return session
        })
    }

    private handleUNKNOWNMessage(payload: WebsocketPayload) {
        console.log('>>> Ignoring unknown message: ', payload)
    }

    private onCloseMessage(close_event: CloseEvent) {
        console.log('>>> Close: ', close_event)
        active_server_session.update((session) => {
            if (session) {
                console.log('>> Updated')
                session.status = 'disconnected'
            }
            return session
        })
    }
    private onOpenMessage(open_event: WebSocketEventMap['open']) {
        active_server_session.update((session) => {
            if (session) {
                session.status = 'connecting'
            }
            return session
        })
    }
    private onErrorMessage(error_event: WebSocketEventMap['error']) {
        console.error('>>>>>>>>>> ERRROOOOOO FUDEU: ', error_event)
        // the fuck happens here?
    }

    connect(params: { server_address: string, user_token: string, nickname: string }) {
        if (this.websocket && PENDING_CONNECTION_STATES.includes(this.websocket.readyState)) {
            this.disconnect()
        }
        console.log(NativeURLWrapper.withProtocol(params.server_address, 'ws').toString())
        this.websocket = new WebSocket(
            NativeURLWrapper.withProtocol(params.server_address, 'ws').toString()
        )
        active_server_session.update(session => {
            if (session) {
                session.status = 'connecting'
                session.token = params.user_token
                session.server_address = params.server_address
            }
            return session
        })
        for (const [key, handler] of Object.entries(this.websocketEventHandlers)) {
            this.websocket.addEventListener(key, handler as (ev: CloseEvent | Event | MessageEvent<any>) => void)
        }
    }

    disconnect() {
        if (this.websocket) {
            for (const [key, handler] of Object.entries(this.websocketEventHandlers)) {
                this.websocket.removeEventListener(key, handler as (ev: CloseEvent | Event | MessageEvent<any>) => void)
            }
            this.websocket?.close(1000, 'User disconnected')
        }
    }

    set_renderer_instance(instance: ReturnType<typeof renderer>): void {
        this.rendererInstance = instance
    }
    get_current_transformation_matrix() {
        return this.rendererInstance?.state.transformation
    }
    create_item(params: { item_id: ItemID, positioned?: Vector2D, offset?: Vector2D }) { }
    update_item_position(params: { instance_id: ItemID, position: Vector2D }) { }
    destroy_item(params: { instance_id: ItemID }) { }
    async request_item_lock(parmas: { instance_id: ItemID }): Promise<boolean> {
        return false
        // return
    }
}

function isWebsocketMessage(value: unknown): value is WebsocketPayload {
    return typeof value === 'object' && !!value && 'kind' in value && typeof value.kind === 'string'
}

function parse_payload(value: unknown): Nullable<WebsocketPayload> {
    if (typeof value !== 'string') {
        return null
    }
    try {
        const parsed = JSON.parse(value)
        if (isWebsocketMessage(parsed)) {
            return parsed
        }
    } catch { }
    return null
}

export const game_client = new GameClient({})

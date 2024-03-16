import { active_server_session, type ItemID } from "./stores"
import type { renderer } from "../rendering/renderer.js";
import type { Nullable } from "../utils/types";
import { NativeURLWrapper } from "../utils/url";

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

    constructor(private dependencies: {}) { }

    private onWebsocketMessage(websocket_event: MessageEvent<string>) {
        console.log('>>> Olha a mensagem: ', websocket_event)
        console.log('>>>', websocket_event.data)
    }
    private onCloseMessage(close_event: CloseEvent) {
        active_server_session.update((session) => {
            if (session) {
                session.status = 'disconnected'
            }
            return session
        })
    }
    private onOpenMessage(open_event: WebSocketEventMap['open']) {
        active_server_session.update((session) => {
            if (session) {
                session.status = 'connected'
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
            this.websocket?.close(2000, 'User disconnected')
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

export const game_client = new GameClient({})

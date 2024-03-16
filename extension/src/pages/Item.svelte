<script lang="ts">
    const MOUSE_LEFT = 0;
    const MOUSE_MIDDLE = 1;
    const MOUSE_RIGHT = 2;
    import {
        game_client,
        type Vector2D,
    } from "../services/game_client.service";
    import { global_events, type ItemID } from "../services/stores";
    export let instance_id: string;
    export let data: {
        item_id: ItemID;
        emoji: string;
        text: string;
        position: Vector2D;
    };
    let dragging = false;

    $: {
        if ($global_events) {
            if ($global_events.event.type === "mousemove") {
                onMouseMove($global_events.event as MouseEvent);
            }
            if ($global_events.event.type === "mouseup") {
                onMouseUp($global_events.event as MouseEvent);
            }
        }
    }

    function onDoubleClick(event: MouseEvent) {
        event.preventDefault();
        game_client.create_item({
            item_id: data.item_id,
            positioned: data.position,
            offset: { x: 5.0, y: 5.0 },
        });
    }

    function onMouseUp(event: MouseEvent) {
        if (event.button === MOUSE_RIGHT) {
            game_client.destroy_item({
                instance_id,
            });
        }
        console.log(event);
        if (event.button === MOUSE_LEFT) {
            console.log(dragging);
            dragging = false;
        }
        event.preventDefault();
    }

    function onMouseMove(event: MouseEvent) {
        if (dragging) {
            const scale =
                game_client.get_current_transformation_matrix()?.scale ?? 1;
            const scalar = 1 / scale;
            console.log("scalar", scalar);
            data.position = {
                x: data.position.x + event.movementX * scalar,
                y: data.position.y + event.movementY * scalar,
            };
            game_client.update_item_position({
                instance_id,
                position: data.position,
            });
        }
    }

    function onContextMenu(event: Event) {
        event.preventDefault();
    }

    function onMouseDown(event: MouseEvent) {
        event.preventDefault();
        if (event.button === MOUSE_LEFT) {
            dragging = true;
        }
    }
</script>

<div
    class="item"
    class:instance={!!instance_id}
    on:dblclick={onDoubleClick}
    on:mousedown={onMouseDown}
    on:contextmenu={onContextMenu}
    style:translate={`${data.position.x}px ${data.position.y}px`}
>
    <span class="instance-emoji">{data.emoji}</span>
    {data.text}
</div>

<style>
    .item:hover {
        background: var(--instance-bg-hover);
        border: 1px solid var(--instance-border-hover);
    }

    .instance {
        position: fixed;
        font-size: 19.5px;
        z-index: 11;
        left: 0;
        top: 0;
        padding: 11px 11px 10px;
        transition: scale 0.15s ease-in;
        border-radius: 5px;
        transform-origin: center center;
        display: flex;
        align-items: center;
        contain: layout;
        border: 1px solid var(--instance-border);
        background: var(--instance-bg);
    }

    .item {
        margin: 4px;
        cursor: pointer;
        padding: 8px 8px 7px;
        border-radius: 5px;
        display: inline-flex;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        border: 1px solid var(--border-color);
        transition: background 0.15s linear;
        background: var(--item-bg);
        line-height: 1em;
        contain: layout style paint;
    }

    .instance-emoji {
        font-size: 21px;
        margin-right: 5px;
    }
</style>

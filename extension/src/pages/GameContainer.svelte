<script lang="ts">
    import { renderer } from "../rendering/renderer.js";
    import { onMount } from "svelte";
    import { game_client } from "../services/game_client.service.js";

    onMount(() => {
        const container = document.getElementById("game_container")!;
        const world_container = document.getElementById("world_container")!;
        const instance = renderer({
            minScale: 0.1,
            maxScale: 2,
            element: container,
            scaleSensitivity: 100,
        });
        game_client.set_renderer_instance(instance);
        world_container.addEventListener("wheel", (event) => {
            event.preventDefault();
            instance.zoom({
                deltaScale: Math.sign(event.deltaY) > 0 ? -3 : 3,
                x: event.pageX,
                y: event.pageY,
            });
        });
        world_container.addEventListener("mousemove", (event) => {
            if (!event.ctrlKey) {
                return;
            }
            event.preventDefault();
            instance.panBy({
                originX: event.movementX,
                originY: event.movementY,
            });
        });
    });
</script>

<div id="world_container">
    <div id="game_container" class="game-container"></div>
</div>

<style>
    #world_container {
        width: 9999px;
        height: 9999px;
        background: var(--background-color);
        color: var(--text-color);
    }

    /* #world_container.sunmode { */
    /*     --text-color: #040404; */
    /*     --background-color: #fff; */
    /*     --border-color: #c8c8c8; */
    /*     --item-bg: #fff; */
    /*     --instance-bg: linear-gradient(0deg, #f7feff, #fff 70%); */
    /*     --instance-bg-hover: linear-gradient(0deg, #d6fcff, #fff 90%); */
    /*     --instance-border: #91a8c1; */
    /*     --instance-border-hover: #91a8c1; */
    /*     --sidebar-bg: hsla(0, 0%, 100%, 0.93); */
    /*     --discoveries-bg-active: #fff9ea; */
    /* } */

    .game-container {
        position: absolute;
    }
</style>

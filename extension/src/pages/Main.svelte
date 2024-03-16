<script lang="ts">
    import GameContainer from "./GameContainer.svelte";
    import {
        active_server_session,
        global_events,
    } from "../services/stores.js";
    import SessionJoin from "./SessionJoin.svelte";
    import Modal from "./Modal.svelte";
    import SessionDisplay from "./SessionDisplay.svelte";

    function emitWindowEvent(event: WindowEventMap[keyof WindowEventMap]) {
        global_events.set({ event });
    }

    let shouldShowSessionJoin = false;

    $: {
        shouldShowSessionJoin = $active_server_session?.status !== "connected";
    }
</script>

<SessionDisplay></SessionDisplay>
{#if shouldShowSessionJoin}
    <Modal>
        <SessionJoin></SessionJoin>
    </Modal>
{/if}
<GameContainer></GameContainer>
<svelte:window on:mousemove={emitWindowEvent} on:mouseup={emitWindowEvent} />

<style>
    :root {
        --border-color: #d1d1d1;
        --item-bg: #000;
        --instance-bg: linear-gradient(180deg, #22252b, #000 80%);
        --instance-bg-hover: linear-gradient(180deg, #3d4249, #000 80%);
        --instance-border: #dcdcdc;
        --instance-border-hover: #c7e0ff;
        --sidebar-bg: #000;
        --background-color: #000;
        --discoveries-bg-active: #423a24;
        --text-color: #fff;
    }
</style>

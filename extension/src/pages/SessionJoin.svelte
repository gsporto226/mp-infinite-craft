<script lang="ts">
    import { game_client } from "../services/game_client.service";
    import { Storage } from "../services/storage.service";
    import { active_server_session } from "../services/stores";
    import { NativeURLWrapper } from "../utils/url";
    const username_storage = new Storage<string>("username");
    const server_address_storage = new Storage<string>("server_address");
    const user_token_storage = new Storage<string>("user_token");
    let nickname = username_storage.get() ?? "";
    let server_address = server_address_storage.get() ?? "";
    let user_token = user_token_storage.get() ?? "";
    let disabled = false;
    let button_label = "";
    let button_disabled = true;
    $: {
        username_storage.set(nickname);
        server_address_storage.set(server_address);
        user_token_storage.set(user_token);
        const status = $active_server_session?.status;
        disabled = status !== "disconnected";
        button_label = status === "disconnected" ? "Connect" : "Disconnect";
        const valid = validation(server_address, user_token, nickname);
        button_disabled = !valid;
    }

    function validation(
        server_address: string,
        user_token: string,
        nickname: string,
    ) {
        if (server_address.length <= 0) {
            return false;
        }
        try {
            NativeURLWrapper.withProtocol(server_address, "wss");
        } catch (error) {
            console.error("Invalid server_address, error:", error);
            return false;
        }

        if (user_token.length <= 0) {
            return false;
        }
        if (nickname.length <= 0) {
            return false;
        }
        return true;
    }

    function changeConnectionStatus() {
        if ($active_server_session?.status === "disconnected") {
            game_client.connect({ server_address, user_token, nickname });
        } else {
            game_client.disconnect();
        }
    }
</script>

<div class="session-join">
    <fieldset class="fieldset">
        <legend>Join Session</legend>
        <input
            type="text"
            placeholder="Server address"
            bind:value={server_address}
            {disabled}
            required
        />
        <input
            type="text"
            placeholder="User Token"
            bind:value={user_token}
            {disabled}
            required
        />
        <input
            type="text"
            placeholder="Nickname"
            bind:value={nickname}
            {disabled}
            required
        />
        <button on:click={changeConnectionStatus} disabled={button_disabled}
            >{button_label}</button
        >
    </fieldset>
</div>

<style>
    .session-join {
        color: var(--text-color);
    }

    .fieldset {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>

<script lang="ts">
    import { active_server_session } from "../services/stores";
</script>

<div class="session-display-container">
    {$active_server_session?.status ?? "Unknown"}
</div>

<style>
    .session-display-container {
        color: var(--text-color);
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
    }
</style>

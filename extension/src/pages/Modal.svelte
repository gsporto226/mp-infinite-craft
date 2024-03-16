<script lang="ts">
</script>

<div class="modal">
    <slot />
</div>

<style>
    .modal {
        position: absolute;
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

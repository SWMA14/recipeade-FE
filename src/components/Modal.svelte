<script lang="ts">
    import { onDestroy } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { cubicIn, cubicOut } from "svelte/easing";
    import { stacks } from "../store";

    export let shown: boolean;

    $: if (shown)
        $stacks = [...$stacks, hide];

    onDestroy(hide);

    function hide()
    {
        shown = false;
        $stacks = $stacks.slice(0, -1);
    }
</script>

{#if shown}
    <div class="modal" in:fly={{ y: 30, easing: cubicOut, duration: 500 }} out:fade={{ duration: 250 }}>
        <slot />
    </div>
    <div class="overlay" on:keydown={hide} on:click={hide} transition:fade={{ duration: 250 }} />
{/if}

<style lang="postcss">
    .modal {
        width: 85%;
        max-width: var(--max-width);
        height: fit-content;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1002;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .overlay {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1001;
        background-color: rgba(0, 0, 0, 0.65);
        overflow-x: hidden;
    }
</style>
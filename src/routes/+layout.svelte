<script lang="ts">
    import "../app.css";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import { duration, flyingFade } from "$lib/transition";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import DynamicBar from "$components/DynamicBar.svelte";

    let dynamicBarContext = writable({} as DynamicBarContext);
    setContext("dynamicBar", dynamicBarContext);
</script>

<main>
    <slot />
</main>
{#if !$dynamicBarContext.isHidden}
    <div class="navigation" transition:flyingFade={{ duration }}>
        <DynamicBar leading={$dynamicBarContext.leading} main={$dynamicBarContext.main} trailing={$dynamicBarContext.trailing} />
    </div>
    <div class="overlay" />
{/if}

<style>
    main {
        width: 100%;
        max-width: var(--max-width);
        margin: 0 auto;
        margin-top: 2rem;
        padding: 0 var(--padding);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media only screen and (min-width: 64rem) {
        main {
            padding: 0;
        }
    }

    .navigation {
        width: calc(100% - var(--space-xs) * 2);
        position: fixed;
        bottom: var(--space-xs);
        left: var(--space-xs);
        z-index: 10;
    }

    .overlay {
        width: 100%;
        height: calc(var(--space-xl) * 2);
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 1;
        background-image: linear-gradient(to top, var(--white) 15%, transparent);
    }
</style>
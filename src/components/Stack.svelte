<script lang="ts">
    import { onDestroy } from "svelte";
    import { stacks } from "../store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { duration, flyingFade } from "$lib/transition";
    import DynamicBar from "$components/DynamicBar.svelte";

    export let dynamicBarContext: DynamicBarContext;
    export let onBack: () => void;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    $stacks = [...$stacks, onBack];
    
    onDestroy(() => {
        document.body.style.overflow = "";
        document.body.style.height = "";
        $stacks = $stacks.slice(0, -1);
    });
</script>

<div class="panel" transition:flyingFade={{ duration: duration * 2, y: 50 }}>
    <div class="upper-bar">
        <DynamicBar {...dynamicBarContext} />
    </div>
    <slot />
</div>

<style>
    .panel {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1001;
        background-color: var(--white);
        overflow-y: scroll;
    }

    .panel::-webkit-scrollbar {
        display: none;
    }

    .upper-bar {
        width: 100%;
        padding: var(--space-3xs) var(--space-xs);
        padding-top: calc(var(--space-3xs) + env(safe-area-inset-top));
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1002;
        background-color: var(--white);
    }
</style>
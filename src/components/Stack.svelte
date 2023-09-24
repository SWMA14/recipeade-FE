<script lang="ts">
    import { onDestroy } from "svelte";
    import { quartIn } from "svelte/easing";
    import { stacks } from "../store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { duration, flyingFade } from "$lib/transition";
    import DynamicBar from "$components/DynamicBar.svelte";
    import main from "./__stackUpperBarComponents/main.svelte";
    import leading from "./__stackUpperBarComponents/leading.svelte";

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

<div class="panel" in:flyingFade={{ duration: duration * 3, y: 50 }} out:flyingFade={{ duration: duration * 3, easing: quartIn, y: 50}}>
    <div class="upper-bar">
        <DynamicBar {...dynamicBarContext} {leading} {main} />
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
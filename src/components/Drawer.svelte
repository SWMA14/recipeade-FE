<script lang="ts">
    import { onMount, getContext } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { expoOut } from "svelte/easing";
    import { stacks } from "../store";

    export let heading: string | undefined = undefined;
    export let shown = false;
    export let onShow: (() => void) | undefined = undefined;
    export let onHide: (() => void) | undefined = undefined;

    const device: "ios" | "android" | "web" = getContext("device");

    let modifier = 1;
    let innerWidth = 0;
    let drawerHeight = 0;
    let drawerBottomAdjustment = 0;
    let pressed = false;
    let startY = 0;
    let oldY = 0;

    $: if (shown)
    {
        modifier = Math.min(1, 1 - ((oldY - startY) / drawerHeight));
        const medium = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--space-m"));
        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const scale = (innerWidth - medium * fontSize * modifier) / innerWidth;

        const main = document.querySelector("main")!;

        main.style.borderRadius = `calc(var(--radius) * ${modifier})`;
        main.style.transform = `scale(${scale}) translate3d(0, calc(env(safe-area-inset-top) + var(--space-xs) * ${modifier}), 0)`;
        document.body.classList.add("drawer-shown");
    }

    onMount(() => {
        return hide;
    });

    export function show()
    {
        shown = true;
        $stacks = [...$stacks, hide];
        onShow?.();
    }

    export function hide()
    {
        const main = document.querySelector("main")!;

        main.style.transform = "";
        main.style.removeProperty("border-radius");
        document.body.classList.remove("drawer-shown");

        shown = false;
        $stacks = $stacks.slice(0, -1);
        onHide?.();
    }

    function startTouch(e: MouseEvent | TouchEvent)
    {
        pressed = true;
        startY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    }

    function moveTouch(e: MouseEvent | TouchEvent)
    {
        if (!pressed)
            return;

        oldY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        drawerBottomAdjustment = Math.max(oldY - startY, 0);
    }

    function endTouch()
    {
        pressed = false;

        if (oldY - startY >= drawerHeight / 5)
            hide();

        startY = oldY = 0;
        drawerBottomAdjustment = 0;
    }
</script>

<svelte:window bind:innerWidth />

{#if shown}
    <div class="drawer" class:transition={!pressed} class:ios={device === "ios"} style="--bottom: {drawerBottomAdjustment}px;"
        in:fly={{ y: "100vh", opacity: 1, easing: expoOut, duration: 600 }} out:fly={{ y: "100vh", opacity: 1, duration: 350 }}
        bind:clientHeight={drawerHeight} on:touchstart={startTouch} on:touchmove={moveTouch} on:touchend={endTouch}>
        <div class="handle"  />
        {#if heading}
            <h3>{heading}</h3>
        {/if}
        <slot />
    </div>
    <div class="overlay" role="button" tabindex="0" style="--modifier: {modifier};"
        on:keydown={hide} on:click={hide} transition:fade={{ duration: 350 }} />
{/if}

<style lang="postcss">
    .drawer {
        width: calc(100% + var(--space-m));
        height: fit-content;
        padding: var(--space-xs);
        padding-bottom: calc(var(--space-3xl) + var(--space-xs));
        position: fixed;
        left: calc(var(--space-xs) * -1);
        bottom: calc(var(--space-xl) * -1 - var(--bottom));
        z-index: 999;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--white);
        border-radius: var(--radius) var(--radius) 0 0;
        touch-action: none;

        &.transition {
            transition: top 0.25s;
        }

        &.ios {
            padding-bottom: calc(var(--space-3xl) + var(--space-s));
        }

        & .handle {
            width: var(--space-3xl);
            height: var(--space-2xs);
            margin-bottom: var(--space-m);
            background-color: var(--gray-200);
            border-radius: var(--radius-big);
        }

        & h3 {
            align-self: flex-start;
            margin-bottom: var(--space-m);
        }
    }

    .overlay {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 998;
        background-color: rgba(0, 0, 0, calc(var(--overlay-opacity) * var(--modifier)));
        overflow-x: hidden;
    }
</style>
<script lang="ts">
    import { fade } from "svelte/transition";
    import { duration } from "$lib/transition";

    export let fixedPosition = false;

    const margin = { x: 3, y: 3 };

    let innerWidth: number, innerHeight: number, width: number, height: number, scrollX: number, scrollY: number;
    let isHovered = false;
    let position = { x: 0, y: 0 };
    let tooltip: HTMLElement;

    function handleFocus()
    {
        isHovered = true;
    }

    function handleMouseOver(event: MouseEvent)
    {
        width = tooltip.getBoundingClientRect().width;
        height = tooltip.getBoundingClientRect().height;
        isHovered = true;

        const x = event.pageX + margin.x;
        const y = event.pageY + margin.y;

        position = {
            // x: event.screenX + width >= innerWidth ? x - width : x,
            x: x,
            y: event.screenY + height >= innerHeight ? y - height : y
        };
    }

    function handleMouseMove(event: MouseEvent)
    {
        const clientRect = tooltip.getBoundingClientRect();
        width = clientRect.width;
        height = clientRect.height;

        const x = event.pageX + margin.x;
        const y = event.pageY + margin.y;

        position = {
            x: x,
            y: event.screenY + height >= innerHeight ? y - height : y
        };
    }

    function handleMouseLeave()
    {
        isHovered = false;
    }
</script>

<svelte:window bind:innerWidth bind:innerHeight bind:scrollX bind:scrollY />

<div class="tooltip" style="--top: {position.y}px; --left: {position.x}px;" bind:this={tooltip}>
    {#if isHovered}
        <div in:fade={{ delay: 30, duration }} out:fade={{ duration }}>
            <slot name="tooltip" />
        </div>
    {/if}
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:focus={handleFocus} on:mouseover={handleMouseOver} on:mousemove={handleMouseMove} on:mouseleave={handleMouseLeave}>
    <slot name="content" />
</div>

<style>
    .tooltip {
        position: absolute;
        top: var(--top);
        left: var(--left);
        z-index: 1;
    }

    .hidden {
        display: none;
    }
</style>
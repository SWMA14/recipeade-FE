<script lang="ts">
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import Drawer from "$components/Drawer.svelte";
    import Skeleton from "$components/Skeleton.svelte";

    export let skeleton = false;
    export let leftOverflow = false;
    export let rightOverflow = false;
    export let heading: string | undefined = undefined;
    export let body: string | undefined = undefined;
    export let canShowAll = false;
    export let onScroll: ((e: any) => void) | undefined = undefined;
    export let onScrollEnd: (() => void) | undefined = undefined;

    let device = getContext("device");
    let showAllDrawerShow: () => void;
    let showAllDrawerHide: () => void;

    function onActualScroll(e: any)
    {
        onScroll?.(e);

        if (e.target.scrollLeft + e.target.clientWidth >= e.target.scrollWidth)
            onScrollEnd?.();
    }
</script>

<div class="container">
    {#if heading || body}
        <div class="title">
            <div class="heading">
                {#if heading}
                    {#if skeleton}
                        <Skeleton />
                    {:else}
                        <h2>{heading}</h2>
                    {/if}
                {/if}
                {#if canShowAll && !skeleton}
                    <span class="show-all typo-body-2" role="button" tabindex="0" on:click={showAllDrawerShow} on:keydown={showAllDrawerShow}>
                        {$_("page.showAll")}
                    </span>
                {/if}
            </div>
            {#if body}
                <span>{body}</span>
            {/if}
        </div>
    {/if}
    <div class="scroll" class:left-overflow={leftOverflow} class:right-overflow={rightOverflow} on:scroll={onActualScroll}>
        <slot />
    </div>
</div>
<Drawer {heading} noBottomPadding bind:show={showAllDrawerShow} bind:hide={showAllDrawerHide}>
    <div class="grid" class:ios={device === "ios"}
        on:touchstart={e => e.stopPropagation()} on:touchmove={e => e.stopPropagation()} on:touchend={e => e.stopPropagation}>
        <slot name="grid" />
    </div>
</Drawer>

<style lang="postcss">
    .container {
        width: auto;
    }

    .title {
        margin-bottom: var(--space-2xs);
        display: flex;
        flex-direction: column;
    }

    .heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .show-all {
        color: var(--gray-400);
    }

    .scroll {
        display: flex;
        scroll-snap-type: x mandatory;
        scroll-padding-left: var(--space-xs);
        -webkit-overflow-scrolling: touch;
        overflow-x: scroll;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .grid {
        width: 100%;
        padding-bottom: calc(var(--space-3xl) + var(--space-m));
        display: flex;
        flex-direction: column;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            display: none;
        }

        &.ios {
            padding-bottom: calc(var(--space-3xl) + var(--space-l));
        }
    }

    .left-overflow {
        margin-left: calc(var(--space-xs) * -1);
    }

    .right-overflow {
        margin-right: calc(var(--space-xs) * -1);
    }
</style>
<script lang="ts">
    import type { SpaceType } from "../lib/types";

    export let skeleton = false;
    export let backgroundColor = "gray-100";
    export let heading: string | undefined = undefined;
    export let body: string | undefined = undefined;
    export let modifier: string | undefined = undefined;
    export let darkOverlay: number | undefined = undefined;
    export let visibleOverflow = false;
    export let noRadius = false;
    export let noPadding = false;
    export let noMinWidth = false;
    export let largePadding = false;
    export let columnFlex = false;
    export let leftMargin: SpaceType | undefined = undefined;
    export let rightMargin: SpaceType | undefined = undefined;
    export let topMargin: SpaceType | undefined = undefined;
    export let bottomMargin: SpaceType | undefined = undefined;
    export let scrollSnap = false;
    export let square = false;
    export let squareOverflowSafeArea = false;

    let leftMarginValue = leftMargin ? `var(--space-${leftMargin})` : undefined;
    let rightMarginValue = rightMargin ? `var(--space-${rightMargin})` : undefined;
    let topMarginValue = topMargin ? `var(--space-${topMargin})` : undefined;
    let bottomMarginValue = bottomMargin ? `var(--space-${bottomMargin})` : undefined;
</script>

<div class="container" class:skeleton
    style="--card-background-color: var(--{backgroundColor}); --left-margin: {leftMarginValue}; --right-margin: {rightMarginValue};
    --top-margin: {topMarginValue}; --bottom-margin: {bottomMarginValue};"
    class:no-radius={noRadius} class:no-padding={noPadding} class:no-min-width={noMinWidth} class:large-padding={largePadding}
    class:column-flex={columnFlex} class:scroll-snap={scrollSnap} class:left-margin={leftMargin} class:right-margin={rightMargin}
    class:top-margin={topMargin} class:bottom-margin={bottomMargin} class:square class:overflow-safe-area={squareOverflowSafeArea}
    class:visible-overflow={visibleOverflow}>
    {#if skeleton}
        <div class="skeleton-overlay" />
    {/if}
    {#if heading || body || modifier}
        <div class="texts" class:flex-end={!heading} class:large-padding={largePadding}
            class:dark-overlay={darkOverlay} class:overflow-safe-area={squareOverflowSafeArea}>
            {#if heading}
                <h1>{@html heading}</h1>
            {/if}
            <div class="body">
                {#if modifier}
                    <span class="modifier-text typo-body-2" class:dark-overlay={darkOverlay}>{@html modifier}</span>
                {/if}
                {#if body}
                    <span class="body-text">{@html body}</span>
                {/if}
            </div>
        </div>
    {/if}
    {#if darkOverlay}
        <div class="overlay" style="--opacity: {darkOverlay};" />
    {/if}
    <slot />
</div>

<style lang="postcss">
    .container {
        width: 100%;
        min-width: var(--card-min-width);
        padding: var(--space-xs);
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--card-background-color);
        border-radius: var(--radius);
        overflow: hidden;

        &.skeleton {
            background-color: var(--gray-200);
        }
    }

    .skeleton-overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--gray-200);
        z-index: 1;
    }

    .texts {
        width: 100%;
        height: 100%;
        padding: var(--space-xs);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &.large-padding {
            padding: var(--space-m);

            &.overflow-safe-area {
               padding-top: calc(var(--space-m) + env(safe-area-inset-top));
            }
        }

        &.dark-overlay {
            color: var(--white);
        }

        &.overflow-safe-area {
            padding-top: calc(var(--space-xs) + env(safe-area-inset-top));
        }
    }

    .flex-end {
        justify-content: flex-end;
    }

    .body {
        display: flex;
        flex-direction: column;
    }

    .modifier-text {
        color: var(--gray-800);

        &.dark-overlay {
            color: var(--gray-200);
        }
    }

    .body-text {
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--gray-900);
        opacity: var(--opacity);
        z-index: 1;
    }

    .visible-overflow {
        overflow: visible;
    }

    .no-radius {
        border-radius: 0;
    }

    .no-padding {
        padding: 0;
    }

    .no-min-width {
        min-width: 0;
    }

    .large-padding {
        padding: var(--space-m);
    }

    .column-flex {
        flex-direction: column;
    }

    .left-margin {
        margin-left: var(--left-margin);
    }

    .right-margin {
        margin-right: var(--right-margin);
    }

    .top-margin {
        margin-top: var(--top-margin);
    }

    .bottom-margin {
        margin-bottom: var(--bottom-margin);
    }

    .scroll-snap {
        scroll-snap-align: start;
        scroll-snap-stop: always;
    }

    .square {
        padding-bottom: calc(100% - var(--space-xs));

        &.no-padding {
            padding-bottom: 100%;
        }

        &.overflow-safe-area {
            margin-top: calc(env(safe-area-inset-top) * -1);
            padding-bottom: calc(100% - var(--space-xs) + env(safe-area-inset-top));
        }
    }
</style>
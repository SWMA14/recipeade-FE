<script lang="ts">
    import Player from "youtube-player";
    import type { Options, YouTubePlayer } from "youtube-player/dist/types";
    import type { SpaceType } from "$lib/types";

    export let backgroundColor = "gray-100";
    export let video: string | undefined = undefined;
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
    export let bottomMargin = false;
    export let scrollSnap = false;
    export let square = false;
    export let squareOverflowSafeArea = false;

    let options: Options = {
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: video
        }
    };

    let player: YouTubePlayer | HTMLElement;

    $: if (video && player)
    {
        player = Player(player, options);
        player.loadVideoById(video, 0, "small");
        player.mute();
        player.seekTo(0, true); // 다시 버퍼해서 변경된 동영상 화질 적용
    }

    let leftMarginValue = leftMargin ? `var(--space-${leftMargin})` : undefined;
    let rightMarginValue = rightMargin ? `var(--space-${rightMargin})` : undefined;
</script>

<div class="container" 
    style="--card-background-color: var(--{backgroundColor}); --left-margin: {leftMarginValue}; --right-margin: {rightMarginValue};"
    class:no-radius={noRadius} class:no-padding={noPadding} class:no-min-width={noMinWidth} class:large-padding={largePadding}
    class:column-flex={columnFlex} class:scroll-snap={scrollSnap} class:left-margin={leftMargin} class:right-margin={rightMargin}
    class:bottom-margin={bottomMargin} class:square class:overflow-safe-area={squareOverflowSafeArea} class:visible-overflow={visibleOverflow}>
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
    {#if video}
        <div class="player" bind:this={player} />
    {/if}
</div>

<style lang="postcss">
    .container {
        width: 100%;
        height: inherit;
        min-width: var(--card-min-width);
        padding: var(--space-xs);
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--card-background-color);
        border-radius: var(--radius);
        overflow: hidden;
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

    .player {
        width: 250%;
        height: 250%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
        background-color: var(--gray-900);
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

    .bottom-margin {
        margin-bottom: var(--space-xs);
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
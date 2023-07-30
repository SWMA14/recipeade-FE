<script lang="ts">
    import Player from "youtube-player";
    import type { Options, YouTubePlayer } from "youtube-player/dist/types";

    export let backgroundColor = "gray-100";
    export let video: string | undefined = undefined;
    export let start = 0;
    export let heading: string | undefined = undefined;
    export let body: string | undefined = undefined;
    export let modifier: string | undefined = undefined;
    export let darkOverlay = false;
    export let visibleOverflow = false;
    export let noRadius = false;
    export let noPadding = false;
    export let noMinWidth = false;
    export let largePadding = false;
    export let columnFlex = false;
    export let leftMargin = false;
    export let rightMargin = false;
    export let bottomMargin = false;
    export let scrollSnap = false;
    export let square = false;

    let options: Options = {
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            start,
            loop: 1,
            playlist: video
        }
    };

    let player: YouTubePlayer | HTMLElement;

    $: if (video && player)
    {
        player = Player(player, options);
        player.loadVideoById(video, start, "small");
        player.mute();
        player.seekTo(start, true); // 다시 버퍼해서 변경된 동영상 화질 적용
    }
</script>

<div class="container" style="--card-background-color: var(--{backgroundColor});" class:visible-overflow={visibleOverflow}
    class:no-radius={noRadius} class:no-padding={noPadding} class:no-min-width={noMinWidth} class:large-padding={largePadding}
    class:column-flex={columnFlex} class:scroll-snap={scrollSnap} class:left-margin={leftMargin} class:right-margin={rightMargin}
    class:bottom-margin={bottomMargin} class:square>
    {#if heading || body || modifier}
        <div class="texts" class:flex-end={!heading} class:dark-overlay={darkOverlay}>
            {#if heading}
                <h1>{heading}</h1>
            {/if}
            <div class="body">
                {#if modifier}
                    <span class="modifier-text typo-body-2" class:dark-overlay={darkOverlay}>{modifier}</span>
                {/if}
                {#if body}
                    <span class="body-text">{body}</span>
                {/if}
            </div>
        </div>
    {/if}
    {#if darkOverlay}
        <div class="overlay" />
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

        &.dark-overlay {
            color: var(--white);
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
        opacity: var(--overlay-opacity);
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
        margin-left: var(--space-xs);
    }

    .right-margin {
        margin-right: var(--space-xs);
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
    }
</style>
<script lang="ts">
    import Player from "youtube-player";
    import type { Options, YouTubePlayer } from "youtube-player/dist/types";
    import { beforeNavigate } from "$app/navigation";
    import { sharedPlayer } from "../../store";

    export let data;

    let options: Options = {
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            controls: 0,
            fs: 0,
            rel: 0
        }
    };

    let player: YouTubePlayer | HTMLElement;
    let playerHeight: number;

    $: if (player)
    {
        player = Player(player, options);
        player.loadVideoById(data.id);
        sharedPlayer.set(player);
    }

    beforeNavigate(({ from }) => {
        if (from && from.url.pathname.endsWith("/cook"))
            (player as YouTubePlayer).seekTo(0, true);
    });
</script>

<div class="player-container" bind:clientHeight={playerHeight}>
    <div id="player" class="player" bind:this={player} />
</div>
<div class="content" style="--top: {playerHeight}px;">
    <slot />
</div>

<style>
    .player-container {
        width: 100%;
        /* max-width: var(--max-width); */
        margin-top: calc(var(--space-2xl) + env(safe-area-inset-top));
        position: fixed;
        top: 0;
        z-index: 9;
        background-color: var(--white);
        overflow: hidden;
    }

    .player {
        width: 100%;
        max-height: calc(100vw * 9 / 16);
    }

    .content {
        width: 100%;
        margin-top: calc(var(--top) + var(--space-xs) + env(safe-area-inset-top));
        padding-bottom: calc(var(--space-xl) + var(--space-xs));
    }

    @media only screen and (min-width: 48rem) {
        .player {
            max-height: calc(70vw * 9 / 16);
        }

        .content {
            /* margin-top: calc(calc(70vw * 9 / 16) + var(--space-xs)); */
        }
    }
</style>
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
    <div class="background" />
</div>
<div class="content" style="--top: {playerHeight}px;">
    <slot />
</div>

<style>
    .background {
        width: 100%;
        height: calc(100vw * 9 / 16);
        background-color: var(--gray-900);
        position: absolute;
        top: 0;
        z-index: -1;
        border-radius: 0 0 var(--radius) var(--radius);
    }

    .player-container {
        width: 100%;
        max-height: 50vh;
        margin-top: env(safe-area-inset-top);
        position: fixed;
        top: 0;
        z-index: 9;
        overflow: hidden;
    }

    .player {
        width: 100%;
        max-height: calc(100vw * 9 / 16);
        border-radius: 0 0 var(--radius) var(--radius);
    }

    .content {
        width: 100%;
        margin-top: calc(var(--top) + var(--space-xs) + env(safe-area-inset-top));
        padding-bottom: calc(var(--space-xl) + var(--space-xs));
    }
</style>
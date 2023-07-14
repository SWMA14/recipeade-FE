<script lang="ts">
    import Player from "youtube-player";
    import type { Options, YouTubePlayer } from "youtube-player/dist/types";

    export let data;

    let options: Options = {
        playerVars: {
            modestbranding: 1,
            controls: 0,
            fs: 0,
            rel: 0
        }
    };
    let player: YouTubePlayer | HTMLElement;
    $: if (player) {
        player = Player(player, options);
        player.loadVideoById(data.id);
    }
</script>

<div class="player-container">
    <div class="player" bind:this={player} />
</div>
<div class="content">
    <slot />
</div>

<style>
    .player-container {
        width: 100%;
        max-width: var(--max-width);
        border-radius: 0 0 var(--radius) var(--radius);
        overflow: hidden;
        position: fixed;
        margin-bottom: 10rem;
        padding-bottom: 56;
        top: 0;
        z-index: 1;
    }

    .player {
        width: 100%;
        max-height: calc(98vw * 9 / 16);
    }

    .content {
        width: 100%;
        margin-top: 21rem;
        margin-bottom: 5rem;
    }
</style>
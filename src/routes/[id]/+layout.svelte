<script lang="ts">
    import Player from "youtube-player";
    import type { Options, YouTubePlayer } from "youtube-player/dist/types";
    import { beforeNavigate, goto } from "$app/navigation";
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
    $: if (player)
    {
        player = Player(player, options);
        player.loadVideoById(data.id);
        sharedPlayer.set(player);
    }

    beforeNavigate(({ from }) => {
        if (from && from.url.pathname.endsWith("/cook"))
        {
            console.log("hi");
            (player as YouTubePlayer).seekTo(0, true);
        }
    });
</script>

<div class="upper">
    <div style="height: 3rem; background-color: var(--c-background);" />
    <div class="player-container">
        <div id="player" class="player" bind:this={player} />
    </div>
</div>
<div class="content">
    <slot />
</div>

<style>
    .upper {
        width: 100%;
        max-width: var(--max-width);
        position: fixed;
        top: 0;
        z-index: 1;
    }

    .player-container {
        border-radius: 0 0 var(--radius) var(--radius);
        overflow: hidden;
    }

    .player {
        width: 100%;
        max-height: calc(calc(100vw - 15px) * 9 / 16);
    }

    .content {
        width: 100%;
        margin-top: min(24rem, calc(calc(98vw * 9 / 16) + 1.5rem));
        margin-bottom: 5rem;
    }
</style>
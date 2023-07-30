<script lang="ts">
    import Player from "youtube-player";
    import type { Options, YouTubePlayer } from "youtube-player/dist/types";
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
    import { beforeNavigate } from "$app/navigation";
    import { sharedPlayer } from "../../store";
    import Button from "$components/Button.svelte";

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
            (player as YouTubePlayer).seekTo(0, true);
    });
</script>

<div class="upper">
    <div class="back-button">
        <Button kind="white" icon={faArrowLeft} noHover on:click={() => history.back()} />
    </div>
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
        background-color: var(--white);
        z-index: 1;
    }

    .back-button {
        width: var(--space-xl);
    }

    .player-container {
        border-radius: 0 0 var(--radius) var(--radius);
        overflow: hidden;
    }

    .player {
        width: 100%;
        max-height: calc(100vw * 9 / 16);
    }

    .content {
        width: 100%;
        margin-top: min(24rem, calc(calc(98vw * 9 / 16) + var(--space-xs)));
        margin-bottom: calc(var(--space-xl) + var(--space-xs) * 2);
    }
</style>
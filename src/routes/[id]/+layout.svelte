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
<div class="lower">
    <div class="buttons">
        <button class="outline like">👍</button>
        <button class="start" on:click={() => goto(`/${data.id}/cook`)}>요리 시작하기</button>
    </div>
    <div class="shadow" />
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

    .buttons {
        width: calc(100% - var(--padding) * 2);
        max-width: var(--max-width);
        margin-top: 2rem;
        display: flex;
        position: fixed;
        left: 50%;
        bottom: 1rem;
        transform: translateX(-50%);
        z-index: 1;
    }

    .buttons .like {
        width: 3rem;
        margin-right: 0.5rem;
    }

    .buttons .start {
        width: 100%;
    }

    .shadow {
        width: 100%;
        height: 6rem;
        position: fixed;
        left: 0;
        bottom: 0;
        background-image: linear-gradient(to top, var(--c-background) 15%, transparent 100%);
    }
</style>
<script lang="ts">
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
    import Player from "youtube-player";
    import type { Options, YouTubePlayer } from "youtube-player/dist/types";
    import { getContext } from "svelte";
    import { beforeNavigate } from "$app/navigation";
    import { sharedPlayer, cookingFullscreen } from "../../store";
    import Button from "$components/Button.svelte";

    export let data;

    let options: Options = {
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            controls: 1,
            fs: 0,
            rel: 0
        }
    };

    let player: YouTubePlayer | HTMLElement;
    let playerHeight: number;
    let device: "ios" | "android" | "web" = getContext("device");

    $: if (player)
    {
        player = Player(player, options);
        player.loadVideoById(data.id);
        $sharedPlayer = player;
    }

    beforeNavigate(({ from }) => {
        if (from && from.url.pathname.endsWith("/cook"))
            (player as YouTubePlayer).seekTo(0, true);
    });

    function moveToRoot(node: HTMLElement)
    {
        document.body.appendChild(node);
    }
</script>

<div class="player-container" class:fullscreen={$cookingFullscreen} use:moveToRoot bind:clientHeight={playerHeight}>
    {#if !$cookingFullscreen}
        <div style="background-color: var(--gray-900);">
            <Button kind="black" icon={faArrowLeft} style="width: var(--space-xl);" on:click={() => history.back()} />
        </div>
    {/if}
    <div id="player" class="player" class:fullscreen={$cookingFullscreen} bind:this={player} />
</div>
<div class="background" class:ios={device === "ios"} />
<div class="content" class:ios={device === "ios"} class:fullscreen={$cookingFullscreen} style="--top: {playerHeight}px;">
    <slot />
</div>

<style lang="postcss">
    .background {
        width: 100%;
        height: calc(100vw * 9 / 16);
        max-height: calc(50vh - calc(var(--space-xl) * 2 + env(safe-area-inset-top)));
        margin-top: calc(var(--space-xl) + env(safe-area-inset-top));
        background-color: var(--gray-900);
        position: fixed;
        top: 0;
        z-index: 1;
        border-radius: 0 0 var(--radius) var(--radius);

        &.ios {
            top: calc(env(safe-area-inset-top) * -1);
        }
    }

    .player-container {
        width: 100%;
        max-height: 50vh;
        margin-top: env(safe-area-inset-top);
        position: fixed;
        top: 0;
        z-index: 9;
        overflow: hidden;

        &.fullscreen {
            width: 100vw;
            height: 100vh;
            max-height: unset;
            margin-top: 0;

            & .player {
                width: 100vw;
                height: 100vh;
                max-height: unset;
                border-radius: 0;
            }
        }
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

        &.fullscreen {
            height: 100vh;
            margin: 0;
            padding: 0;
        }
    }
</style>
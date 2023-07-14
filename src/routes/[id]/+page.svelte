<script lang="ts">
    import { onMount } from "svelte";
    import Player from "youtube-player";
    import type { Options, YouTubePlayer } from "youtube-player/dist/types";
    import Device from "svelte-device-info";
    import { duration, flyingFade } from "$lib/transition";
    import { unitizeViews } from "$lib/video";
    import Category from "$components/Category.svelte";
    import Review from "$components/Review.svelte";
    import Video from "$components/Video.svelte";
    import { goto } from "$app/navigation";

    export let data;

    let options: Options = {
        playerVars: {
            modestbranding: 1,
            controls: 0,
            rel: 0
        }
    };
    let player: YouTubePlayer | HTMLElement;
    $: if (player) {
        player = Player(player, options);
        player.loadVideoById(data.id);
    }

    let isMobile = true;
    let isRendered = false;

    onMount(() => {
        isMobile = Device.isMobile;
        isRendered = true;
    });
</script>

{#if isRendered}
    <div class="main">
        <div class="player-container">
            <div class="player" bind:this={player} />
        </div>
        <div class="info" in:flyingFade={{ delay: duration }}>
            <h2>{data.video.title}</h2>
            <p class="statistics">{data.video.channel} · 조회수 {unitizeViews(data.video.viewCount)}회 · {data.video.publishedAt}</p>
            <div class="categories">
                <Category id={data.video.difficulty} />
                <Category id={data.video.cateogry} />
            </div>
        </div>
        <div class="reviews-container" in:flyingFade={{ delay: duration * 2 }}>
            <h3>후기</h3>
            <div class="reviews" class:desktop={!isMobile}>
                {#each [...Array(5).keys()] as i}
                    <Review nickname="김*현" content="너무 맛있게 먹었어요! 감사합니다!" rightMargin />
                {/each}
            </div>
        </div>
        <div class="ingredients" in:flyingFade={{ delay: duration * 2 }}>
            <h3>재료</h3>
            {#each data.video.ingredients as ingredient}
                <div style="width: 100%; display: flex;">
                    <span style="min-width: 50%;">{ingredient.name}</span>
                    <span style="min-width: 50%;">{ingredient.quantity ?? ""}{ingredient.unit ?? ""}</span>
                </div>
                <div style="border-top: 1px solid var(--c-foreground-gray); margin: 0.5rem 0; opacity: 0.5;" />
            {/each}
        </div>
        <div class="steps" in:flyingFade={{ delay: duration * 2 }}>
            <h3>이렇게 요리해요</h3>
            <ul>
                {#each data.video.steps as step}
                    <li style="margin-bottom: 3rem;">{step.description}</li>
                {/each}
            </ul>
        </div>
        <div class="videos-container" in:flyingFade={{ delay: duration * 2 }}>
            <h3>이 레시피는 어때요?</h3>
            <div class="videos" class:desktop={!isMobile}>
                {#each [...Array(5).keys()] as i}
                    <Video video={data.video} rightMargin />
                {/each}
            </div>
        </div>
        <div class="buttons">
            <button class="round like">👍</button>
            <button class="round start" on:click={() => goto(`/${data.id}/cook`)}>요리 시작하기</button>
        </div>
    </div>
{/if}

<style>
    .main {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    button {
        height: 3rem;
        color: var(--c-secondary);
        background-color: var(--c-primary);
    }

    .round {
        padding: 0.5rem;
        border-radius: var(--radius);
    }

    .player-container {
        width: 100%;
        max-width: var(--max-width);
        border-radius: var(--radius);
        overflow: hidden;
        position: fixed;
        top: 0;
        z-index: 1;
    }

    .player {
        width: 100%;
    }

    .info {
        margin-top: 17rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .info h2 {
        text-align: center;
    }

    .statistics {
        font-size: 0.75rem;
        color: var(--c-foreground-gray);
    }

    .categories {
        flex: 0 0 auto;
        margin-top: 1rem;
        padding-left: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .reviews-container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .reviews,
    .videos {
        width: 100%;
        margin-top: 1rem;
        display: flex;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        overflow-x: scroll;
    }

    .reviews::-webkit-scrollbar {
        display: none;
    }

    .reviews.desktop {
        padding-bottom: 1rem;
    }

    .reviews.desktop::-webkit-scrollbar {
        display: block;
    }

    .ingredients,
    .steps,
    .videos-container {
        width: 100%;
        margin-top: 3rem;
        display: flex;
        flex-direction: column;
    }

    .ingredients span {
        margin-top: 0.5rem;
    }

    .steps li {
        position: relative;
    }

    .steps li::after {
        content: "";
        position: absolute;
        left: 0.115rem;
        margin-top: 2rem;
        padding: 1rem 0;
        border: 1px solid var(--c-primary);
    }

    .buttons {
        width: 100%;
        max-width: var(--max-width);
        margin-top: 2rem;
        display: flex;
        position: fixed;
        bottom: 0;
        z-index: 1;
    }

    .buttons .like {
        margin-right: 0.5rem;
        background-color: var(--c-foreground-gray);
    }

    .buttons .start {
        width: 100%;
        height: 3rem;
        margin-bottom: 0;
        color: var(--c-secondary);
        background-color: var(--c-primary);
    }
</style>
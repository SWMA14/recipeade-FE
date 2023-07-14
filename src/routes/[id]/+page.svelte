<script lang="ts">
    import { onMount } from "svelte";
    import Device from "svelte-device-info";
    import { duration, flyingFade } from "$lib/transition";
    import { unitizeViews } from "$lib/video";
    import Category from "$components/Category.svelte";
    import Review from "$components/Review.svelte";
    import Video from "$components/Video.svelte";
    import { goto } from "$app/navigation";

    export let data;

    let isMobile = true;
    let isRendered = false;

    onMount(() => {
        isMobile = Device.isMobile;
        isRendered = true;
    });
</script>

{#if isRendered}
    <div class="info" in:flyingFade={{ delay: duration }}>
        <div class="categories">
            <Category id={data.video.difficulty} />
            <Category id={data.video.cateogry} />
        </div>
        <h2 style="font-weight: 700;">{data.video.title}</h2>
        <p class="statistics">
            조회수 {unitizeViews(data.video.viewCount)}회 · {data.video.publishedAt}
        </p>
        <div class="channel">
            <div class="profile">
                <img src="https://i.namu.wiki/i/d1A_wD4kuLHmOOFqJdVlOXVt1TWA9NfNt_HA0CS0Y_N0zayUAX8olMuv7odG2FiDLDQZIRBqbPQwBSArXfEJlQ.webp" alt="채널 이미지" />
                {data.video.channel}
            </div>
            <button class="white subscribe">구독</button>
        </div>
        <div class="divider" />
    </div>
    <div class="reviews-container" in:flyingFade={{ delay: duration * 2 }}>
        <h3>후기</h3>
        <div class="reviews" class:desktop={!isMobile}>
            {#each [...Array(5).keys()] as i}
                <Review nickname="김*현" content="너무 맛있게 먹었어요! 감사합니다!" rightMargin
                    image="https://i.namu.wiki/i/d1A_wD4kuLHmOOFqJdVlOXVt1TWA9NfNt_HA0CS0Y_N0zayUAX8olMuv7odG2FiDLDQZIRBqbPQwBSArXfEJlQ.webp" />
            {/each}
        </div>
    </div>
    <div class="ingredients" in:flyingFade={{ delay: duration * 2 }}>
        <h3>재료</h3>
        {#each data.video.ingredients as ingredient}
            <div class="ingredient">
                <span>{ingredient.name}</span>
                <span>{ingredient.quantity ?? ""}{ingredient.unit ?? ""}</span>
            </div>
            <div class="divider" />
        {/each}
    </div>
    <div class="steps" in:flyingFade={{ delay: duration * 2 }}>
        <h3>단계 미리 보기</h3>
        <ul>
            {#each data.video.steps as step, i}
                <li class:line={i < data.video.steps.length - 1}>
                    {step.description}
                </li>
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
        <button class="like">👍</button>
        <button class="start" on:click={() => goto(`/${data.id}/cook`)}>요리 시작하기</button>
    </div>
{/if}

<style>
    .divider {
        margin: 0.5rem 0;
        border-top: 1px solid var(--c-foreground-gray); 
        opacity: 0.35;
    }

    .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .statistics {
        font-size: 0.75rem;
        text-align: center;
        color: var(--c-foreground-gray);
    }

    .categories {
        flex: 0 0 auto;
        margin-top: 1rem;
        margin-left: -0.15rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .channel {
        width: 100%;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .profile {
        display: flex;
        align-items: center;
    }

    .profile img {
        width: 2rem;
        height: 2rem;
        margin-right: 0.5rem;
        object-fit: cover;
        border-radius: 20px;
    }

    .subscribe {
        height: 1.5rem;
        font-size: 0.75rem;
    }

    .reviews-container {
        width: 100%;
        margin-top: 2rem;
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

    .ingredient {
        width: 100%;
        display: flex;
    }

    .ingredient span {
        min-width: 50%;
        margin-top: 0.5rem;
    }

    .ingredient span:nth-child(2) {
        color: var(--c-primary);
    }

    .steps li {
        margin-bottom: 3rem;
        position: relative;
    }

    .steps li.line::after {
        content: "";
        position: absolute;
        left: 0.115rem;
        margin-top: 2rem;
        padding: 1rem 0;
        border: 1px solid var(--c-primary);
    }

    .buttons {
        width: calc(100% - var(--padding) * 2);
        max-width: var(--max-width);
        margin-top: 2rem;
        display: flex;
        position: fixed;
        bottom: 1rem;
        z-index: 1;
    }

    .buttons .like {
        margin-right: 0.5rem;
        background-color: var(--c-foreground-gray);
    }

    .buttons .start {
        width: 100%;
    }
</style>
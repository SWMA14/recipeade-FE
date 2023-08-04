<script lang="ts">
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { getCategoryById } from "$lib/category";
    import { duration, flyingFade } from "$lib/transition";
    import { unitizeViews } from "$lib/video";
    import type { DynamicBarContext } from "$lib/dynamicBar.js";
    import Badge from "$components/Badge.svelte";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import Video from "$components/Video.svelte";
    import upperLeading from "./__upperBarComponents/leading.svelte";
    import lowerMain from "./__lowerBarComponents/main.svelte";
    import lowerLeading from "./__lowerBarComponents/leading.svelte";

    export let data;

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        leading: upperLeading,
        leadingProps: {
            onClick: () => history.back()
        },
        isBackgroundShown: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        leading: lowerLeading,
        main: lowerMain
    });

    let isRendered = false;

    onMount(() => {
        isRendered = true;
    });
</script>

{#if isRendered}
    <div class="section first" in:flyingFade={{ delay: duration }}>
        <div class="badges">
            <Badge dark rightMargin>{getCategoryById(data.video.difficulty)}</Badge>
            <Badge dark rightMargin>{data.video.category}</Badge>
            <Badge dark>★ 5.0</Badge>
        </div>
        <h2>{data.video.youtubeTitle}</h2>
        <p class="statistics typo-body-2">
            조회수 {unitizeViews(data.video.youtubeViewCount)}회 · {data.video.channel.ChannelName}
        </p> <!-- TODO: 업로드 날짜 -->
        <!-- <div class="channel">
            <div class="profile">
                <img src="https://i.namu.wiki/i/d1A_wD4kuLHmOOFqJdVlOXVt1TWA9NfNt_HA0CS0Y_N0zayUAX8olMuv7odG2FiDLDQZIRBqbPQwBSArXfEJlQ.webp" alt="채널 이미지" />
                {data.video.channel.ChannelName}
            </div>
            <div>
                <Button size="small">구독</Button>
            </div>
        </div> -->
    </div>
    <div class="section" in:flyingFade={{ delay: duration * 2 }}>
        <div class="title">
            <h2>재료</h2>
        </div>
        {#each data.video.ingredients as ingredient}
            <Card bottomMargin>
                <div class="ingredient">
                    <span>{ingredient.name}</span>
                    <span>{ingredient.quantity ?? ""}{ingredient.unit ?? ""}</span>
                </div>
            </Card>
        {/each}
    </div>
    <div class="section" in:flyingFade={{ delay: duration * 2 }}>
        <Carousel leftOverflow rightOverflow heading="단계 미리 보기">
            {#each data.video.recipesteps as step, i (step.description)}
                <Card leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs" columnFlex scrollSnap
                    modifier="{i + 1}단계" body={step.description}>
                    <div style="height: calc(var(--space-3xl) * 2);"></div>
                </Card>
            {/each}
        </Carousel>
    </div>
    <div class="section last" in:flyingFade={{ delay: duration * 2 }}>
        <Carousel leftOverflow rightOverflow heading="이 레시피는 어때요?" canShowAll>
            {#each [...Array(5).keys()] as i}
                <Video video={data.video} leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs" />
            {/each}
            <svelte:fragment slot="grid">
                {#each [...Array(5).keys()] as _}
                    <Video video={data.video} verbose bottomMargin />
                {/each}
            </svelte:fragment>
        </Carousel>
    </div>
{/if}

<style lang="postcss">
    .section {
        width: 100%;
        margin-bottom: var(--space-m);

        &.first {
            margin-top: var(--space-2xl);
        }

        &.last {
            margin-bottom: 0;
        }
    }

    .title {
        margin-bottom: var(--space-xs);
        display: flex;
        justify-content: space-between;
    }

    .badges {
        margin-bottom: var(--space-2xs);
        display: flex;
        align-items: center;
    }

    .statistics {
        color: var(--c-foreground-gray);
    }

    .channel {
        width: 100%;
        margin-top: var(--space-xs);
        padding-bottom: var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .profile {
        display: flex;
        align-items: center;
    }

    .profile img {
        width: var(--space-m);
        height: var(--space-m);
        margin-right: var(--space-2xs);
        object-fit: cover;
        border-radius: var(--radius-big);
    }

    .ingredient {
        display: flex;
        justify-content: space-between;
    }

    .ingredient span:nth-child(2) {
        color: var(--c-primary);
    }
</style>
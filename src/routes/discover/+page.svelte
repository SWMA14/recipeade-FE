<script lang="ts">
    import { Device } from "@capacitor/device";
    import { _ } from "svelte-i18n";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { MetaTags } from "svelte-meta-tags";
    import { allVideos } from "../../store";
    import { DUMMY_VIDEO } from "$lib/dummy";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import type { VideoData } from "$lib/video";
    import Carousel from "$components/Carousel.svelte";
    import Card from "$components/Card.svelte";
    import Skeleton from "$components/Skeleton.svelte";
    import Video from "$components/Video.svelte";
    import main from "../__lowerBarComponents/main.svelte";

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        main
    });

    const title = "레시피에이드";
    const description = "";

    let device: "ios" | "android" | "web";
    let isRendered = false;

    let random: VideoData;
    let rest: VideoData[];
    let highViews: VideoData[];
    let easy: VideoData[];
    let others: VideoData[];

    Device.getInfo()
        .then(x => device = x.platform)
        .catch(() => device = "web");

    onMount(async () => {
        // if ($allVideos.length === 0)
        //     $allVideos = await fetch(`${PUBLIC_API_ENDPOINT}/recipe`)
        //         .then(response => response.json())
        //         .then(result => result as VideoData[]);

        random = $allVideos.sort(() => 0.5 - Math.random())[0];
        rest = $allVideos.filter(x => x !== random);

        highViews = rest.sort((a, b) => b.youtubeViewCount - a.youtubeViewCount).slice(0, 5);
        easy = rest.filter(x => x.difficulty <= 2);
        others = rest.filter(x => !highViews.includes(x) && !easy.includes(x));

        isRendered = true;
    });
</script>

<MetaTags
    {title}
    {description}
    canonical=""
    openGraph={{
        type: "website",
        site_name: "레시피에이드",
        url: "",
        title,
        description,
        images: [
            {
                url: "/images/thumbnail.png"
            }
        ]
    }}
    additionalMetaTags={[
        {
            property: "theme-color",
            content: "#fc5e03"
        }
    ]}
/>

<div class="intro">
    {#if !isRendered}
        <Card skeleton noRadius largePadding square squareOverflowSafeArea={device === "ios"} />
    {:else}
        <a href="/{random.youtubeVideoId}" style="height: 120%;">
            <Card video={random.youtubeVideoId} noRadius largePadding darkOverlay={0.7}
                square squareOverflowSafeArea={device === "ios"}
                heading={$_("page.discover.featured")} modifier={random.channel.ChannelName} body={random.youtubeTitle} />
        </a>
    {/if}
</div>
<div class="section">
    <Carousel skeleton={!isRendered} leftOverflow rightOverflow heading={$_("page.discover.trendingOnYouTube")} canShowAll>
        {#if !isRendered}
            <Video skeleton video={DUMMY_VIDEO} leftMargin="xs" rightMargin="xs" />
            <Video skeleton video={DUMMY_VIDEO} />
        {:else}
            {#each highViews as video, i (video.youtubeThumbnail)}
                <Video {video} leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs" />
            {/each}
        {/if}
        <svelte:fragment slot="grid">
            {#if isRendered}
                {#each highViews as video, i (video.youtubeThumbnail)}
                    <Video {video} verbose bottomMargin />
                {/each}
            {/if}
        </svelte:fragment>
    </Carousel>
</div>
<div class="section">
    <Carousel skeleton={!isRendered} leftOverflow rightOverflow heading={$_("page.discover.easyToFollow")} canShowAll>
        {#if !isRendered}
            <Video skeleton video={DUMMY_VIDEO} leftMargin="xs" rightMargin="xs" />
            <Video skeleton video={DUMMY_VIDEO} />
        {:else}
            {#each easy as video, i (video.youtubeThumbnail)}
                <Video {video} leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs" />
            {/each}
        {/if}
        <svelte:fragment slot="grid">
            {#if isRendered}
                {#each easy as video (video.youtubeThumbnail)}
                    <Video {video} verbose bottomMargin />
                {/each}
            {/if}
        </svelte:fragment>
    </Carousel>
</div>
<div class="section last" class:ios={device === "ios"}>
    {#if !isRendered}
        <div class="grid-title">
            <Skeleton />
        </div>
        <div class="grid">
            <Video skeleton video={DUMMY_VIDEO} bottomMargin />
            <Video skeleton video={DUMMY_VIDEO} />
        </div>
    {:else}
        <h2 class="grid-title">{$_("page.discover.others")}</h2>
        <div class="grid">
            {#each others as video (video.youtubeThumbnail)}
                <Video {video} verbose bottomMargin />
            {/each}
        </div>
    {/if}
</div>

<style lang="postcss">
    .intro {
        width: -webkit-fill-available;
        margin: 0 calc(var(--space-xs) * -1);
        margin-bottom: var(--space-m);
    }

    .section {
        width: 100%;
        margin-bottom: var(--space-m);

        & .grid-title {
            margin-bottom: var(--space-2xs);
        }

        &.last {
            margin-bottom: var(--space-3xl);

            &.ios {
                margin-bottom: calc(var(--space-3xl) + var(--space-2xs));
            }
        }
    }

    .grid {
        display: flex;
        flex-direction: column;
    }
</style>
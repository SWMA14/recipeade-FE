<script lang="ts">
    import { _ } from "svelte-i18n";
    import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { MetaTags } from "svelte-meta-tags";
    import { allVideos, savedVideos } from "../../store";
    import { PUBLIC_API_ENDPOINT } from "$env/static/public";
    import { DUMMY_VIDEO } from "$lib/dummy";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { type VideoData, type VideoOverview, VideoOverviewToEmptyData, getVideoInfo } from "$lib/video";
    import Carousel from "$components/Carousel.svelte";
    import Card from "$components/Card.svelte";
    import Video from "$components/Video.svelte";
    import main from "../__lowerBarComponents/main.svelte";

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        main,
        isFitted: true
    });

    const title = "레시피에이드";
    const description = "";

    let device: "ios" | "android" | "web" = getContext("device");
    let isRendered = false;

    let random: VideoOverview;
    let rest: VideoOverview[];
    let highViews: VideoData[];
    let others: VideoData[];

    onMount(async () => {
        if ($allVideos.length === 0)
        {
            const result = await fetch(`${PUBLIC_API_ENDPOINT}/customize/getAllDefaults?lang=${$_("locale")}`)
                .then(response => response.json());
            $allVideos = await Promise.all(result.map(async (video: any) => {
                const info = await getVideoInfo(video["video_id"]);

                return {
                    id: video["video_id"],
                    ...info
                } as VideoOverview;
            }));
        }

        random = $allVideos.sort(() => 0.5 - Math.random())[0];
        rest = $allVideos.filter(x => x !== random);

        const tempHighViews = rest.sort((a, b) => b.viewCounts - a.viewCounts).slice(0, 5);
        const tempOthers = rest.filter(x => !tempHighViews.includes(x));

        highViews = tempHighViews.map(VideoOverviewToEmptyData);
        others = tempOthers.map(VideoOverviewToEmptyData);

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
        <a href="/{random.id}" style="height: 120%;">
            <Card video={random.id} noRadius largePadding darkOverlay={0.7}
                square squareOverflowSafeArea={device === "ios"}
                heading={$_("page.discover.featured")} modifier={random.channel} body={random.title} />
        </a>
    {/if}
</div>
<div class="section">
    <Card skeleton={!isRendered}>
        {#if isRendered}
            <a class="fake-input" href="/search">
                <div class="icon">
                    <Fa icon={faMagnifyingGlass} />
                </div>
                {$_("page.discover.searchPlaceholder")}
            </a>
        {/if}
    </Card>
</div>
<div class="section">
    <Carousel leftOverflow rightOverflow heading={isRendered ? $_("page.discover.trendingOnYouTube") : undefined} canShowAll={isRendered}>
        {#if !isRendered}
            <Video skeleton video={DUMMY_VIDEO} rightMargin="xs" />
            <Video skeleton video={DUMMY_VIDEO} />
        {:else}
            {#each highViews as video, i (video.youtubeThumbnail)}
                <Video {video} leftMargin={i === 0 ? "xs" : undefined} rightMargin={i === highViews.length - 1 ? undefined : "xs"}
                    saved={$savedVideos.some(x => x.youtubeVideoId === video.youtubeVideoId)} />
            {/each}
        {/if}
        <svelte:fragment slot="grid">
            {#if isRendered}
                {#each highViews as video, i (video.youtubeThumbnail)}
                    <Video {video} bottomMargin={i === highViews.length - 1 ? undefined : "xs"}
                        saved={$savedVideos.some(x => x.youtubeVideoId === video.youtubeVideoId)} />
                {/each}
            {/if}
        </svelte:fragment>
    </Carousel>
</div>
<div class="section last" class:ios={device === "ios"}>
    {#if !isRendered}
        <div class="grid">
            <Video skeleton video={DUMMY_VIDEO} bottomMargin="xs" />
            <Video skeleton video={DUMMY_VIDEO} />
        </div>
    {:else}
        <h2 class="grid-title">{$_("page.discover.others")}</h2>
        <div class="grid">
            {#each others as video (video.youtubeThumbnail)}
                <Video {video} bottomMargin="xs" saved={$savedVideos.some(x => x.youtubeVideoId === video.youtubeVideoId)} />
            {/each}
        </div>
    {/if}
</div>

<style lang="postcss">
    .intro {
        width: -webkit-fill-available;
        margin: 0 calc(var(--space-xs) * -1);
        margin-bottom: var(--space-xs);
    }

    .section {
        width: 100%;
        margin-bottom: var(--space-m);

        & .grid-title {
            margin-bottom: var(--space-2xs);
        }

        &.last {
            padding-bottom: var(--space-m);

            &.ios {
                padding-bottom: calc(var(--space-m) + var(--space-2xs));
            }
        }
    }

    .fake-input {
        display: flex;
        color: var(--gray-400);
        line-height: 1;

        & .icon {
            width: var(--space-s);
        }
    }

    .grid {
        display: flex;
        flex-direction: column;
    }
</style>
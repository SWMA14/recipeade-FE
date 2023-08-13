<script lang="ts">
    import { Device } from "@capacitor/device";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { MetaTags } from "svelte-meta-tags";
    import { allVideos } from "../store";
    import { PUBLIC_API_ENDPOINT } from "$env/static/public";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { flyingFade } from "$lib/transition";
    import type { VideoData } from "$lib/video";
    import Carousel from "$components/Carousel.svelte";
    import Video from "$components/Video.svelte";
    import Card from "$components/Card.svelte";
    import main from "./__lowerBarComponents/main.svelte";

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
        if ($allVideos.length === 0)
            $allVideos = await fetch(`${PUBLIC_API_ENDPOINT}/recipe`)
                .then(response => response.json())
                .then(result => result as VideoData[]);

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

{#if isRendered}
    <div class="intro">
        <a href="/{random.youtubeVideoId}" style="height: 120%;">
            <Card video={random.youtubeVideoId} noRadius largePadding darkOverlay={0.7}
                square squareOverflowSafeArea={device === "ios"}
                heading="이 레시피는<br>어때요?" modifier={random.channel.ChannelName} body={random.youtubeTitle} />
        </a>
    </div>
    <div class="section" in:flyingFade={{ delay: 0 }}>
        <Carousel leftOverflow rightOverflow heading="유튜브에서 핫해요" canShowAll>
            {#each highViews as video, i (video.youtubeThumbnail)}
                <Video {video} leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs" />
            {/each}
            <svelte:fragment slot="grid">
                {#each highViews as video, i (video.youtubeThumbnail)}
                    <Video {video} verbose bottomMargin />
                {/each}
            </svelte:fragment>
        </Carousel>
    </div>
    <div class="section" in:flyingFade={{ delay: 0 }}>
        <Carousel leftOverflow rightOverflow heading="쉽게 따라해요" canShowAll>
            {#each easy as video, i (video.youtubeThumbnail)}
                <Video {video} leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs" />
            {/each}
            <svelte:fragment slot="grid">
                {#each easy as video (video.youtubeThumbnail)}
                    <Video {video} verbose bottomMargin />
                {/each}
            </svelte:fragment>
        </Carousel>
    </div>
    <div class="section last" class:ios={device === "ios"} in:flyingFade={{ delay: 0 }}>
        <h2 class="grid-title">다른 레시피들도 있어요</h2>
        <div class="grid">
            {#each others as video (video.youtubeThumbnail)}
                <Video {video} verbose bottomMargin />
            {/each}
        </div>
    </div>
{/if}

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
<script lang="ts">
    import { Device } from "@capacitor/device";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { MetaTags } from "svelte-meta-tags";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { extractId } from "$lib/video";
    import Carousel from "$components/Carousel.svelte";
    import Video from "$components/Video.svelte";
    import Card from "$components/Card.svelte";
    import main from "./__lowerBarComponents/main.svelte";

    export let data;

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        main
    });

    const title = "레시피에이드";
    const description = "";
    const curatedId = extractId(data.random);

    let device: "ios" | "android" | "web";

    Device.getInfo()
        .then(x => device = x.platform)
        .catch(() => device = "web");
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
    <a href="/{curatedId}" style="height: 120%;">
        <Card video={curatedId} noRadius largePadding darkOverlay={0.7}
            square squareOverflowSafeArea={device === "ios"}
            heading="이 레시피는<br>어때요?" modifier={data.random.channel} body={data.random.title} />
    </a>
</div>
<div class="section">
    <Carousel leftOverflow rightOverflow heading="유튜브에서 핫해요" canShowAll>
        {#each data.highViews as video, i (video.thumbnail)}
            <Video {video} leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs" />
        {/each}
        <svelte:fragment slot="grid">
            {#each data.highViews as video (video.thumbnail)}
                <Video {video} verbose bottomMargin />
            {/each}
        </svelte:fragment>
    </Carousel>
</div>
<div class="section">
    <Carousel leftOverflow rightOverflow heading="쉽게 따라해요" canShowAll>
        {#each data.easy as video, i (video.thumbnail)}
            <Video {video} leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs" />
        {/each}
        <svelte:fragment slot="grid">
            {#each data.easy as video (video.thumbnail)}
                <Video {video} verbose bottomMargin />
            {/each}
        </svelte:fragment>
    </Carousel>
</div>
<div class="section last">
    <h2 class="grid-title">다른 레시피들도 있어요</h2>
    <div class="grid">
        {#each data.others as video (video.thumbnail)}
            <Video {video} verbose bottomMargin />
        {/each}
    </div>
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
        }
    }

    .grid {
        display: flex;
        flex-direction: column;
    }
</style>
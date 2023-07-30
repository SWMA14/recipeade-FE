<script lang="ts">
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import Device from "svelte-device-info";
    import { MetaTags } from "svelte-meta-tags";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { extractId, timestampToSeconds } from "$lib/video";
    import Carousel from "$components/Carousel.svelte";
    import Video from "$components/Video.svelte";
    import Card from "$components/Card.svelte";
    import main from "./__dynamicBarComponents/main.svelte";

    export let data;

    getContext<Writable<DynamicBarContext>>("dynamicBar").update(x => x = {
        main
    });

    const title = "레시피에이드";
    const description = "";

    let isMobile = true;

    onMount(() => {
        isMobile = Device.isMobile;
    })
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
    <Card video={extractId(data.random)} start={timestampToSeconds(data.random.steps.slice(-1)[0].timestamp)}
        noRadius largePadding darkOverlay={0.7} square
        heading="이 레시피는<br>어때요?" modifier={data.random.channel} body={data.random.title} />
</div>
<div class="section">
    <div class="title">
        <h2>유튜브에서 핫해요</h2>
    </div>
    <Carousel leftOverflow rightOverflow>
        {#each data.highViews as video, i (video.thumbnail)}
            <Video {video} leftMargin={i === 0} rightMargin />
        {/each}
    </Carousel>
</div>
<div class="section">
    <div class="title">
        <h2>쉽게 따라해요</h2>
    </div>
    <Carousel leftOverflow rightOverflow>
        {#each data.easy as video, i (video.thumbnail)}
            <Video {video} leftMargin={i === 0} rightMargin />
        {/each}
    </Carousel>
</div>
<div class="section">
    <div class="title">
        <h2>다른 레시피들도 있어요</h2>
    </div>
    <div class="grid" class:desktop={!isMobile}>
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
    }

    .title {
        margin-bottom: var(--space-xs);
        display: flex;
        justify-content: space-between;
    }

    .grid {
        display: flex;
        flex-direction: column;
    }
</style>
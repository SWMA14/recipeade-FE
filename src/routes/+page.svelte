<script lang="ts">
    import { onMount } from "svelte";
    import Device from "svelte-device-info";
    import { MetaTags } from "svelte-meta-tags";
    import Carousel from "$components/Carousel.svelte";
    import Video from "$components/Video.svelte";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
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

<div class="section">
    <h2>유튜브에서 핫해요🔥</h2>
    <Carousel leftOverflow rightOverflow>
        {#each data.highViews as video, i (video.thumbnail)}
            <Video {video} leftMargin={i === 0} rightMargin />
        {/each}
    </Carousel>
</div>
<div class="section">
    <h2>쉽게 따라해요😏</h2>
    <Carousel leftOverflow rightOverflow>
        {#each data.easy as video, i (video.thumbnail)}
            <Video {video} leftMargin={i === 0} rightMargin />
        {/each}
    </Carousel>
</div>
<div class="section">
    <h2>다른 레시피들도 있어요😯</h2>
    <div class="grid" class:desktop={!isMobile}>
        {#each data.others as video (video.thumbnail)}
            <Video {video} verbose bottomMargin />
        {/each}
    </div>
</div>

<style>
    .section {
        width: 100%;
        margin-bottom: var(--space-m);
    }

    .grid {
        margin-top: var(--space-xs);
    }

    .grid {
        display: flex;
        flex-direction: column;
    }
</style>
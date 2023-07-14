<script lang="ts">
    import Video from "$components/Video.svelte";
    import { onMount } from "svelte";
    import Device from "svelte-device-info";
    import { MetaTags } from "svelte-meta-tags";

    export let data;

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

<div class="main">
    <div class="section">
        <h2>유튜브에서 핫해요🔥</h2>
        <div class="videos-container" class:desktop={!isMobile}>
            {#each data.highViews as video, i (video.thumbnail)}
                <Video {video} rightMargin={i < data.highViews.length - 1} />
            {/each}
        </div>
    </div>
    <div class="section">
        <h2>쉽게 따라해요😏</h2>
        <div class="videos-container" class:desktop={!isMobile}>
            {#each data.easy as video, i (video.thumbnail)}
                <Video {video} rightMargin={i < data.easy.length - 1} />
            {/each}
        </div>
    </div>
    <div class="section">
        <h2>다른 레시피들도 있어요😯</h2>
        <div class="videos-container grid" class:desktop={!isMobile}>
            {#each data.others as video (video.thumbnail)}
                <Video {video} bottomMargin />
            {/each}
        </div>
    </div>
</div>

<style>
    .section {
        width: 100%;
        margin-bottom: 2rem;
    }

    .videos-container {
        display: flex;
        margin-top: 0.5rem;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        overflow-x: scroll;
    }

    .videos-container::-webkit-scrollbar {
        display: none;
    }

    .videos-container.desktop {
        padding-bottom: 1rem;
    }

    .videos-container.desktop::-webkit-scrollbar {
        display: block;
    }

    .grid {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
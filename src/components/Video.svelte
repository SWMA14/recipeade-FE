<script lang="ts">
    import { type DemoVideo, unitizeViews } from "$lib/video";
    import Category from "$components/Category.svelte";

    export let video: DemoVideo;
    export let rightMargin: boolean = false;
    export let bottomMargin: boolean = false;
    export let onGrid: boolean = false;
    export let showInfo: boolean = true;

    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = video.video.match(regex);

    const id = match ? match[1] : undefined;
</script>

<div class="container" class:right-margin={rightMargin} class:bottom-margin={bottomMargin} class:grid={onGrid}>
    <a href="/{id}">
        <div class="thumbnail-wrapper">
            <div>
                <img alt="영상 썸네일" src={video.thumbnail} />
            </div>
        </div>
    </a>
    {#if showInfo}
        <div class="info">
            <div class="title">
                <a class="upper" href="/{id}">{video.title}</a>
                <span class="lower">{video.channel} · 조회수 {unitizeViews(video.viewCount)}회</span>
            </div>
            {#if !onGrid}
                <div class="categories">
                    <Category id={video.difficulty} />
                    <Category id={video.cateogry} />
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .container {
        min-width: calc(100% - 3rem);
        display: flex;
        flex-direction: column;
        background-color: var(--c-background-lightdark);
        border-radius: var(--radius);
        scroll-snap-align: start;
        scroll-snap-stop: always;
    }

    .grid {
        min-width: unset;
        width: calc(50% - 0.5rem);
        margin-bottom: 1rem;
    }

    .right-margin {
        margin-right: 1rem;
    }

    .bottom-margin {
        margin-bottom: 1rem;
    }

    .thumbnail-wrapper {
        width: 100%;
        padding-bottom: 56%;
        position: relative;
        border-radius: var(--radius);
        overflow: hidden;
    }

    .thumbnail-wrapper > div {
        position: absolute;
        top: -16.75%;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .info {
        width: 100%;
        padding: 1rem;
        padding-top: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.5rem;
    }

    .title {
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .title .upper {
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .title .lower {
        font-size: 0.75rem;
        color: var(--c-foreground-gray);
    }

    .categories {
        flex: 0 0 auto;
        padding-left: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
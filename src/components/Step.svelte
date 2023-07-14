<script lang="ts">
    export let description: string;
    export let img: string;
    export let rightMargin: boolean = false;
</script>

<div class="container" class:right-margin={rightMargin}>
    <!-- <div class="thumbnail-wrapper">
        <div>
            <img alt="영상 썸네일" src={img} />
        </div>
    </div> -->
    <div class="info">
        <div class="title">
            <span>{description}</span>
            <!-- <span class="lower">{video.channel} · 조회수 {unitizeViews(video.viewCount)}회</span> -->
        </div>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        min-width: 23rem;
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.5rem;
    }

    .title {
        /* min-width: 0; */
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
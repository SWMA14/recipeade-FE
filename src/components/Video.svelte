<script lang="ts">
    import { getCategoryById } from "$lib/category";
    import type { SpaceType } from "$lib/types";
    import { type DemoVideo, extractId, unitizeViews } from "$lib/video";
    import Badge from "$components/Badge.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";

    export let video: DemoVideo;
    export let leftMargin: SpaceType | undefined = undefined;
    export let rightMargin: SpaceType | undefined = undefined;
    export let bottomMargin = false;
    export let verbose = false;

    const id = extractId(video);

    let leftMarginValue = leftMargin ? `var(--space-${leftMargin})` : undefined;
    let rightMarginValue = rightMargin ? `var(--space-${rightMargin})` : undefined;
</script>

<Card visibleOverflow noPadding {leftMargin} {rightMargin} {bottomMargin} columnFlex scrollSnap>
    <a class:overflow={verbose} href="/{id}">
        {#if verbose}
            <Carousel>
                <div class="verbose fitter left-margin">
                    <div>
                        <img alt="영상 썸네일" src={video.thumbnail} />
                    </div>
                </div>
                {#each [...Array(video.steps.length + 1).keys()] as i (i)}
                    {@const modifier = i === 0 ? "재료 준비" : `${i}단계`}
                    {@const body = i === 0 ?
                        video.ingredients.map(x => 
                            `${x.name}${[0, null].some(invalid => invalid === x.quantity) ? "" : ` ${x.quantity}`}${x.unit ?? ""}`
                        ).join(", ") :
                        video.steps[i - 1].description}
                    <Card backgroundColor="primary-200" leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs"
                        columnFlex scrollSnap
                        {modifier} {body} />
                {/each}
            </Carousel>
        {:else}
            <div class="fitter">
                <div>
                    <img alt="영상 썸네일" src={video.thumbnail} />
                </div>
            </div>
        {/if}
    </a>
    <div class="info">
        <a class="upper typo-body-1" href="/{id}">{video.title}</a>
        <span class="lower typo-body-2">{video.channel} · 조회수 {unitizeViews(video.viewCount)}회</span>
        <div class="badges">
            <Badge rightMargin>{getCategoryById(video.difficulty)}</Badge>
            <Badge rightMargin>{video.cateogry}</Badge>
            <Badge>★ 5.0</Badge>
        </div>
    </div>
</Card>

<style>
    .overflow {
        margin: 0 calc(var(--space-xs) * -1);
    }

    .verbose.fitter {
        width: var(--card-min-width);
        padding-bottom: calc(56% * var(--card-min-width-decimal));
        scroll-snap-align: start;
        scroll-snap-stop: always;
    }

    .fitter {
        width: 100%;
        padding-bottom: 56%;
        position: relative;
        flex-shrink: 0;
        border-radius: var(--radius);
        overflow: hidden;
    }

    .fitter > div {
        position: absolute;
        top: -16.75%;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .left-margin {
        margin-left: var(--space-xs);
    }

    .info {
        width: 100%;
        padding: var(--space-xs);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
    }

    .upper {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .lower {
        color: var(--gray-800);
    }

    .badges {
        margin-top: var(--space-2xs);
        display: flex;
        align-items: center;
    }
</style>
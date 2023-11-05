<script lang="ts">
    import { _ } from "svelte-i18n";
    import { surveyedVideos } from "../store";
    import { getCategoryById } from "$lib/category";
    import type { SpaceType } from "$lib/types";
    import { type VideoData, unitizeViews } from "$lib/video";
    import Badge from "$components/Badge.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import Skeleton from "$components/Skeleton.svelte";

    export let skeleton = false;
    export let video: VideoData;
    export let leftMargin: SpaceType | undefined = undefined;
    export let rightMargin: SpaceType | undefined = undefined;
    export let bottomMargin: SpaceType | undefined = undefined;
    export let verbose = false;
    export let selectable = false;
    export let selected = false;
    export let onSelect: ((selected: boolean, video: VideoData) => void) | undefined = undefined;

    function onClick()
    {
        if (!selectable)
            return;

        selected = !selected;
        onSelect?.(selected, video);
    }
</script>

{#if skeleton}
    <Skeleton {leftMargin} {rightMargin} {bottomMargin}>
        <div class="fitter" />
    </Skeleton>
    <Skeleton kind="body" bottomMargin="xs" />
    <Skeleton kind="smallBody" bottomMargin="xs" />
{:else}
    <Card backgroundColor={selected ? "gray-900" : "gray-50"} visibleOverflow noPadding {leftMargin} {rightMargin} {bottomMargin}
        columnFlex scrollSnap>
        {#if video.temporary}
            <!-- <div class="overlay" /> -->
        {/if}
        <a class:overflow={verbose} href={selectable || video.temporary ? "#" : `/${video.youtubeVideoId}`} on:click={onClick}>
            {#if verbose}
                <Carousel>
                    <div class="verbose fitter left-margin">
                        <div>
                            <img alt="영상 썸네일" src={video.youtubeThumbnail.replace("/default", "/sddefault")} />
                        </div>
                    </div>
                    {#each [...Array(video.recipesteps.length + 1).keys()] as i (i)}
                        {@const modifier = i === 0 ? "재료 준비" : `${i}단계`}
                        {@const body = i === 0 ?
                            video.ingredients.map(x => 
                                `${x.name}${[0, null].some(invalid => invalid === x.quantity) ? "" : ` ${x.quantity}`}${x.unit ?? ""}`
                            ).join(", ") :
                            video.recipesteps[i - 1].description}
                        <Card backgroundColor="primary-200" leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs"
                            columnFlex scrollSnap
                            {modifier} {body} />
                    {/each}
                </Carousel>
            {:else}
                <div class="fitter" class:pending={video.temporary}>
                    <div>
                        <img alt="영상 썸네일" src={video.youtubeThumbnail.replace("/default", "/sddefault")} />
                    </div>
                </div>
            {/if}
        </a>
        <div class="info" class:selected class:pending={video.temporary}>
            <a class="upper typo-body-1" href={selectable ? "#" : `/${video.youtubeVideoId}`} on:click={onClick}>{video.youtubeTitle}</a>
            <span class="lower typo-body-2">{video.channel} · {$_("page.recipe.viewCounts", { values: { count: unitizeViews(video.youtubeViewCount, $_("locale")) }})}</span>
            <div class="badges">
                <!-- <Badge rightMargin>{getCategoryById(video.difficulty)}</Badge>
                <Badge rightMargin>{video.category}</Badge> -->
                <!-- <Badge>★ 5.0</Badge> -->
            </div>
        </div>
    </Card>
{/if}

<style lang="postcss">
    @keyframes flicker {
        0% {
            opacity: 0.2;
        }

        100% {
            opacity: 0.1;
        }
    }

    .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius);
        overflow: hidden;

        & h2 {
            z-index: 3;
        }
    }

    .pending {
        animation: flicker 1s infinite alternate;
    }

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

        & div {
            position: absolute;
            top: -16.75%;
            bottom: 0;
            left: 0;
            right: 0;

            & img {
                width: -webkit-fill-available;
            }
        }
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

        &.selected {
            color: var(--white);
        }
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
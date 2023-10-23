<script lang="ts">
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { fade } from "svelte/transition";
    import PlayerStates from "youtube-player/dist/constants/PlayerStates.js";
    import type { YouTubePlayer } from "youtube-player/dist/types";
    import { MetaTags } from "svelte-meta-tags";
    import { faArrowRight, faRepeat } from "@fortawesome/free-solid-svg-icons";
    import type { Step } from "$lib/step";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { pausableTweened } from "$lib/pausableTween";
    import { duration, flyingFade } from "$lib/transition";
    import { timestampToSeconds } from "$lib/video";
    import { sharedPlayer } from "../../../store";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import { analyticsService } from "$lib/analytics";

    export let data;

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        ...x,
        trailing: undefined,
        trailingProps: undefined
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        ...x,
        isHidden: true
    });

    const progressDuration = 0;
    const title = data.video.youtubeTitle;
    const description = "";

    let steps: Step[] = data.video.recipesteps.map(step => ({
            seconds: timestampToSeconds(step.timestamp),
            description: step.description
        } as Step));

    let progress = pausableTweened(0, { duration: progressDuration });
    let player: YouTubePlayer = $sharedPlayer;

    $: if (player) {
        player.getIframe().then(x => videoContentWindow = x.contentWindow);
        player.addEventListener("onStateChange", (event: any) => {
            if (event.data === PlayerStates.PAUSED)
                progress.pause();
            else if (event.data === PlayerStates.PLAYING && progress.paused)
                progress.continue();
        });

        selectStep(0);
    }
    let videoDuration: number;
    let videoContentWindow: Window | null;

    let selectedStep = 0;
    let isRendered = false;
    let isAutoNext = true;
    let isRepeating = false;

    onMount(async () => {
        analyticsService.setScreenName("recipe_cook");
        analyticsService.logEvent("recipe_cook_page", {
            page_title: "recipe_cook_page"
        });
        isRendered = true;

        window.addEventListener("message", event => {
            if (player && event.source === videoContentWindow)
            {
                const data = JSON.parse(event.data);

                if (data.event === "infoDelivery" && data.info && data.info.currentTime)
                {
                    if (videoDuration === undefined)
                        player.getDuration().then(x => videoDuration = x);
                        // duration needs to be set here, not right after loadVideoById(), as there's some delay

                    const now = data.info.currentTime;
                    const start = steps[selectedStep].seconds;
                    const end = selectedStep + 1 < steps.length ? steps[selectedStep + 1].seconds : videoDuration;

                    progress.set((now - start) / (end - start), { duration: progressDuration });

                    if (selectedStep < steps.length - 1 && $progress >= 1)
                    {
                        if (isAutoNext || isRepeating)
                            selectStep(isRepeating ? selectedStep : selectedStep + 1);
                        else
                            player.pauseVideo();
                    }
                }
            }
        });
    });

    async function selectStep(step: number)
    {
        selectedStep = step;
        player.playVideo();
        player.seekTo(steps[step].seconds, true);

        const element = document.querySelector(`#step-button-${step}`);
        if (element)
            element.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
    }

    function enableAutoNext()
    {
        isAutoNext = true;
        isRepeating = false;
    }

    function enableRepeat()
    {
        isRepeating = true;
        isAutoNext = false;
    }
</script>

<MetaTags
    {title}
    titleTemplate="레시피에이드 - %s"
    {description}
    canonical="/{data.id}"
    openGraph={{
        type: "website",
        site_name: "레시피에이드",
        url: `/${data.id}`,
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
    <div class="section" in:flyingFade={{ delay: 0 }}>
        <Card visibleOverflow noPadding>
            <div style="margin-top: 1rem;">
                <Carousel leftOverflow rightOverflow>
                    {#each [...Array(steps.length).keys()] as i}
                        <Button id="step-button-{i}" on:click={() => selectStep(i)} selected={i === selectedStep}
                            leftMargin={i === 0 ? "m" : undefined} rightMargin={i < steps.length - 1 ? "xs" : "m"}
                            progress={i === selectedStep ? $progress * 100 : 0}>
                            <div style="width: var(--space-3xl);">{i + 1}</div>
                        </Button>
                    {/each}
                </Carousel>
            </div>
            <div class="content">
                {@html steps[selectedStep].description
                    .replace(/^\*/g, "<strong>")
                    .replace(/\s\*/g, " <strong>")
                    .replace(/\*/g, "</strong>")}
                <div class="button-groups">
                    <div class="group">
                        <Button kind="white" icon={faArrowRight} rightMargin="xs" selected={isAutoNext} on:click={enableAutoNext} />
                        <Button kind="white" icon={faRepeat} selected={isRepeating} on:click={enableRepeat} />
                    </div>
                </div>
            </div>
        </Card>
    </div>
{/if}

<style>
    .content {
        padding: var(--space-xs);
    }

    .section {
        margin-top: var(--space-2xl);
    }

    .button-groups {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .group {
        margin-top: 2rem;
        display: flex;
        align-items: center;
        justify-content: left;
    }
</style>
<script lang="ts">
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { fade } from "svelte/transition";
    import PlayerStates from "youtube-player/dist/constants/PlayerStates.js";
    import type { YouTubePlayer } from "youtube-player/dist/types";
    import { MetaTags } from "svelte-meta-tags";
    import { faArrowRight, faThumbsUp, faThumbsDown, faRepeat } from "@fortawesome/free-solid-svg-icons";
    import type { Step } from "$lib/step";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { pausableTweened } from "$lib/pausableTween";
    import { duration, flyingFade } from "$lib/transition";
    import { timestampToSeconds } from "$lib/video";
    import { feedbackResult, sharedPlayer } from "../../../store";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import Tooltip from "$components/Tooltip.svelte";

    export let data;

    getContext<Writable<DynamicBarContext>>("dynamicBar").update(x => x = {
        ...x,
        isHidden: true
    });

    const progressDuration = 0;
    const title = data.video.title;
    const description = "";

    let steps: Step[] = data.video.steps.map(step => ({
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
    $: selectedStepFeedback = $feedbackResult.steps.find(x => x.title === data.video.title && x.index === selectedStep);

    let isRendered = false;
    let isAutoNext = true;
    let isRepeating = false;
    $: isUpvoted = selectedStepFeedback === undefined ? undefined : selectedStepFeedback.score === 1;

    onMount(async () => {
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

    function vote(score: number)
    {
        if (selectedStepFeedback === undefined)
            $feedbackResult.steps = [...$feedbackResult.steps, {
                title: data.video.title,
                score,
                index: selectedStep
            }];
        else if (selectedStepFeedback.score != score)
        {
            const index = $feedbackResult.steps.findIndex(x => x === selectedStepFeedback);
            $feedbackResult.steps[index].score = score;
        }
        else
        {
            const index = $feedbackResult.steps.findIndex(x => x === selectedStepFeedback);
            $feedbackResult.steps.splice(index, 1);
            selectedStepFeedback = undefined;
        }

        postVoteResult();
    }

    function postVoteResult()
    {
        fetch("/api/feedback", {
            method: "POST",
            headers: {
                    "Content-Type": "application/json"
                },
            body: JSON.stringify($feedbackResult)
        });
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
    <div class="section">
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
                        <Button kind="white" icon={faThumbsUp} rightMargin="xs" on:click={() => vote(1)} />
                        <Button kind="white" icon={faThumbsDown} rightMargin="xs" on:click={() => vote(-1)} />
                        <Tooltip>
                            <div class="help" slot="content">?</div>
                            <div class="alert help-tooltip" slot="tooltip">
                                더욱 정확한 레시피를 제공해 드리기 위해 여러분의 도움이 필요해요 🙇
                                <ul>
                                    <li>이 단계의 설명이 <strong>정확하다면</strong> 👍을 눌러 주세요.</li>
                                    <li><strong>정확하지 않거나 모호한</strong> 부분이 있다면 👎을 눌러 주세요.</li>
                                </ul>
                            </div>
                        </Tooltip>
                    </div>
                    <div class="group">
                        <Button kind="white" icon={faArrowRight} rightMargin="xs" selected={isAutoNext}
                            on:click={() => isAutoNext = !isAutoNext} />
                        <Button kind="white" icon={faRepeat} selected={isRepeating} on:click={() => isRepeating = !isRepeating} />
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

    .alert {
        margin-top: 1rem;
        padding: 0.5rem var(--padding);
        color: var(--c-secondary);
        background-color: var(--c-background-dark);
        text-align: center;
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

    /* .group button {
        width: 3rem;
        margin-right: 0.65rem;
        background-color: var(--c-background);
        position: relative;
        transition: all 0.25s;
    } */

    .vote.selected {
        text-shadow: 0 0 0 var(--c-primary);
    }

    .control > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: auto;
        width: 35%;
    }

    .control.selected::after {
        content: "";
        width: 0.25rem;
        height: 0.25rem;
        position: absolute;
        top: 78%;
        left: 50%;
        transform: translate(-50%, -22%);
        border-radius: var(--radius);
        background-color: var(--c-primary);
    }

    .help {
        margin-right: 0.65rem;
        padding: 0.25rem 0.65rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        border-radius: 20px;
        border: 2px solid #ededed;
        color: var(--c-foreground-gray);
    }

    .help-tooltip {
        display: flex;
        flex-direction: column;
        text-align: left;
        border-radius: var(--radius);
    }
</style>
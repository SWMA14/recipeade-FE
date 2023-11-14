<script lang="ts">
    import { faAngleDown, faAngleUp, faStar } from "@fortawesome/free-solid-svg-icons";
    import * as handPose from "@tensorflow-models/handpose";
    import "@tensorflow/tfjs-backend-webgl";
    import { SpeechRecognition } from "@capacitor-community/speech-recognition";
    import { _ } from "svelte-i18n";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import PlayerStates from "youtube-player/dist/constants/PlayerStates.js";
    import type { YouTubePlayer } from "youtube-player/dist/types";
    import { MetaTags } from "svelte-meta-tags";
    import { faArrowRight, faRepeat } from "@fortawesome/free-solid-svg-icons";
    import { beforeNavigate } from "$app/navigation";
    import { analyticsService } from "$lib/analytics";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { pausableTweened } from "$lib/pausableTween";
    import { duration, flyingFade } from "$lib/transition";
    import { timestampToSeconds, type Step } from "$lib/video";
    import { sharedPlayer } from "../../../store";
    import Badge from "$components/Badge.svelte";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import Drawer from "$components/Drawer.svelte";
    import Ingredient from "$components/Ingredient.svelte";

    export let data;

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        isHidden: true
    });

    const progressDuration = 0;
    const title = data.video.youtubeTitle;
    const description = "";

    let steps = data.video.recipesteps.map(step => ({
        seconds: timestampToSeconds(step.timestamp),
        description: step.description
    }) as Step);
    let ingredients = data.video.ingredients.map(ingredient => ({
        ...ingredient,
        usedSteps: getUsedStepsString(ingredient.name)
    }));

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
    }
    let videoDuration: number;
    let videoContentWindow: Window | null;

    let selectedStep = 0;
    let isRendered = false;
    let isAutoNext = true;
    let isRepeating = false;
    let isCommentsTipExpanded = false;
    let isIngredientsExpanded = false;

    let video: HTMLVideoElement;
    let model: handPose.HandPose;
    let handRecognized = 0;
    let handRecognizedEffectShown = false;
    let previousTime = performance.now();
    let raf: number;
    let isRecognizing = true;
    let mediaStream: MediaStream;
    let voiceRecognitionDrawerShow: () => void;
    let voiceRecognitionDrawerHide: () => void;
    let voiceResult: string | undefined = undefined;

    onMount(async () => {
        analyticsService.setScreenName("recipe_cook");
        analyticsService.logEvent("recipe_cook_page", {
            page_title: "recipe_cook_page"
        });

        if (!mediaStream)
            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true
            });
        video = document.querySelector("video#camera-preview") as HTMLVideoElement;
        video.srcObject = mediaStream;
        video.onloadeddata = () => video.play();

        model = await handPose.load();
        raf = requestAnimationFrame(predictHand);

        if ((await SpeechRecognition.checkPermissions()).speechRecognition !== "granted")
            await SpeechRecognition.requestPermissions();

        isRendered = true;
        selectStep(0);

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

    beforeNavigate(() => {
        mediaStream.getTracks().forEach(x => x.stop());
        cancelAnimationFrame(raf);
    })

    async function predictHand(currentTime: number): Promise<void>
    {
        if (!isRecognizing || !model || !mediaStream)
            return new Promise(resolve => raf = requestAnimationFrame(resolve))
                .then(x => predictHand(x as number));

        const deltaTime = currentTime - previousTime;
        previousTime = currentTime;

        const hands = await model.estimateHands(video);
        if (hands.length > 0 && hands[0].handInViewConfidence > 0.95)
        {
            handRecognized += deltaTime;

            if (handRecognized > 1000)
                voiceRecognitionDrawerShow();
        }

        return new Promise(resolve => raf = requestAnimationFrame(resolve))
            .then(x => predictHand(x as number));
    }

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

    function includes(source: string, target: string): boolean
    {
        const splitted = target.split(" ");

        return splitted.some(x => source.includes(x));
    }

    function getUsedSteps(ingredient: string): number[] | undefined
    {
        const result = [] as number[];

        for (let i = 0; i < steps.length; i++)
            if (includes(steps[i].description, ingredient))
                result.push(i);

        return result.length > 0 ? result : undefined;
    }

    function getUsedStepsString(ingredient: string): string | undefined
    {
        const result = [] as string[];

        for (let i = 0; i < steps.length; i++)
            if (includes(steps[i].description, ingredient))
                result.push($_("page.recipe.ingredientsUsedStep", { values: { step: (i + 1).toString() } }));

        return result.length > 0 ? result.join(", ") : undefined;
    }

    function onVoiceRecognitionStart()
    {
        player.pauseVideo();
        isRecognizing = false;

        SpeechRecognition.start({
            language: $_("locale") === "ko" ? "ko-KR" : "en-US",
            maxResults: 1,
            popup: false
        })
            .then(result => voiceResult = result.matches[0])
            .then(() => setTimeout(async () => {
                    await executeCommand();
                    voiceRecognitionDrawerHide();
                }, 500));
    }

    function onVoiceRecognitionEnd()
    {
        if (voiceResult !== "멈춰")
            player.playVideo();
        isRecognizing = true;
        handRecognized = 0;
        voiceResult = undefined;
    }

    async function executeCommand()
    {
        if (voiceResult === "다음" && selectedStep < steps.length - 1)
            await selectStep(selectedStep + 1);
        else if (voiceResult === "이전" && selectedStep > 0)
            await selectStep(selectedStep - 1);
        else if (voiceResult === "실행")
            await player.playVideo();
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

<video id="camera-preview" style="transform: scaleX(-1); opacity: 0.1; position: fixed; z-index: 1; bottom: 0; left: 0; display: none;" />
<div class="section" in:flyingFade={{ delay: 0 }}>
    <Card visibleOverflow noPadding skeleton={!isRendered}>
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
            <div class="used-ingredients">
                {#each ingredients as ingredient, i (ingredient.name)}
                    {#if includes(steps[selectedStep].description, ingredient.name)}
                        <Ingredient white name={ingredient.name} amount={ingredient.quantity ?? ""}{ingredient.unit ?? ""} />
                    {/if}
                {/each}
            </div>
            <div class="buttons">
                <Button kind="white" icon={faArrowRight} rightMargin="xs" selected={isAutoNext} on:click={enableAutoNext}>{$_("page.recipe.autoNextStep")}</Button>
                <Button kind="white" icon={faRepeat} selected={isRepeating} on:click={enableRepeat}>{$_("page.recipe.repeatStep")}</Button>
            </div>
        </div>
    </Card>
    <Card topMargin="2xs" skeleton={!isRendered}>
        <div class="expandable">
            <div class="badge-header">
                <Badge primary small icon={faStar} rightMargin>Pro</Badge>
                <h3>{$_("page.recipe.commentsTip")}</h3>
            </div>
            <div class="button-wrapper">
                <Button kind="transparent" icon={isCommentsTipExpanded ? faAngleUp : faAngleDown}
                    on:click={() => isCommentsTipExpanded = !isCommentsTipExpanded} />
            </div>
        </div>
        {#if isCommentsTipExpanded}
            <Card backgroundColor="info-100" bottomMargin="xs">
                <span class="tip-explain typo-body-2">
                    <strong>{$_("page.recipe.commentsTipExplainTitle")}</strong> {$_("page.recipe.commentsTipExplainDescription")}
                </span>
            </Card>
            <span>이 요리 팁은 찜닭을 만드는 방법에 대한 것입니다. 당근, 양파, 감자 대신 무를 사용하고, 춘장 대신 굴소스를 사용할 수 있습니다. 다시다가 없으면 넣지 않아도 되지만 넣으면 완성도가 더 높아집니다. 닭을 익힐 때는 뚜껑을 안덮고, 특히 닭다리는 피가 계속 흘러나오지 않도록 주의해야 합니다. 굴소스가 없으면 꽃게액젓 한숟가락을 넣어서 맛을 낼 수 있습니다. 닭의 속이 양념이 잘 베어들게 하려면 칼집을 내거나 양념에 재워 놓는 것이 좋습니다. 춘장 없이 할 경우 맛과 색깔 모두 부족하므로 춘장은 반드시 넣어야 합니다. 요리를 좋아하는 사람들에게는 맛술 들어간 찜닭이 추천되며, 이 경우 간이 퍽살까지 잘 베고 맛있습니다.</span>
        {/if}
    </Card>
</div>
<Drawer bind:show={voiceRecognitionDrawerShow} onShow={onVoiceRecognitionStart}
    bind:hide={voiceRecognitionDrawerHide} onHide={onVoiceRecognitionEnd}>
    <div class="voice">
        <div class="effect">
            <div class="ripple" />
            <div class="listening" />
        </div>
        <span>말씀하세요.</span>
        {#if voiceResult}
            <h1>{voiceResult}</h1>
        {/if}
    </div>
</Drawer>

<style lang="postcss">
    .content {
        padding: var(--space-xs);

        & .used-ingredients {
            margin-top: var(--space-m);
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-xs);
        }

        & .buttons {
            margin-top: var(--space-xs);
            display: flex;
            align-items: center;
            justify-content: left;
        }
    }

    .expandable {
        display: flex;
        align-items: center;
        justify-content: space-between;

        & .badge-header {
            display: flex;
            align-items: center;
        }

        & .button-wrapper {
            width: var(--space-xl);
        }
    }

    .tip-explain strong {
        color: var(--info-500);
    }

    .voice {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        & .effect {
            width: var(--space-3xl);
            height: var(--space-3xl);
            margin-top: var(--space-xs);
            display: flex;
            align-items: center;
            justify-content: center;

            @keyframes ripple {
                0% {
                    transform: scale(1);
                }
        
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }

            & .listening {
                width: var(--space-3xl);
                height: var(--space-3xl);
                background-color: var(--info-500);
                border-radius: var(--space-xl);
                position: absolute;
            }

            & .ripple {
                width: var(--space-3xl);
                height: var(--space-3xl);
                position: absolute;
                transform: translate(-50%, -50%);
                background-color: var(--info-100);
                border-radius: var(--space-xl);
                animation: ripple 1.5s linear infinite;
            }
        }

        span {
            margin-top: var(--space-xs);
        }
    }

</style>
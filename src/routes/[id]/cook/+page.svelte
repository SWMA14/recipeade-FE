<script lang="ts">
    import { faAngleDown, faAngleUp, faExpand, faStar, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
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
    import { type AssistantResponse, sendMessage } from "$lib/assistant";
    import { getVoiceGuided, saveVoiceGuided } from "$lib/auth";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { pausableTweened } from "$lib/pausableTween";
    import { duration, flyingFade } from "$lib/transition";
    import { timestampToSeconds, type Step } from "$lib/video";
    import { sharedPlayer, savedVideos, handModel, cookingFullscreen } from "../../../store";
    import Badge from "$components/Badge.svelte";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import ConfirmationDrawer from "$components/ConfirmationDrawer.svelte";
    import Drawer from "$components/Drawer.svelte";
    import Ingredient from "$components/Ingredient.svelte";
    import Input from "$components/Input.svelte";
    import Skeleton from "$components/Skeleton.svelte";
    import StepComponent from "$components/Step.svelte";

    export let data;

    const target = $savedVideos.find(x => x.youtubeVideoId === data.id)!;

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        isHidden: true
    });

    const progressDuration = 0;
    const title = target.youtubeTitle;
    const description = "";

    let steps = target.recipesteps.map(step => ({
        seconds: timestampToSeconds(step.timestamp),
        description: step.description
    }) as Step);
    let ingredients = target.ingredients.map(ingredient => ({
        ...ingredient,
        usedSteps: getUsedStepsString(ingredient.name)
    }));

    let progress = pausableTweened(0, { duration: progressDuration });
    let player: YouTubePlayer = $sharedPlayer;
    let isPaused = false;

    $: if (player) {
        player.getIframe().then(x => videoContentWindow = x.contentWindow);
        player.addEventListener("onStateChange", (event: any) => {
            if (event.data === PlayerStates.PAUSED)
                progress.pause();
            else if (event.data === PlayerStates.PLAYING && progress.paused)
            {
                isPaused = false;
                progress.continue();
            }
        });
    }
    let videoDuration: number;
    let videoContentWindow: Window | null;

    let selectedStep = 0;
    let isRendered = false;
    let isRepeating = false;
    let isCommentsTipExpanded = false;
    let isIngredientsExpanded = false;

    let video: HTMLVideoElement;
    let model: handPose.HandPose;
    let handFirstRecognized = 0;
    let handRecognized = 0;
    let previousTime = performance.now();
    let raf: number;
    let isRecognizing = true;
    let mediaStream: MediaStream;
    let voiceRecognitionGuideDrawerShow: () => void;
    let voiceRecognitionGuideDrawerHide: () => void;
    let voiceRecognitionDrawerShow: () => void;
    let voiceRecognitionDrawerHide: () => void;
    let voiceResult: string | undefined = undefined;
    let isVoiceFailed = false;

    let askTipsValue = "";
    let askTipsResponse: Promise<AssistantResponse> | undefined = undefined;
    let askTipsDrawerShow: () => void;
    let askTipsDrawerHide: () => void;

    let isEscapingPage = false;

    onMount(async () => {
        analyticsService.setScreenName("recipe_cook");
        analyticsService.logEvent("recipe_cook_page", {
            page_title: "recipe_cook_page"
        });

        mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 600,
                height: 600
            }
        });

        if ((await SpeechRecognition.checkPermissions()).speechRecognition !== "granted")
            await SpeechRecognition.requestPermissions();

        video = document.querySelector("video#camera-preview") as HTMLVideoElement;
        video.srcObject = mediaStream;
        video.onloadeddata = () => video.play();
        await checkVideoDimension();

        if (!$handModel)
            $handModel = await handPose.load({
                detectionConfidence: 0.97
            });
        model = $handModel;

        isRendered = true;
        if (!await getVoiceGuided())
            voiceRecognitionGuideDrawerShow();

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
                        selectStep(isRepeating ? selectedStep : selectedStep + 1);
                }
            }
        });

        raf = requestAnimationFrame(predictHand);
    });

    beforeNavigate(() => {
        mediaStream.removeTrack(mediaStream.getTracks()[0]);
        isEscapingPage = true;
        cancelAnimationFrame(raf);
        $cookingFullscreen = false;
    })

    async function checkVideoDimension()
    {
        if (video.videoWidth === 0 || video.videoHeight < 1)
        {
            await new Promise(resolve => setTimeout(resolve, 100));
            await checkVideoDimension();
        }
    }

    async function predictHand(currentTime: number)
    {
        if (isEscapingPage)
            return;

        if (!isRecognizing || !model || !mediaStream)
        {
            raf = requestAnimationFrame(predictHand);
            return;
        }

        const deltaTime = currentTime - previousTime;
        previousTime = currentTime;

        const hands = await model.estimateHands(video, true);
        if (hands.length > 0)
        {
            if (handFirstRecognized === 0)
                handFirstRecognized += deltaTime;
            else if (handFirstRecognized <= 1000)
                handRecognized += deltaTime;

            if (handRecognized > 1000)
                voiceRecognitionDrawerShow();
        }
        else if (handFirstRecognized > 0)
        {
            handFirstRecognized += deltaTime;

            if (handFirstRecognized > 1000)
            {
                handFirstRecognized = 0;
                handRecognized = 0;
            }
        }

        setTimeout(() => raf = requestAnimationFrame(predictHand), 100);
    }

    async function selectStep(step: number)
    {
        if (!isPaused)
            player.playVideo();

        selectedStep = step;
        player.seekTo(steps[step].seconds, true);

        const element = document.querySelector(`#step-button-${step}`);
        if (element)
            element.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
    }

    function enableFullscreen()
    {
        $cookingFullscreen = true;
    }

    function onRepeatClick()
    {
        isRepeating = !isRepeating;
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

    function onVoiceRecognitionAlertEnd()
    {
        selectStep(0);
        isRecognizing = true;
    }

    async function onVoiceRecognitionStart()
    {
        player.pauseVideo();
        isRecognizing = false;

        while (!isRecognizing)
            await SpeechRecognition.start({
                    language: $_("locale") === "ko" ? "ko-KR" : "en-US",
                    maxResults: 1,
                    popup: false
                })
                .then(result => {
                    voiceResult = result.matches[0];
                    isRecognizing = true;
                    handRecognized = -250;
                })
                .catch(() => isVoiceFailed = true);

        isVoiceFailed = false;
        setTimeout(async () => {
            await executeCommand();
            voiceRecognitionDrawerHide();
        }, 250);
    }

    function onVoiceRecognitionEnd()
    {
        SpeechRecognition.stop();
        isRecognizing = true;
        handFirstRecognized = 0;
        handRecognized = 0;
        voiceResult = undefined;

        if (!isPaused)
            player.playVideo();
    }

    async function executeCommand()
    {
        if (!voiceResult)
            return;

        if (voiceResult.includes("다음") && selectedStep < steps.length - 1)
            await selectStep(selectedStep + 1);
        else if (voiceResult.includes("이전") && selectedStep > 0)
            await selectStep(selectedStep - 1);
        else if (voiceResult.includes("실행"))
        {
            isPaused = false;
            await player.playVideo();
        }
        else if (voiceResult.includes("멈춰"))
            isPaused = true;
    }

    function askTipsSubmit()
    {
        askTipsResponse = sendMessage(askTipsValue);
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

<video id="camera-preview" width="600" height="600" />
<div class="hand-indicator" style="--width: calc({handRecognized / 1000} * 100vw);" />
{#if $cookingFullscreen}
    <div class="fullscreen-overlay">
        <div class="used-ingredients">
            {#each ingredients as ingredient (ingredient.name)}
                {#if includes(steps[selectedStep].description, ingredient.name)}
                    <Ingredient name={ingredient.name} amount={ingredient.quantity ?? ""}{ingredient.unit ?? ""} />
                {/if}
            {/each}
        </div>
        <StepComponent index={selectedStep + 1} description={steps[selectedStep].description} />
    </div>
{/if}
<div class="section" in:flyingFade={{ delay: 0 }}>
    <Card visibleOverflow noPadding skeleton={!isRendered}>
        <div style="margin-top: 1rem;">
            <Carousel leftOverflow rightOverflow>
                {#each [...Array(steps.length).keys()] as i}
                    <Button id="step-button-{i}" on:click={() => selectStep(i)} selected={i === selectedStep}
                        leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs"
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
                <!-- <Button kind="white" icon={faExpand} rightMargin="xs" on:click={enableFullscreen}>{$_("page.recipe.autoNextStep")}</Button> -->
                <Button kind="white" icon={faRepeat} selected={isRepeating} on:click={onRepeatClick}>{$_("page.recipe.repeatStep")}</Button>
            </div>
            <Button kind="primary" icon={faWandMagicSparkles} on:click={askTipsDrawerShow}>재료 손질법 물어보기</Button>
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
<ConfirmationDrawer bind:show={voiceRecognitionGuideDrawerShow} bind:hide={voiceRecognitionGuideDrawerHide} onHide={onVoiceRecognitionAlertEnd}
    confirmText="다시 보지 않기" onConfirm={saveVoiceGuided} cancelText={$_("page.confirm")}
    heading="음성 인식 사용" text="레시피에이드는 손을 쓰지 않고 음성만으로도 영상을 제어하는 기능을 제공해요. 음성 인식을 보다 정확하고 편리하게 사용하려면 다음 사항들을 확인해 주세요.">
    <ul>
        <li>전면 카메라에 한쪽 손을 약 1초간 보이고 있으면 영상이 멈추고 음성 인식이 시작돼요.</li>
        <li>음성 인식이 시작됐을 때 안내되는 명령 중 하나를 말씀하시면 원하는 대로 영상을 제어할 수 있어요.</li>
        <li>손이 카메라에서 40cm ~ 1m 이상 떨어져서 카메라에 손 전체가 완전히 들어와야 인식률이 높아요.</li>
    </ul>
</ConfirmationDrawer>
<Drawer bind:show={voiceRecognitionDrawerShow} onShow={onVoiceRecognitionStart}
    bind:hide={voiceRecognitionDrawerHide} onHide={onVoiceRecognitionEnd}>
    <div class="voice">
        <div class="effect">
            <div class="ripple" />
            <div class="listening" />
        </div>
        <span class="prompt">말씀하세요.</span>
        <h1>{voiceResult ?? " "}</h1>
        <Card backgroundColor="info-100" topMargin="xs">
            <span class="tip-explain typo-body-2">
                <strong>{$_("page.recipe.commentsTipExplainTitle")}</strong> 현재 레시피에이드는 이 명령들만 인식할 수 있어요. 정확히 말씀해 주시면 알맞는 명령을 실행해 드릴게요.
            </span>
            <ul>
                <li>다음</li>
                <li>이전</li>
                <li>멈춰</li>
                <li>실행</li>
            </ul>
        </Card>
        {#if isVoiceFailed}
            <Card backgroundColor="danger-100" topMargin="xs">
                인식하지 못했어요. 다시 시도해 주세요.
            </Card>
        {/if}
    </div>
</Drawer>
<Drawer bind:show={askTipsDrawerShow} bind:hide={askTipsDrawerHide} heading="어떤 손질법이 궁금하세요?">
    <div class="ask">
        <Card backgroundColor="info-100" bottomMargin="xs">
            <span class="tip-explain typo-body-2">
                <strong>{$_("page.recipe.commentsTipExplainTitle")}</strong> 궁금하신 재료 손질법을 입력하시면 검색을 통해 적절한 방법을 알려 드려요.
            </span>
        </Card>
        <Input placeholder="닭고기 손질법" bottomMargin="xs" bind:value={askTipsValue} />
        <Button kind={askTipsValue !== "" ? "primary" : "gray"} bottomMargin="xs" on:click={() => askTipsValue !== "" ? askTipsSubmit() : undefined}>전송하기</Button>
        {#if askTipsResponse !== undefined}
            {#await askTipsResponse}
                <Skeleton kind="body" lines={2} />
            {:then data}
                {data.text.replace(/(?:\[|【)\d+†.+(?:\]|】)/, "")}
            {:catch}
                <Card backgroundColor="danger-100">
                    오류가 발생했어요. 다시 시도해 주세요.
                </Card>
            {/await}
        {/if}
    </div>
</Drawer>

<style lang="postcss">
    #camera-preview {
        width: 600px;
        height: 600px;
        position: fixed;
        left: 0;
        bottom: 0;
        transform: scaleX(-1);
        display: none;
    }

    .hand-indicator {
        width: var(--width);
        height: 100vh;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 1;
        opacity: 0.3;
        background-color: var(--info-100);
        transition: all 0.25s;
    }

    .fullscreen-overlay {
        width: 40vw;
        position: fixed;
        top: 50%;
        right: var(--space-xs);
        transform: translateY(-50%);
        z-index: 10;
        opacity: 0.5;
        pointer-events: none;
    }

    .content {
        padding: var(--space-xs);

        & .buttons {
            margin: var(--space-xs) 0;
            display: flex;
            align-items: center;
            justify-content: left;
        }
    }

    .used-ingredients {
        margin-top: var(--space-m);
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-xs);
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

        .prompt {
            margin-top: var(--space-m);
        }
    }

    .ask {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
</style>
<script lang="ts">
    import { faAngleDown, faAngleUp, faStar } from "@fortawesome/free-solid-svg-icons";
    import { _ } from "svelte-i18n";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
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
    import Badge from "$components/Badge.svelte";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import Ingredient from "$components/Ingredient.svelte";
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

        selectStep(0);
    }
    let videoDuration: number;
    let videoContentWindow: Window | null;

    let selectedStep = 0;
    let isRendered = false;
    let isAutoNext = true;
    let isRepeating = false;
    let isCommentsTipExpanded = false;
    let isIngredientsExpanded = false;

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
                <div class="used-ingredients">
                    {#each ingredients as ingredient, i (ingredient.name)}
                        {#if includes(steps[selectedStep].description, ingredient.name)}
                            <Ingredient white name={ingredient.name} amount={ingredient.quantity ?? ""}{ingredient.unit ?? ""}
                                usedSteps={getUsedSteps(ingredient.name)} />
                        {/if}
                    {/each}
                </div>
                <div class="buttons">
                    <Button kind="white" icon={faArrowRight} rightMargin="xs" selected={isAutoNext} on:click={enableAutoNext}>{$_("page.recipe.autoNextStep")}</Button>
                    <Button kind="white" icon={faRepeat} selected={isRepeating} on:click={enableRepeat}>{$_("page.recipe.repeatStep")}</Button>
                </div>
            </div>
        </Card>
        <Card topMargin="2xs">
            <div class="expandable">
                <div class="badge-header">
                    <Badge primary icon={faStar} rightMargin>Pro</Badge>
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
        <Card topMargin="2xs">
            <div class="expandable">
                <h3>{$_("page.recipe.ingredients")}</h3>
                <div class="button-wrapper">
                    <Button kind="transparent" icon={isIngredientsExpanded ? faAngleUp : faAngleDown}
                        on:click={() => isIngredientsExpanded = !isIngredientsExpanded} />
                </div>
            </div>
            {#if isIngredientsExpanded}
                <div class="ingredients">
                    {#each ingredients as ingredient, i (ingredient.name)}
                        {@const used = includes(steps[selectedStep].description, ingredient.name)}
                        <Card backgroundColor={used ? "primary-500" : "white"} bottomMargin={i === ingredients.length - 1 ? undefined : "xs"}>
                            <div class="ingredient" class:accent={used}>
                                <div class="name">
                                    <span>{ingredient.name}</span>
                                    {#if ingredient.usedSteps}
                                        <span class="typo-body-2">{ingredient.usedSteps}</span>
                                    {/if}
                                </div>
                                <span>{ingredient.quantity ?? ""}{ingredient.unit ?? ""}</span>
                            </div>
                        </Card>
                    {/each}
                </div>
            {/if}
        </Card>
    </div>
{/if}

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

    .ingredient {
        width: -webkit-fill-available;
        margin-right: var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: space-between;

        & .name {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            & .typo-body-2 {
                color: var(--gray-800);
            }
        }

        & span:nth-child(2) {
            color: var(--primary-500);
        }

        &.accent {
            color: var(--white);
            background-color: var(--primary-500);
        }

        &.accent span:nth-child(2) {
            color: var(--white);
        }
    }

    .section {
        margin-top: var(--space-2xl);
    }
</style>
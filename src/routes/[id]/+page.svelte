<script lang="ts">
    import { Share } from "@capacitor/share";
    import { SortableList } from "@jhubbardsf/svelte-sortablejs";
    import { faAngleDown, faCheck, faClock, faGripLinesVertical, faPlus, faShare, faTag, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { goto } from "$app/navigation";
    import { PUBLIC_API_ENDPOINT, PUBLIC_LANDING_ENDPOINT } from "$env/static/public";
    import { analyticsService } from "$lib/analytics";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { tags } from "$lib/tag";
    import { flyingFade } from "$lib/transition";
    import { type VideoData, convertVideoDataToApi, unitizeViews } from "$lib/video";
    import { allVideos, sharedPlayer } from "../../store";
    import AsymmetricGrid from "$components/AsymmetricGrid.svelte";
    import Badge from "$components/Badge.svelte";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import Ingredient from "$components/Ingredient.svelte";
    import Input from "$components/Input.svelte";
    import Modal from "$components/Modal.svelte";
    import Step from "$components/Step.svelte";
    import Video from "$components/Video.svelte";
    import lowerLeading from "./__lowerBarComponents/leading.svelte";
    import lowerMain from "./__lowerBarComponents/main.svelte";
  import { authedFetch } from "$lib/auth";

    export let data;

    let isEditing = false;

    $: getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        ...x,
        isHidden: true
    });
    $: getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        leading: lowerLeading,
        leadingProps: {
            isEditing,
            onEditStart,
            onEditCancel
        },
        main: lowerMain,
        mainProps: {
            isEditing,
            onEditExit
        },
    });

    let isRendered = false;
    let device: "ios" | "android" | "web" = getContext("device");
    let recipe = $allVideos.find(x => x.youtubeVideoId === data.id) ?? data.video;
    let cache = {} as VideoData;
    let tagsModalShown = false;

    onMount(() => {
        isRendered = true;

        analyticsService.setScreenName("recipe");
        analyticsService.logEvent("recipeview_page", {
            page_title: "recipeview_page"
        });
    });

    function saveRecipe()
    {
        // const index = $allVideos.findIndex(x => x.youtubeVideoId === data.id);
        // $allVideos[index] = structuredClone(cache);
        recipe = cache;

        console.log(authedFetch(`${PUBLIC_API_ENDPOINT}/customize/update/${data.video.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(convertVideoDataToApi(recipe))
        }));
    }

    function onEditStart()
    {
        cache = structuredClone($allVideos.find(x => x.youtubeVideoId === data.id) ?? data.video);
        isEditing = true;
    }

    function onEditCancel()
    {
        isEditing = false;
    }

    function onEditExit()
    {
        isEditing = false;

        cache.ingredients = cache.ingredients.filter(x => x.name);
        cache.recipesteps = cache.recipesteps.filter(x => x.description);

        saveRecipe();
    }

    async function getCurrentTimestamp()
    {
        const time = await $sharedPlayer.getCurrentTime();
        const minutes = `${Math.floor(time / 60)}`.padStart(2, "0");
        const seconds = `${Math.floor(time % 60)}`.padStart(2, "0");

        return `${minutes}:${seconds}`;
    }

    function handleIngredientsSort(e: any)
    {
        const temp = cache.ingredients[e.oldIndex];
        cache.ingredients[e.oldIndex] = cache.ingredients[e.newIndex];
        cache.ingredients[e.newIndex] = temp;
    }

    async function addIngredient()
    {
        cache.ingredients = [
            ...cache.ingredients,
            {
                name: "",
                quantity: "",
                unit: "",
                usedSteps: undefined
            }
        ];
    }

    function handleStepsSort(e: any)
    {
        const temp = cache.recipesteps[e.oldIndex];
        cache.recipesteps[e.oldIndex] = cache.recipesteps[e.newIndex];
        cache.recipesteps[e.newIndex] = temp;
    }

    async function addStep()
    {
        cache.recipesteps = [
            ...cache.recipesteps,
            {
                description: "",
                seconds: 0,
                timestamp: await getCurrentTimestamp()
            }
        ];
    }

    async function share()
    {
        if (!await Share.canShare())
            return;

        await Share.share({
            title: data.video.youtubeTitle,
            text: "레시피에이드에서 YouTube 레시피 영상에서 중요한 부분만을 손쉽게 확인하고 따라하세요.",
            url: `${PUBLIC_LANDING_ENDPOINT}/${data.id}`
        });
    }

    function onTagClick(tag: string)
    {
        if (!cache.tags?.includes(tag))
            cache.tags = [
                ...(cache.tags ?? []),
                tag
            ];
        else
            cache.tags = cache.tags.filter(x => x !== tag);
    }

    function confident(x: any)
    {
        return x!;
    }
</script>

{#if isRendered}
    <div class="section" in:flyingFade={{ delay: 0 }}>
        <div class="tags" class:bottom-margin-less={isEditing || recipe.tags?.length}>
            {#if isEditing && cache.tags}
                {#each cache.tags as tag (tag)}
                    <Badge>{tag}</Badge>
                {/each}
            {:else if recipe.tags}
                {#each recipe.tags as tag (tag)}
                    <Badge>{tag}</Badge>
                {/each}
            {/if}
            {#if isEditing}
                <Button kind="gray" size="medium" style="width: fit-content;" icon={faTag} on:click={() => tagsModalShown = true}>태그 수정</Button>
            {/if}
        </div>
        <div class="title no-margin">
            <h2>{data.video.youtubeTitle}</h2>
             <!-- TODO: possible infinite loop when used with history.back() -->
            <Button kind="white" style="width: var(--space-xl);" icon={faAngleDown} on:click={() => goto("/")} />
        </div>
        <p class="statistics typo-body-2">
            조회수 {unitizeViews(data.video.youtubeViewCount)}회 · {data.video.channel}
        </p>
        {#if !isEditing}
            <div class="buttons">
                <Button icon={faCheck} style="width: fit-content;" rightMargin="xs">저장됨</Button>
                <Button kind="gray" icon={faShare} style="width: var(--space-xl);" rightMargin="xs" on:click={share} />
            </div>
        {/if}
    </div>
    <div class="section second" in:flyingFade={{ delay: 0 }}>
        <div class="title">
            <h2>재료</h2>
        </div>
        {#if isEditing}
            <SortableList class="sortable-list" handle=".handle" onEnd={handleIngredientsSort}>
                {#each cache.ingredients as ingredient, i (ingredient.name)}
                    <Card bottomMargin="xs">
                        <div class="list-content">
                            <div class="ingredient" class:edit={isEditing}>
                                <Input placeholder="재료명" value={ingredient.name} on:change={e => cache.ingredients[i].name = confident(e.target).value}
                                    fittedHeight noPadding noDelete />
                                <div style="color: var(--primary-500);">
                                <Input placeholder="수량" value={ingredient.quantity ?? ""}{ingredient.unit ?? ""} on:change={e => {
                                    cache.ingredients[i].quantity = confident(e.target).value;
                                    cache.ingredients[i].unit = "";
                                }} fittedHeight noPadding noDelete />
                                </div>
                            </div>
                            <div class="button-wrapper">
                                <Button kind="transparent" size="small" icon={faTrash} on:click={() => {
                                    cache.ingredients.splice(i, 1);
                                    cache = cache;
                                }} />
                            </div>
                            <div class="button-wrapper handle">
                                <Button kind="transparent" size="small" icon={faGripLinesVertical} />
                            </div>
                        </div>
                    </Card>
                {/each}
                <Button kind="gray" icon={faPlus} on:click={addIngredient}>재료 추가하기</Button>
            </SortableList>
        {:else}
            <AsymmetricGrid>
                {#each recipe.ingredients as ingredient (ingredient.name)}
                    <Ingredient name={ingredient.name} amount={ingredient.quantity ?? ""}{ingredient.unit ?? ""} 
                        usedSteps={ingredient.usedSteps} />
                {/each}
            </AsymmetricGrid>
        {/if}
    </div>
    <div class="section last" class:ios={device === "ios"}
        in:flyingFade={{ delay: 0 }}>
        <div class="title">
            <h2>단계</h2>
        </div>
        {#if isEditing}
            <div class="steps">
                <SortableList class="sortable-list" handle=".handle" onEnd={handleStepsSort}>
                    {#each cache.recipesteps as step, i (step.description)}
                        <Card bottomMargin="xs">
                            <div class="list-content">
                                <div class="step">
                                    <Input placeholder="단계 설명" value={step.description} on:focusout={e => cache.recipesteps[i].description = confident(e.target).textContent}
                                        autoBreak fittedHeight noPadding noDelete />
                                    <div class="timestamp">
                                        <span>{step.timestamp}</span>
                                        <div class="button-wrapper">
                                            <Button size="small" style="width: fit-content;" icon={faClock}
                                                on:click={async () => cache.recipesteps[i].timestamp = await getCurrentTimestamp()}>
                                                현재 시간으로
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div class="button-wrapper">
                                    <Button kind="transparent" size="small" icon={faTrash} on:click={() => {
                                        cache.recipesteps.splice(i, 1);
                                        cache = cache;
                                    }} />
                                </div>
                                <div class="button-wrapper handle">
                                    <Button kind="transparent" size="small" icon={faGripLinesVertical} />
                                </div>
                            </div>
                        </Card>
                    {/each}
                </SortableList>
                <Button kind="gray" icon={faPlus} on:click={addStep}>단계 추가하기</Button>
            </div>
        {:else}
            {#each recipe.recipesteps as step, i (step.description)}
                <Step index={i + 1} description={step.description} bottomMargin="xs" />
            {/each}
        {/if}
    </div>
    <!-- {#if !isEditing}
        <div class="section last" class:ios={device === "ios"} in:flyingFade={{ delay: 0 }}>
            {#if data.recommended.length > 0}
                <Carousel leftOverflow rightOverflow heading="이 레시피는 어때요?" canShowAll>
                    {#each data.recommended as video, i (video.youtubeThumbnail)}
                        <Video {video} leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs" />
                    {/each}
                    <svelte:fragment slot="grid">
                        {#each data.recommended as video (video.youtubeThumbnail)}
                            <Video {video} verbose bottomMargin="xs" />
                        {/each}
                    </svelte:fragment>
                </Carousel>
            {/if}
        </div>
    {/if} -->
    <Modal bind:shown={tagsModalShown}>
        <Card backgroundColor="white">
            <div class="heading">
                <h3>태그 수정</h3>
                <Button kind="transparent" icon={faXmark} fitted on:click={() => tagsModalShown = false} />
                </div>
            <div class="tags bottom-margin">
                {#each tags as tag (tag)}
                    <div class="tag">
                        <Button kind={cache.tags?.includes(tag) ? "primary" : "gray"} size="medium" style="width: fit-content;" badge
                            on:click={() => onTagClick(tag)}>
                            {tag}
                        </Button>
                    </div>
                {/each}
            </div>
            <Button on:click={() => tagsModalShown = false}>닫기</Button>
        </Card>
    </Modal>
{/if}

<style lang="postcss">
    .section {
        width: 100%;
        margin-bottom: var(--space-m);

        &.second {
            margin-top: var(--space-3xl);
        }

        &.last {
            margin-bottom: var(--space-xs);

            &.ios {
                margin-bottom: var(--space-s);
            }
        }
    }

    .title {
        margin-bottom: var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: space-between;

        &.no-margin {
            margin-bottom: 0;
        }
    }

    .statistics {
        color: var(--gray-700);
    }

    .buttons {
        margin-top: var(--space-xs);
        display: flex;
    }

    .review {
        width: -webkit-fill-available;
        margin: 0 calc(var(--space-xs) * -1);
        margin-bottom: var(--space-xs);
        padding: var(--space-xs);
        display: flex;
        align-items: center;
        color: var(--primary-500);
        background-color: var(--primary-100);

        & span {
            margin-left: var(--space-2xl);
        }
    }

    .profile {
        width: var(--space-m);
        height: var(--space-m);
        margin-right: var(--space-2xs);
        border-radius: var(--radius-big);
        background-color: var(--white);
        position: absolute;

        &.over {
            outline: solid var(--space-3xs) var(--primary-100);
            z-index: 2;
        }

        &.below {
            left: var(--space-m);
        }
    }

    .list-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .button-wrapper {
        width: var(--space-m);
    }

    .ingredient {
        width: -webkit-fill-available;
        margin-right: var(--space-xs);
        display: flex;
        justify-content: space-between;

        &.edit {
            flex-direction: column;
        }
    }

    .ingredient span:nth-child(2) {
        color: var(--c-primary);
    }

    .steps {
        display: flex;
        flex-direction: column;

        & h2 {
            margin-bottom: var(--space-2xs);
        }
    }

    .step {
        width: -webkit-fill-available;
        margin-right: var(--space-xs);
        display: flex;
        flex-direction: column;
    }

    .description:empty:before {
        content: attr(placeholder);
        color: var(--gray-400);
    }

    .timestamp {
        margin-top: var(--space-2xs);
        display: flex;
        align-items: center;

        & .button-wrapper {
            width: calc(var(--space-3xl) * 2);
        }

        & span {
            margin-right: var(--space-2xs);
            color: var(--primary-500);
            font-variant-numeric: tabular-nums;
        }
    }

    .heading {
        margin-bottom: var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2xs);

        &.bottom-margin-less {
            margin-bottom: var(--space-3xs);
        }

        &.bottom-margin {
            margin-bottom: var(--space-xs);
        }

        & .tag {
            width: fit-content;
        }
    }
</style>
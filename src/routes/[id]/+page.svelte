<script lang="ts">
    import { Share } from "@capacitor/share";
    import { SortableList } from "@jhubbardsf/svelte-sortablejs";
    import { faClock, faGripLinesVertical, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { PUBLIC_LANDING_ENDPOINT } from "$env/static/public";
    import { analyticsService } from "$lib/analytics";
    import { getCategoryById } from "$lib/category";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { tags } from "$lib/tag";
    import { flyingFade } from "$lib/transition";
    import { unitizeViews, getLikedVideos, saveLikedVideo, removeLikedVideo, type VideoData } from "$lib/video";
    import { allVideos, sharedPlayer } from "../../store";
    import AsymmetricGrid from "$components/AsymmetricGrid.svelte";
    import Badge from "$components/Badge.svelte";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import Ingredient from "$components/Ingredient.svelte";
    import Input from "$components/Input.svelte";
    import Stack from "$components/Stack.svelte";
    import Step from "$components/Step.svelte";
    import Video from "$components/Video.svelte";
    import upperLeading from "./__upperBarComponents/leading.svelte";
    import upperTrailing from "./__upperBarComponents/trailing.svelte";
    import lowerLeading from "./__lowerBarComponents/leading.svelte";
    import lowerMain from "./__lowerBarComponents/main.svelte";

    export let data;

    let isEditing = false;
    let isLiked = getLikedVideos().then(videos => videos.some(x => x.id === data.id));

    $: getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        leading: upperLeading,
        leadingProps: {
            onClick: () => history.back()
        },
        trailing: upperTrailing,
        trailingProps: {
            onClick: share
        },
        isBackgroundShown: true
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

    const dynamicBarContext: DynamicBarContext = {
        leadingProps: {
            onClick: hideTagStack
        },
        mainProps: {
            heading: "태그 수정"
        }
    };

    let isRendered = false;
    let device: "ios" | "android" | "web" = getContext("device");
    let recipe = $allVideos.find(x => x.youtubeVideoId === data.id) ?? data.video;
    let cache = {} as VideoData;
    let shown = false;

    onMount(() => {
        isRendered = true;

        analyticsService.setScreenName("recipe");
        analyticsService.logEvent("recipeview_page", {
            page_title: "recipeview_page"
        });
    });

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

        const index = $allVideos.findIndex(x => x.youtubeVideoId === data.id);
        $allVideos[index] = structuredClone(cache);
        recipe = cache;
    }

    function showTagStack()
    {
        shown = true;
    }

    function hideTagStack()
    {
        shown = false;
    }

    async function onLikeClick()
    {
        if (await isLiked)
        {
            await removeLikedVideo(data.id);
            isLiked = Promise.resolve(false);
        }
        else
        {
            await saveLikedVideo(data.id);
            isLiked = Promise.resolve(true);
        }
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
                unit: ""
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
</script>

{#if isRendered}
    <div class="section first" in:flyingFade={{ delay: 0 }}>
        <div class="badges">
            <Badge dark rightMargin>{getCategoryById(data.video.difficulty)}</Badge>
            <Badge dark rightMargin>{data.video.category}</Badge>
            {#if isEditing}
                <Button kind="badge" size="small" on:click={showTagStack}>태그 수정</Button>
            {/if}
        </div>
        <h2>{data.video.youtubeTitle}</h2>
        <p class="statistics typo-body-2">
            조회수 {unitizeViews(data.video.youtubeViewCount)}회 · {data.video.channel.ChannelName}
        </p> <!-- TODO: 업로드 날짜 -->
        <!-- <div class="channel">
            <div class="profile">
                <img src="https://i.namu.wiki/i/d1A_wD4kuLHmOOFqJdVlOXVt1TWA9NfNt_HA0CS0Y_N0zayUAX8olMuv7odG2FiDLDQZIRBqbPQwBSArXfEJlQ.webp" alt="채널 이미지" />
                {data.video.channel.ChannelName}
            </div>
            <div>
                <Button size="small">구독</Button>
            </div>
        </div> -->
    </div>
    <div class="section" in:flyingFade={{ delay: 0 }}>
        <div class="title">
            <h2>재료</h2>
        </div>
        {#if isEditing}
            <SortableList class="sortable-list" handle=".handle" onEnd={handleIngredientsSort}>
                {#each cache.ingredients as ingredient, i (ingredient.name)}
                    <Card bottomMargin="xs">
                        <div class="list-content">
                            <div class="ingredient" class:edit={isEditing}>
                                <Input placeholder="재료명" value={ingredient.name} on:change={e => cache.ingredients[i].name = e.target.value}
                                    fittedHeight noPadding noDelete />
                                <div style="color: var(--primary-500);">
                                <Input placeholder="수량" value={ingredient.quantity ?? ""}{ingredient.unit ?? ""} on:change={e => {
                                    cache.ingredients[i].quantity = e.target.value;
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
                    <Ingredient name={ingredient.name} amount={ingredient.quantity ?? ""}{ingredient.unit ?? ""} />
                {/each}
            </AsymmetricGrid>
        {/if}
    </div>
    <div class="section" class:last={data.recommended.length === 0 || isEditing} class:ios={data.recommended.length === 0 && device === "ios"}
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
                                    <Input placeholder="단계 설명" value={step.description} on:focusout={e => cache.recipesteps[i].description = e.target.textContent}
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
    {#if !isEditing}
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
    {/if}
    {#if shown}
        <Stack {dynamicBarContext} onBack={hideTagStack}>
            <div class="tags">
                {#each tags as tag (tag)}
                    <div class="tag">
                        <Button kind="badge" size="small">
                            {tag}
                        </Button>
                    </div>
                {/each}
            </div>
        </Stack>
    {/if}
{/if}

<style lang="postcss">
    .section {
        width: 100%;
        margin-bottom: var(--space-m);

        &.first {
            margin-top: var(--space-2xl);
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
        justify-content: space-between;
    }

    .badges {
        margin-bottom: var(--space-2xs);
        display: flex;
        align-items: center;
    }

    .statistics {
        color: var(--gray-700);
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

    /* .channel {
        width: 100%;
        margin-top: var(--space-xs);
        padding-bottom: var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .profile {
        display: flex;
        align-items: center;
    }

    .profile img {
        width: var(--space-m);
        height: var(--space-m);
        margin-right: var(--space-2xs);
        object-fit: cover;
        border-radius: var(--radius-big);
    } */

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

    .tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;

        & .tag {
            margin-right: var(--space-2xs);
            margin-bottom: var(--space-2xs);
        }
    }
</style>
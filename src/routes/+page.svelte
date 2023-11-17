<script lang="ts">
    import { faPlus } from "@fortawesome/free-solid-svg-icons";
    import { _ } from "svelte-i18n";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { savedVideos } from "../store";
    import { PUBLIC_API_ENDPOINT } from "$env/static/public";
    import { authedFetch, getAccessToken } from "$lib/auth";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { DUMMY_VIDEO } from "$lib/dummy";
    import { flyingFade } from "$lib/transition";
    import { type VideoData, convertApiToVideoData, getVideoInfo } from "$lib/video";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import ConfirmationDrawer from "$components/ConfirmationDrawer.svelte";
    import Drawer from "$components/Drawer.svelte";
    import Input from "$components/Input.svelte";
    import Skeleton from "$components/Skeleton.svelte";
    import Video from "$components/Video.svelte";
    import leading from "./__lowerBarComponents/leading.svelte";
    import main from "./__lowerBarComponents/main.svelte";

    let device: "ios" | "android" | "web" = getContext("device");
    let isEditing = false;
    let isRendered = false;
    let recipeAddDrawerShown = false;
    let recipeAddDrawerShow: () => void;
    let recipeAddDrawerHide: () => void;
    let recipeAddDrawerValue: string;
    let recipeAddAlreadyExists = false;
    let recipeAddInvalid = false;
    let recipeAddLanguage = $_("locale");
    let recipeAddPreview: Promise<any> | undefined = undefined;
    let selectedVideos: VideoData[] = [];
    let recipeDeleteDrawerShow: () => void;
    let recipeDeleteDrawerHide: () => void;

    $: recipeAddId = recipeAddDrawerValue?.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=)([^#\&\?]*).*/)?.[1];
    $: recipeAddPreview = recipeAddId && recipeAddId.length === 11 ? getVideoInfo(recipeAddId) : undefined;

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
    });
    $: getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        leading: isEditing || recipeAddDrawerShown ? leading : undefined,
        leadingProps: {
            isEditing,
            onEditCancel: exitEditRecipes,
            onAddCancel: recipeAddDrawerHide
        },
        main,
        mainProps: {
            isEditing,
            selected: selectedVideos.length,
            onDeleteRecipes: recipeDeleteDrawerShow,
            isAddingRecipe: recipeAddDrawerShown,
            onAddRecipe: () => addRecipe(recipeAddDrawerValue)
        },
        isFitted: !isEditing && !recipeAddDrawerShown
    });

    onMount(async () => {
        if (await getAccessToken() !== null && $savedVideos.length === 0)
            $savedVideos = await fetchSavedRecipes();

        isRendered = true;
    });

    async function fetchSavedRecipes(): Promise<VideoData[]>
    {
        const result = await authedFetch(`${PUBLIC_API_ENDPOINT}/customize/recipes`)
            .then(response => response.status === 404 ? [] : response.json());

        return await Promise.all(result
            .map(async (video: any) => convertApiToVideoData(video)));
    }

    async function addRecipe(link: string)
    {
        const result = await authedFetch(`${PUBLIC_API_ENDPOINT}/customize/create_default?sourceLink=${link}&lang=${recipeAddLanguage}`, {
            method: "POST"
        });

        if (result.status === 500)
        {
            recipeAddAlreadyExists = true;
            setTimeout(() => recipeAddAlreadyExists = false, 3000);

            return;
        }

        const id = link.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/)?.[1];

        if (id === undefined)
        {
            recipeAddInvalid = true;
            setTimeout(() => recipeAddInvalid = false, 3000);

            return;
        }

        const info = await getVideoInfo(id);
        
        $savedVideos = [{
            youtubeVideoId: id,
            youtubeTitle: info.title,
                youtubeThumbnail: info.thumbnail,
                youtubeViewCount: info.viewCounts,
                channel: info.channel,
                temporary: true
            } as VideoData, ...$savedVideos];
        recipeAddDrawerHide();

        const interval = setInterval(async () => {
            const videos = await fetchSavedRecipes();
            const target = videos.find(x => x.youtubeVideoId === id)?.ingredients;

            if (target !== undefined && target.length > 0)
            {
                clearInterval(interval);
                $savedVideos = videos;
            }
        }, 1000);
    }

    async function endEditRecipes()
    {
        $savedVideos = $savedVideos.filter(x => !selectedVideos.includes(x));
        await Promise.all(selectedVideos
            .map(video => authedFetch(`${PUBLIC_API_ENDPOINT}/customize/${video.id}`, {
                method: "DELETE"
            })));
        exitEditRecipes();
    }

    function exitEditRecipes()
    {
        isEditing = false;
        selectedVideos = [];
    }

    function exitAddRecipe()
    {
        recipeAddDrawerValue = "";
        recipeAddPreview = undefined;
    }

    function onVideoSelect(selected: boolean, video: VideoData)
    {
        if (selected)
            selectedVideos = [...selectedVideos, video];
        else
            selectedVideos = selectedVideos.filter(x => x !== video);
    }
</script>

<div class="section" class:ios={device === "ios"} in:flyingFade={{ delay: 0 }}>
    <div class="title">
        {#if !isRendered}
            <Skeleton kind="heading" lines={2} />
        {:else}
            <h1>{@html $_("page.home.greeting")}</h1>
            <div class="buttons">
                <Button kind="transparent" size="small" on:click={() => isEditing ? exitEditRecipes() : isEditing = true}>
                    {$_("page.home.editRecipes")}
                </Button>
            </div>
        {/if}
    </div>
    {#if !isRendered}
        <Card skeleton bottomMargin="xs">
            <div style="height: var(--space-xs);" />
        </Card>
    {:else if !isEditing}
        <Button kind="gray" icon={faPlus} bottomMargin="xs" on:click={recipeAddDrawerShow}>{$_("page.home.addRecipe")}</Button>
    {/if}
    {#if !isRendered}
        {#each Array(3) as _}
            <Video skeleton video={DUMMY_VIDEO} bottomMargin="xs" />
        {/each}
    {:else}
        {#key isEditing}
            {#if $savedVideos.length > 0}
                {#each isEditing ? $savedVideos.filter(x => !x.temporary) : $savedVideos as video}
                    <Video {video} bottomMargin="xs" selectable={isEditing}
                        selected={isEditing ? selectedVideos.includes(video) : false} onSelect={onVideoSelect} />
                {/each}
            {:else}
                <div class="no-result">
                    <img src="/images/no-result.png" alt="저장한 레시피 없음" />
                    <span>{$_("page.home.noAddedRecipes")}</span>
                </div>
            {/if}
        {/key}
    {/if}
</div>
<Drawer heading={$_("page.home.addRecipeModalTitle")} bind:shown={recipeAddDrawerShown}
    bind:show={recipeAddDrawerShow} bind:hide={recipeAddDrawerHide} onHide={exitAddRecipe}>
    <span class="add guide">{$_("page.home.addRecipeModalDescription")}</span>
    <Input placeholder={$_("page.home.addRecipeModalInputPlaceholder")} valueChanged={value => recipeAddDrawerValue = value} />
    {#if recipeAddPreview}
        {#await recipeAddPreview}
            <Skeleton kind="body" lines={2} topMargin="xs" />
        {:then preview}
            <div class="preview">
                <img src={preview["thumbnail"].replace("sddefault", "mqdefault")} alt="레시피 썸네일" />
                <div class="info">
                    <span>{preview["title"]}</span>
                    <span class="typo-body-2">{preview["channel"]}</span>
                </div>
            </div>
        {/await}
    {/if}
    <div class="languages">
        <span>{$_("page.home.addRecipeModalLanguageTitle")}</span>
        <div class="buttons">
            <Button kind="gray" rightMargin="xs" selected={recipeAddLanguage === "ko"} on:click={() => recipeAddLanguage = "ko"}>
                {$_("page.home.addRecipeModalLanguageKo")}
            </Button>
            <Button kind="gray" selected={recipeAddLanguage === "en"} on:click={() => recipeAddLanguage = "en"}>
                {$_("page.home.addRecipeModalLanguageEn")}
            </Button>
        </div>
    </div>
    {#if recipeAddInvalid}
        <Card backgroundColor="danger-100" topMargin="xs">
            {$_("page.home.addRecipeModalInvalidLink")}
        </Card>
    {:else if recipeAddAlreadyExists}
        <Card backgroundColor="danger-100" topMargin="xs">
            {$_("page.home.addRecipeModalAlreadySaved")}
        </Card>
    {/if}
</Drawer>
<ConfirmationDrawer heading={$_("page.recipe.deleteRecipeConfirmHeading")} text={$_("page.recipe.deleteRecipeConfirmText")}
    bind:show={recipeDeleteDrawerShow} bind:hide={recipeDeleteDrawerHide} onConfirm={endEditRecipes} confirmText={$_("page.home.deleteRecipesConfirm")} />

<style lang="postcss">
    .section {
        width: 100%;
        padding-bottom: var(--space-3xl);

        &.ios {
            padding-bottom: calc(var(--space-3xl) + var(--space-2xs));
        }
    }

    .title {
        margin-top: calc(var(--space-m) + env(safe-area-inset-top));
        margin-bottom: var(--space-m);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .add {
        &.heading {
            align-self: flex-start;
            margin-bottom: var(--space-m);
        }

        &.guide {
            margin-bottom: var(--space-xs);
        }
    }

    .preview {
        width: 100%;
        height: var(--space-3xl);
        margin-top: var(--space-xs);
        display: flex;

        & img {
            height: 100%;
            margin-right: var(--space-2xs);
            border-radius: var(--radius);
        }

        & .info {
            display: flex;
            flex-direction: column;
            min-width: 0;

            & span:nth-child(1) {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            & span:nth-child(2) {
                color: var(--gray-800);
            }
        }

    }

    .languages {
        width: 100%;
        margin-top: var(--space-m);

        & .buttons {
            margin-top: var(--space-xs);
            display: flex;
        }
    }

    .grid {
        margin-top: var(--space-xs);
        display: flex;
        flex-direction: column;
    }

    .no-result {
        margin-top: var(--space-3xl);
        display: flex;
        flex-direction: column;
        align-items: center;

        & img {
            width: 80%;
        }

        & span {
            color: var(--gray-400);
            text-align: center;
        }
    }
</style>
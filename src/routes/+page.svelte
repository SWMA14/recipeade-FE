<script lang="ts">
    import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
    import { _ } from "svelte-i18n";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { savedVideos } from "../store";
    import { PUBLIC_API_ENDPOINT } from "$env/static/public";
    import { authedFetch, getAccessToken } from "$lib/auth";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { DUMMY_VIDEO } from "$lib/dummy";
    import { flyingFade } from "$lib/transition";
    import { type VideoData, convertApiToVideoData } from "$lib/video";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Drawer from "$components/Drawer.svelte";
    import Input from "$components/Input.svelte";
    import Video from "$components/Video.svelte";
    import leading from "./__lowerBarComponents/leading.svelte";
    import main from "./__lowerBarComponents/main.svelte";

    let isEditing = false;
    let isRendered = false;
    let recipeAddDrawerShown = false;
    let recipeAddDrawerShow: () => void;
    let recipeAddDrawerHide: () => void;
    let recipeAddDrawerValue: string;
    let recipeAddAlreadyExists = false;
    let recipeAddInvalid = false;
    let selectedVideos: VideoData[] = [];

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
    });
    $: getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        leading: isEditing ? leading : undefined,
        leadingProps: {
            isEditing,
            onEditCancel: () => isEditing = false
        },
        main,
        mainProps: {
            fitted: !isEditing && !recipeAddDrawerShown,
            isEditing,
            selected: selectedVideos.length,
            onEditExit: endEditRecipes,
            isAddingRecipe: recipeAddDrawerShown,
            onAddRecipe: () => addRecipe(recipeAddDrawerValue)
        }
    });

    onMount(async () => {
        if (await getAccessToken() !== null)
        {
            const pending = $savedVideos.filter(x => x.temporary);
            const result = await authedFetch(`${PUBLIC_API_ENDPOINT}/customize/recipes`)
                .then(response => response.json())
                .catch(() => []);
            const videos = await Promise.all(result
                .map(async (video: any) => convertApiToVideoData(video)));

            $savedVideos = [
                ...pending.filter(x => !videos.map(y => y.youtubeVideoId).includes(x.youtubeVideoId)),
                ...videos
            ];
            console.log($savedVideos)
        }

        isRendered = true;
    });

    async function addRecipe(link: string)
    {
        const result = await authedFetch(`${PUBLIC_API_ENDPOINT}/customize/create_default?sourceLink=${link}`, {
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

        const info = await fetch("/api/videoInfo", {
            method: "POST",
            body: id
        }).then(response => response.json());
        
        $savedVideos = [{
            youtubeVideoId: id,
            youtubeTitle: info["title"],
                youtubeThumbnail: info["thumbnail"],
                youtubeViewCount: info["viewCounts"],
                channel: info["channel"],
                temporary: true
            } as VideoData, ...$savedVideos];
        recipeAddDrawerHide();
    }

    async function endEditRecipes()
    {
        $savedVideos = $savedVideos.filter(x => !selectedVideos.includes(x));
        await Promise.all(selectedVideos
            .map(video => authedFetch(`${PUBLIC_API_ENDPOINT}/customize/${video.id}`, {
                method: "DELETE"
            })));
        selectedVideos = [];
    }

    function onVideoSelect(selected: boolean, video: VideoData)
    {
        if (selected)
            selectedVideos = [...selectedVideos, video];
        else
            selectedVideos = selectedVideos.filter(x => x !== video);
    }
</script>

<div class="section" in:flyingFade={{ delay: 0 }}>
    <div class="title">
        <h2>{@html $_("page.home.greeting")}</h2>
        <div class="buttons">
            <Button kind="transparent" size="small" on:click={() => isEditing = !isEditing}>{$_("page.home.editRecipes")}</Button>
        </div>
    </div>
    {#if !isEditing}
        <Button kind="gray" icon={faPlus} bottomMargin="xs" on:click={recipeAddDrawerShow}>{$_("page.home.addRecipe")}</Button>
    {/if}
    <Drawer bind:shown={recipeAddDrawerShown} bind:show={recipeAddDrawerShow} bind:hide={recipeAddDrawerHide}>
        <h3 class="add title">{$_("page.home.addRecipeModalTitle")}</h3>
        <img src="/images/guide-link-copy.png" alt="링크 복사 방법" />
        <span class="add guide">{$_("page.home.addRecipeModalDescription")}</span>
        <Input placeholder={$_("page.home.addRecipeModalInputPlaceholder")} valueChanged={value => recipeAddDrawerValue = value} />
        {#if recipeAddInvalid}
            <Card backgroundColor="danger-100" topMargin="xs">
                올바르지 않은 링크예요.
            </Card>
        {:else if recipeAddAlreadyExists}
            <Card backgroundColor="danger-100" topMargin="xs">
                이미 저장된 레시피예요.
            </Card>
        {/if}
    </Drawer>
    {#if !isRendered}
        {#each Array(3) as _}
            <Video video={DUMMY_VIDEO} bottomMargin="xs" skeleton />
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

<style lang="postcss">
    .section {
        width: 100%;
        padding-bottom: var(--space-3xl);
    }

    .title {
        margin-top: calc(var(--space-m) + env(safe-area-inset-top));
        margin-bottom: var(--space-m);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .heading {
        margin-bottom: var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .add {
        &.title {
            align-self: flex-start;
        }

        &.guide {
            margin: var(--space-xs) 0;
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
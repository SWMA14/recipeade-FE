<script lang="ts">
    import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { allVideos } from "../store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { flyingFade } from "$lib/transition";
    import { getLikedVideos, clearLikedVideos } from "$lib/video";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Input from "$components/Input.svelte";
    import Modal from "$components/Modal.svelte";
    import Video from "$components/Video.svelte";
    // import upperMain from "./__upperBarComponents/main.svelte";
    import lowerMain from "./__lowerBarComponents/main.svelte";

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        ...x,
        isHidden: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        main: lowerMain
    });

    let updateVidoes = {};
    let recipeAddModalShown = false;
    let recipeAddModalValue: string;

    function confident(target: any | undefined): any
    {
        return target!;
    }
</script>

<div class="section" in:flyingFade={{ delay: 0 }}>
    <div class="title">
        <h2>{@html $_("page.home.greeting")}</h2>
        <div class="buttons">
            <Button kind="transparent" size="small">{$_("page.home.editRecipes")}</Button>
        </div>
    </div>
    <Button kind="gray" icon={faPlus} on:click={() => recipeAddModalShown = true}>{$_("page.home.addRecipe")}</Button>
    <Modal bind:shown={recipeAddModalShown}>
        <Card backgroundColor="white" bottomMargin="2xs">
            <div class="heading">
                <h3>{$_("page.home.addRecipeModalTitle")}</h3>
                <Button kind="transparent" icon={faXmark} fitted on:click={() => recipeAddModalShown = false} />
            </div>
            <img src="/images/guide-link-copy.png" alt="링크 복사 방법" />
            <span class="guide">{$_("page.home.addRecipeModalDescription")}</span>
        </Card>
        <Card backgroundColor="white">
            <Input bottomMargin="xs" placeholder={$_("page.home.addRecipeModalInputPlaceholder")} valueChanged={value => recipeAddModalValue = value} />
            <Button>{$_("page.home.addRecipeModalSubmit")}</Button>
        </Card>
    </Modal>
    {#key updateVidoes}
        {#await getLikedVideos() then likedVideos}
            {@const videos = likedVideos.map(video => confident($allVideos.find(x => x.youtubeVideoId === video.id)))}
            <div class="grid">
                {#if likedVideos.length > 0}
                    {#each videos as video (video.youtubeThumbnail)}
                        <Video {video} verbose bottomMargin="xs" />
                    {/each}
                {:else}
                    <div class="no-result">
                        <img src="/images/no-result.png" alt="저장한 레시피 없음" />
                        <span>{$_("page.home.noAddedRecipes")}</span>
                    </div>
                {/if}
            </div>
        {/await}
    {/key}
</div>

<style lang="postcss">
    .section {
        width: 100%;
        margin-bottom: var(--space-3xl);
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

    .guide {
        margin-top: var(--space-xs);
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
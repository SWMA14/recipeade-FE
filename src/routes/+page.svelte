<script lang="ts">
    import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
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

    async function clearAndUpdateLikedVideos()
    {
        await clearLikedVideos();
        updateVidoes = {};
    }
</script>

<div class="section" in:flyingFade={{ delay: 0 }}>
    <div class="title">
        <h1>산뜻한<br>아침이에요</h1>
        <div class="buttons">
            <Button kind="transparent" size="small">편집</Button>
        </div>
    </div>
    <Button kind="gray" icon={faPlus} on:click={() => recipeAddModalShown = true}>레시피 추가하기</Button>
    <Modal bind:shown={recipeAddModalShown}>
        <Card backgroundColor="white" bottomMargin="2xs">
            <div class="heading">
                <h3>링크로 레시피 추가하기</h3>
                <Button kind="transparent" icon={faXmark} style="width: var(--space-xl);" on:click={() => recipeAddModalShown = false} />
            </div>
            <img src="/images/guide-link-copy.png" alt="링크 복사 방법" />
            <span class="guide">유튜브에서 공유 버튼을 누르면 링크를 복사할 수 있어요.</span>
        </Card>
        <Card backgroundColor="white">
            <Input bottomMargin="xs" placeholder="YouTube 영상 링크" valueChanged={value => recipeAddModalValue = value} />
            <Button>추가하기</Button>
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
                    <img src="/images/no-result.png" alt="저장한 레시피 없음" />
                    <span class="no-result">저장한 레시피가 없어요.</span>
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

        & h1 {
            line-height: 1.2;
        }
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
        margin-top: calc(var(--space-xl) * -1);
        color: var(--gray-400);
        text-align: center;
    }
</style>
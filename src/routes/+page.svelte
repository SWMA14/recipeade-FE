<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { allVideos } from "../store";
    import { goto } from "$app/navigation";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { flyingFade } from "$lib/transition";
    import { getLikedVideos, clearLikedVideos } from "$lib/video";
    import Button from "$components/Button.svelte";
    import Video from "$components/Video.svelte";
    import upperMain from "./__upperBarComponents/main.svelte";
    import lowerMain from "./__lowerBarComponents/main.svelte";

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isBackgroundShown: true,
        main: upperMain
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        main: lowerMain
    });

    let updateVidoes = {};

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
    {#key updateVidoes}
        {#await getLikedVideos() then likedVideos}
            {@const videos = likedVideos.map(video => confident($allVideos.find(x => x.youtubeVideoId === video.id)))}
            <div class="grid">
                <Button on:click={() => goto("/login")}>로그인</Button>
                {#if likedVideos.length > 0}
                    {#each videos as video (video.youtubeThumbnail)}
                        <Video {video} verbose bottomMargin />
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

    .grid {
        margin-top: calc(var(--space-3xl) + env(safe-area-inset-top));
        display: flex;
        flex-direction: column;
    }

    .no-result {
        text-align: center;
        color: var(--gray-400);
    }
</style>
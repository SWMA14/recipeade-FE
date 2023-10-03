<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { allVideos } from "../../store";
    import { goto } from "$app/navigation";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { flyingFade } from "$lib/transition";
    import { getLikedVideos, clearLikedVideos } from "$lib/video";
    import Button from "$components/Button.svelte";
    import Video from "$components/Video.svelte";
    import main from "../__lowerBarComponents/main.svelte";

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        main
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
            <div class="heading">
                <h2>좋아요한 레시피</h2>
                {#if videos.length > 0}
                <span class="erase-all typo-body-2" role="button" tabindex="0" on:click={clearAndUpdateLikedVideos} on:keydown={clearAndUpdateLikedVideos}>
                    모두 지우기
                </span>
                {/if}
            </div>
            <Button on:click={() => goto("/login")}>로그인</Button>
            <div class="grid">
                {#if likedVideos.length > 0}
                    {#each videos as video (video.youtubeThumbnail)}
                        <Video {video} verbose bottomMargin />
                    {/each}
                {:else}
                    <img src="/images/no-result.png" alt="좋아요한 레시피 없음" />
                    <span class="no-result">좋아요한 레시피가 없어요.</span>
                {/if}
            </div>
        {/await}
    {/key}
</div>

<style lang="postcss">
    .section {
        width: 100%;
        margin-top: var(--space-xs);
        margin-bottom: var(--space-3xl);
    }

    .heading {
        margin-bottom: var(--space-2xs);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .erase-all {
        color: var(--gray-400);
    }

    .grid {
        display: flex;
        flex-direction: column;
    }

    .no-result {
        text-align: center;
        color: var(--gray-400);
    }
</style>
<script lang="ts">
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { PUBLIC_API_ENDPOINT } from "$env/static/public";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { getHistory, saveHistory, removeHistory, clearHistory } from "$lib/search";
    import { flyingFade } from "$lib/transition";
    import type { VideoData } from "$lib/video";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import DynamicBar from "$components/DynamicBar.svelte";
    import Video from "$components/Video.svelte";
    import main from "./__upperBarComponents/main.svelte";
    import leading from "./__upperBarComponents/leading.svelte";
    import { analyticsService } from "$lib/analytics";
    import { onMount } from "svelte";

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        ...x,
        isHidden: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        ...x,
        isHidden: true
    });

    let value: string | undefined = undefined;
    const leadingProps = {
        onClick: endActualSearch
    };
    $: mainProps = {
        onValueChanged: updateValue,
        onIconClicked: searchClick,
        value
    };

    let updateSearchHistory = {}; // clearHistory() 호출 시 화면 업데이트를 위해
    let resultShown = false;
    let selectedSort: "latest" | "popular" = "latest";
    let resultVideos: {
        latest: Promise<VideoData[]>;
        popular: Promise<VideoData[]>;
    } | undefined = undefined;

    $: selectedResultVideos = selectedSort === "latest" ? resultVideos?.latest : resultVideos?.popular;
    $: if (value === "")
        resultShown = false;

    function updateValue(inputValue: string)
    {
        value = inputValue;
    }

    function searchClick()
    {
        if (value !== "" && value !== undefined)
        {
            resultShown = true;
            saveHistory(value);

            resultVideos = {
                latest: fetch(`${PUBLIC_API_ENDPOINT}/search/${value}?sort=current`)
                    .then(response => response.json())
                    .catch(() => [])
                    .then(result => result as VideoData[]),
                popular: fetch(`${PUBLIC_API_ENDPOINT}/search/${value}?sort=viewCount`)
                    .then(response => response.json())
                    .catch(() => [])
                    .then(result => result as VideoData[])
            };
        }
    }

    function historyClick(historyWord: string)
    {
        value = historyWord;
        searchClick();
    }

    function endActualSearch()
    {
        resultShown = false;
        value = "";
        resultVideos = undefined;

        analyticsService.logEvent("search_cancel", {
            search_word: value
        });
    }

    async function removeAndUpdateHistory(word: string)
    {
        await removeHistory(word);
        updateSearchHistory = {};
    }

    async function clearAndUpdateHistory()
    {
        await clearHistory();
        updateSearchHistory = {};
    }

    onMount(() => {
        analyticsService.setScreenName("search");
        analyticsService.logEvent("search_view", {
            page_title: "search_view"
        });
    });
</script>

<div class="search-bar">
    <DynamicBar {leading} {leadingProps} {main} {mainProps} />
</div>
<div class="container">
    {#if !resultShown}
        <div class="actual-search" in:flyingFade={{ delay: 0 }}>
            {#key updateSearchHistory}
                {#await getHistory() then histories}
                    <div class="heading">
                        <h2>최근 검색</h2>
                        {#if histories.length > 0}
                            <span class="erase-all typo-body-2" role="button" tabindex="0"
                                on:click={clearAndUpdateHistory} on:keydown={clearAndUpdateHistory}>
                                모두 지우기
                            </span>
                        {/if}
                    </div>
                    <div class="words">
                        {#if histories.length > 0}
                            {#each histories as history}
                                <div role="button" tabindex="0" on:click={() => historyClick(history.word)} on:keydown={() => historyClick(history.word)}>
                                    <Card bottomMargin="xs">
                                        <div class="search-history">
                                            <span>
                                                {history.word}
                                            </span>
                                            <div class="search-history-remove">
                                                <Button kind="transparent" icon={faXmark} on:click={() => removeAndUpdateHistory(history.word)} />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            {/each}
                        {:else}
                            <img src="/images/no-result.png" alt="최근 검색어 없음" />
                            <span class="no-result">최근 검색어가 없어요.</span>
                        {/if}
                    </div>
                {/await}
            {/key}
        </div>
    {:else}
        <div class="result">
            {#key selectedResultVideos}
                {#await selectedResultVideos then videos}
                    {#if videos !== undefined && videos.length > 0}
                        <div class="sort-buttons">
                            <div class="wrapper">
                                <Button kind="badge" size="small" selected={selectedSort === "latest"} on:click={() => selectedSort = "latest"}>
                                    최신순
                                </Button>
                            </div>
                            <div class="wrapper">
                                <Button kind="badge" size="small" selected={selectedSort === "popular"} on:click={() => selectedSort = "popular"}>
                                    조회순
                                </Button>
                            </div>
                        </div>
                    {/if}
                {/await}
                <div class="videos" in:flyingFade|global={{ delay: 0 }}>
                    {#await selectedResultVideos then videos}
                        {#if videos !== undefined && videos.length > 0}
                            {#each videos as video (video.youtubeThumbnail)}
                                <Video {video} verbose bottomMargin="xs" />
                            {/each}
                        {:else}
                            <img src="/images/no-result.png" alt="결과 없음" />
                            <span class="no-result">결과가 없어요.</span>
                        {/if}
                    {:catch}
                        <img src="/images/no-result.png" alt="결과 없음" />
                        <span class="no-result">결과가 없어요.</span>
                    {/await}
                </div>
            {/key}
        </div>
    {/if}
</div>

<style lang="postcss">
    .sort-buttons {
        width: 100%;
        margin-bottom: var(--space-xs);
        padding: var(--space-xs);
        padding-top: 0;
        position: fixed;
        top: calc(var(--space-3xl) + var(--space-xs) + env(safe-area-inset-top));
        left: 0;
        display: flex;
        background-color: var(--white);
        z-index: 999;
    }

    .wrapper {
        margin-right: var(--space-2xs);
    }

    .videos {
        margin-top: var(--space-m);
        display: flex;
        flex-direction: column;
    }

    .search-bar {
        width: 100%;
        padding: var(--space-xs);
        padding-top: calc(var(--space-xs) + env(safe-area-inset-top));
        position: fixed;
        top: 0;
        left: 0;
        background-color: var(--white);
        z-index: 999;
    }

    .container {
        width: 100%;
        padding-top: calc(var(--space-3xl) + var(--space-m));
    }

    .heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .erase-all {
        color: var(--gray-400);
    }

    .words {
        margin-top: var(--space-xs);
        display: flex;
        flex-direction: column;
    }

    .search-history {
        height: var(--space-xl);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .search-history-remove {
        width: var(--space-xl);
    }

    .no-result {
        text-align: center;
        color: var(--gray-400);
    }
</style>
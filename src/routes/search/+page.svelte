<script lang="ts">
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import { getContext, type ComponentType } from "svelte";
    import type { Writable } from "svelte/store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { data } from "$lib/rawData";
    import { getHistory, saveHistory, removeHistory, clearHistory } from "$lib/search";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import DynamicBar from "$components/DynamicBar.svelte";
    import Video from "$components/Video.svelte";
    import lowerMain from "../__lowerBarComponents/main.svelte";
    import upperMain from "./__upperBarComponents/main.svelte";
    import leading from "./__upperBarComponents/leading.svelte";

    let lowerBarContext = getContext<Writable<DynamicBarContext>>("lowerBar");
    $lowerBarContext = {
        main: lowerMain
    };

    let leadingValue: ComponentType | undefined = undefined;
    let leadingProps = {
        onClick: endActualSearch
    };
    // main의 value props를 "" 또는 undefined로 설정해서 입력 초기화
    // 두 개를 번갈아가면서 주지 않으면 최초 1회만 초기화됨
    let inputResettingValue: "" | undefined = undefined;
    $: mainProps = {
        onValueChanged: updateWord,
        onIconClicked: searchClick,
        onClick: startActualSearch,
        value: inputResettingValue
    };

    let word: string;
    let updateSearchHistory = {}; // clearHistory() 호출 시 화면 업데이트를 위해
    let resultShown = false;
    let selectedSort: "latest" | "rate" | "popular" = "latest";
    let videos = data.sort(() => 0.5 - Math.random()).slice(0, 10);

    $: selectedSort, videos = data.sort(() => 0.5 - Math.random()).slice(0, 10);

    function updateWord(value: string)
    {
        word = value;
    }

    function searchClick()
    {
        if (word !== "" && word !== undefined)
        {
            resultShown = true;
            saveHistory(word);
        }
    }

    function startActualSearch()
    {
        inputResettingValue = undefined;
        $lowerBarContext.isHidden = true;
        leadingValue = leading;
    }

    function endActualSearch()
    {
        resultShown = false;
        inputResettingValue = "";
        $lowerBarContext.isHidden = false;
        leadingValue = undefined;
    }

    function clearAndUpdateHistory()
    {
        clearHistory();
        updateSearchHistory = {};
    }
</script>

<div class="search-bar">
    <DynamicBar leading={leadingValue} {leadingProps} main={upperMain} {mainProps} />
</div>
<div class="container">
    {#if !leadingValue}
        <div class="intro">
            <div class="section first">
                <h2>지금 인기 있어요</h2>
                <div class="grid">
                    {#each [...Array(5).keys()] as i}
                        <Card square darkOverlay={0.7} body="감자" />
                    {/each}
                </div>
            </div>
            <div class="section last">
                <h2>추천 검색어</h2>
                <div class="grid">
                    {#each [...Array(5).keys()] as i}
                        <Card square darkOverlay={0.7} body="감자" />
                    {/each}
                </div>
            </div>
        </div>
    {:else if !resultShown}
        <div class="actual-search">
            <div class="heading">
                <h2>최근 검색</h2>
                <span class="erase-all typo-body-2" on:click={clearAndUpdateHistory}>모두 지우기</span>
            </div>
            <div class="words">
                {#key updateSearchHistory}
                    {#await getHistory() then histories}
                        {#each histories as history}
                            <Card bottomMargin>
                                <div style="height: var(--space-xl); display: flex; align-items: center; justify-content: space-between;">
                                    {history.word}
                                    <div style="width: var(--space-xl);">
                                        <Button kind="transparent" icon={faXmark} on:click={() => removeHistory(history.word)} />
                                    </div>
                                </div>
                            </Card>
                        {/each}
                    {/await}
                {/key}
            </div>
        </div>
    {:else}
        <div class="result">
            <div class="sort-buttons">
                <div class="wrapper">
                    <Button size="small" selected={selectedSort === "latest"} on:click={() => selectedSort = "latest"}>
                        최신
                    </Button>
                </div>
                <div class="wrapper">
                    <Button size="small" selected={selectedSort === "rate"} on:click={() => selectedSort = "rate"}>
                        평점
                    </Button>
                </div>
                <div class="wrapper">
                    <Button size="small" selected={selectedSort === "popular"} on:click={() => selectedSort = "popular"}>
                        조회
                    </Button>
                </div>
            </div>
            <div class="videos">
                {#each videos as video (video.thumbnail)}
                    <Video {video} verbose bottomMargin />
                {/each}
            </div>
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
        width: var(--space-xxl);
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

    .intro {
        margin-bottom: calc(var(--space-3xl) + var(--space-xs));
    }

    .section {
        margin-bottom: var(--space-m);
        display: flex;
        flex-direction: column;
        width: 100%;

    }

    .grid {
        margin-top: var(--space-xs);
        display: grid;
        grid-template-columns: auto auto;
        gap: var(--space-xs);
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
</style>
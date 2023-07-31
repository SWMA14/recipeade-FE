<script lang="ts">
    import { page } from "$app/stores";
    import FilterModal from "$components/FilterModal.svelte";
    import { goto } from "$app/navigation";
    
    export let data;

    $: value = $page.url.searchParams.get("query");
    $: sortby = $page.url.searchParams.get("sortby");

    const updateSearchParams = (key: string, value: string) =>{
        const searchParams = new URLSearchParams($page.url.search);
        searchParams.set(key, value);
        goto('/search/result?'+searchParams.toString());
    }

</script>


<div class="search-container">
    <a href="/search">
        <img alt="이전 화면" src="/images/icons/autonext.png" />
    </a>
    <a href="/search/clicked?query={value}" class="input">
        {value} 
    </a>
    <a href="/search/clicked">
        X 
    </a>
</div>

<div class="section">
    {#if data.response_current !== null}
    <FilterModal name="최신" on:click={()=>{updateSearchParams("sortby","current")}}/>
    <FilterModal name="평점" on:click={()=>{updateSearchParams("sortby","rating")}}/>
    <FilterModal name="조회" on:click={()=>{updateSearchParams("sortby","viewCount")}}/>
    {/if}
</div>
<div class="video-section">
    {#if data.response_current === null}
        <h1>검색하신 결과가 없습니다</h1>
    {:else}
        {#if sortby === "current"}
        {:else if sortby === "rating"}
        {:else if sortby === "viewCount"}
        {/if}
    {/if}
   
</div>


<style>
    .video-section {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .input {
        width: 100%;
        font-size: 1rem;
        border: none;
        font-weight: 500;
        background-color: transparent;
    }

    .section {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    
    .search-container > a > img {
        height: 1.25rem;
        width: 1.25rem;
        margin-right: 0.5rem;
        transform: scaleX(-1);
    }

    .search-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        margin-top: 5rem;
        border: 1px solid var(--gray-400);
        border-radius: var(--radius);
        padding : 0.5rem;
        margin-top: env(safe-area-inset-top) + 1rem;
        margin-bottom: 2rem;
        position: relative;
    }
</style>
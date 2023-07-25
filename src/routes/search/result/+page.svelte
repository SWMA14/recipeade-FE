<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import FilterModal from "$components/FilterModal.svelte";
    import { goto } from "$app/navigation";

    let value: any;

    const updateSearchParams = (key: string, value: string) =>{
        const searchParams = new URLSearchParams($page.url.search);
        searchParams.set(key, value);
        goto('/search/result?'+searchParams.toString());
    }


    onMount(()=>{
        value = $page.url.searchParams.get("query")
    })
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
    <FilterModal name="최신" on:click={()=>{updateSearchParams("sortby","최신")}}/>
    <FilterModal name="평점" on:click={()=>{updateSearchParams("sortby","평점")}}/>
    <FilterModal name="조회" on:click={()=>{updateSearchParams("sortby","조회")}}/>
</div>


<style>
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
        margin-top: 1rem;
        margin-bottom: 2rem;
        position: relative;
    }
</style>
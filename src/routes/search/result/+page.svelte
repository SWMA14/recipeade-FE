<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let value: any;

    onMount(()=>{
        value = $page.url.searchParams.get("query")
    })
</script>


<div class="search-container">
    <a href="/search">
        <img alt="이전 화면" src="/images/icons/autonext.png" />
    </a>
    <a href="/search/clicked?query={value}" class="input">
        <h2>{value}</h2> 
    </a>
    <a href="/search/clicked">
        <h2> X </h2>
    </a>
</div>


<style>
    .input {
        width: 100%;
          
    }
    
    .search-container > a > img {
        height: 1.25rem;
        width: 1.25rem;
        margin-right: 0.5rem;
        transform: scaleX(-1);
    }

    .search-container > a > input {
        font-size: 1.25rem;
        width: 100%;
        border: none;
        font-weight: 500;
        background-color: transparent;
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
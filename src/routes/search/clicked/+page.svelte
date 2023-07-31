<script lang="ts">
    import Keyword from "$components/Keyword.svelte";
    import { goto,afterNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { flyingFade,duration } from "$lib/transition";
    import { Preferences } from "@capacitor/preferences";   
    import { onMount } from "svelte";

    const arrayToString = (arr: string[]) : string =>{
        return arr.join("/");
    }

    const stringToArray = (str:string): string[] => {
        return str.split("/");
    }

    let items : string[] = [];

    let input : any;
    let searchValue : any = "";
    let previousPage : string = base;

    const deleteAllKeywords = () => {
        items = [];
        Preferences.set({ 
            key: "keywords", 
            value: arrayToString(items)
        });
    };

    const deleteKeyword = (keywordToRemove: string) => {
        items = items.filter((keyword) => keyword !== keywordToRemove);
        Preferences.set({ 
            key: "keywords", 
            value: arrayToString(items)
        });
    };

    const addKeywords = async () => {
        if(searchValue.length > 0 && !items.includes(searchValue)){
            if(items.length >= 5)
                items.shift();
            items.push(searchValue);            
        }

        await Preferences.set({ 
            key: "keywords", 
            value: arrayToString(items)
        });
    }

    const getKeywords =async () => {
        const {value} = await Preferences.get({key: 'keywords'});
        if(value){
            items = stringToArray(value);
        }
    }

    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });

    const handleSubmit = (event: any) => {
        event.preventDefault();
        addKeywords();

        const searchParmas = new URLSearchParams($page.url.searchParams);
        searchParmas.set("query",searchValue);
        goto(`/search/result?${searchParmas.toString()}&sortby=current`);
    }

    onMount(()=>{   
        getKeywords();
        input.focus();
        if($page.url.searchParams.get("query"))
            searchValue = $page.url.searchParams.get("query");
    });
</script>

<div class="search-container">
    <a href="/search">
        <img alt="이전 화면" src="/images/icons/autonext.png" />
    </a>
    <form on:submit={handleSubmit}>
        <input type="search" bind:value={searchValue} bind:this={input} placeholder="어떤 요리를 해 볼까요?">
        <button type="submit"></button>
    </form>
</div>

<div class="section">
    <div class="section-top">
        <h2>최근 검색</h2>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span on:click={deleteAllKeywords}>모두 지우기</span>
    </div>
    <div>
        {#each items as item (item)}
            <Keyword name={item} on:remove={()=>{deleteKeyword(item)}}/>
        {/each}
    </div>
</div>

<!-- 
<div class="body">
    {#if items.length > 0}
        <div class="section" out:flyingFade={{duration: 500 }}>
            <div class="topic">
                <h2>최근 검색어</h2>
                <div class="delete" on:click={deleteAllKeywords}>
                    <img alt="이전 화면" src="/images/icons/autonext.png" />
                    <span>모두 지우기</span>
                </div>
            </div>
            <div class="keywords">
                {#each items as item (item)}
                    <Keyword name={item} on:remove={()=>{deleteKeyword(item)}}/>
                {/each}
            </div>
        </div>
    {/if}
    <div class="section top">
        <div class="topic">
            <h2>실시간 인기 검색어</h2>
            <div class="update-time">
                <span>22:54 업데이트</span>
            </div>
        </div>
        <div class="keywords">
            {#each items as item (item.id)}
                <Keyword name={item.name} isDelete={false} on:remove={removeItem} />
            {/each}
        </div>
    </div>
</div> -->


<style>
    .section-top > h2{
        color: var(--gray-900);
    }

    .section-top > span{
        font-size: var(--body-2);
        color: #cbd5e0;
    }

    .section-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .section {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .search-container > a > img {
        height: 1.25rem;
        width: 1.25rem;
        margin-right: 0.5rem;
        transform: scaleX(-1);
    }

    .search-container > form {
        width: 100%;
    }

    .search-container > form > button {
        display: none;
    }

    .search-container > form > input {
        font-size: 1rem;
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
        margin-top: env(safe-area-inset-top) + 1rem;
        margin-bottom: 2rem;
        position: relative;
    }

    .search-container  input:focus {
        outline: none;
    }

    /* .search-container:focus-within::before{
        display: block;
        content: "";
        position:absolute;
        top: -1px;
        bottom: -1px;
        left: -1px;
        right: -1px;
        border: 2px solid orange;
        border-radius: var(--radius);
    } */




    /* .body {
        position: relative;
        width: 100%;
    }

    .keywords {
        flex: 0 0 auto;
        padding-left: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: left;
        flex-wrap: wrap;
    }


    .delete:hover {
        cursor: pointer;
    }

    .delete > img {
        width: 1rem;
        height: 1rem;
        margin-right: 0.25rem;
    }

    .update-time,
    .delete {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: var(--c-foreground-gray);
    }

    .topic {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        margin-top: 5rem;
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
    }


    .header > button > img,
    .header > a {
        transform: scaleX(-1);
        width: 7.5%;
        cursor: pointer;
    }

    .search {
        width: 65%;
        border-radius: var(--radius);
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        background-color: var(--c-foreground-gray);
    }

    ::placeholder {
        color: gray;
        font-size: 1rem;
    } */
</style>

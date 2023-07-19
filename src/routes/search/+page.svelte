<script lang="ts">
    import Keyword from "$components/Keyword.svelte";
    import { goto,afterNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { flyingFade,duration } from "$lib/transition";

    let searchValue = "";
    let previousPage : string = base;
    let items = [
        { id: 1, name: "항목 1" },
        { id: 2, name: "항목 2" },
        { id: 3, name: "항목 3" },
    ];

    function removeItem(event: any) {
        const itemToRemove = event.detail;
        items = items.filter((item) => item.name !== itemToRemove);
    }

    function removeAllItems() {
        items = [];
    }

    function changeSerachValue(event: any) {
        searchValue = event.target.value;
    }


    afterNavigate(({from}) => {
        previousPage = from?.url.pathname || previousPage;
    });

</script>

<div class="header">
    <a href={previousPage}>
        <img alt="이전 화면" src="/images/icons/autonext.png"/>
    </a>
    <input class="search" type="search" placeholder="어떤 요리를 찾아 볼까요"  value={searchValue} on:change={changeSerachValue}/>        
    <img alt="이전 화면" src="/images/icons/autonext.png" />
</div>


<div class="body">
    {#if items.length > 0}
        <div class="section" out:flyingFade={{duration: 500 }}>
            <div class="topic">
                <h2>최근 검색어</h2>
                <div class="delete">
                    <img alt="이전 화면" src="/images/icons/autonext.png" />
                    <!-- A11y: visible, non-interactive elements with an on:click event must be accompanied by an on:keydown, on:keyup, or on:keypress event. -->
                    <span on:click={removeAllItems} on:keydown={removeAllItems}>모두 지우기</span>
                </div>
            </div>
            <div class="keywords">
                {#each items as item (item.id)}
                    <Keyword name={item.name} isDelete={true} on:remove={removeItem} />
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
</div>



<style>
    .body {
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

    .section {
        display: flex;
        flex-direction: column;
        width: 100%;
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


    .header > img,
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
    }
</style>

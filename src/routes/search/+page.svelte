<script lang="ts">
    import SearchModal from "$components/SearchModal.svelte";
</script>


<a href="/search/clicked">
    <div class="search-container">
        <img alt="이전 화면" src="/images/icons/autonext.png" />
        <input type="search" placeholder="어떤 요리를 해 볼까요?">
    </div>
</a>
    
<div class="section">
    <h2>지금 인기 있어요</h2>
    <div class="category">
        <SearchModal name="감자"/>
        <SearchModal name="오뎅"/>
    </div>
</div>

<style>
    a{
        width: 100%;
    }
    .category {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .section {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .search-container > img {
        height: 1.25rem;
        width: 1.25rem;   
        margin-right: 0.5rem;
    }

    .search-container > input {
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
        border: 1px solid #cbd5e0;
        border-radius: var(--radius);
        padding : 0.5rem;
        margin-top: 1rem;
        margin-bottom: 2rem;
        position: relative;
    }
</style>
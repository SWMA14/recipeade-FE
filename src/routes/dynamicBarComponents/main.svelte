<script>
    import Card from "$components/Card.svelte";
</script>

<Card backgroundColor="primary-500">
    <div class="content">
        <a href="/">홈</a>
        <a href="/search">검색</a>
    </div>
</Card>

<style>
    .content {
        display: flex;
        justify-content: space-between;
    }
</style>
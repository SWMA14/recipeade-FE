<script lang="ts">
    export let nickname: string;
    export let image: string | undefined = undefined;
    export let content: string;
    export let rightMargin = false;
</script>

<div class="container" class:right-margin={rightMargin}>
    <div class="content">
        <p>{nickname}</p>
        <span>{content}</span>
    </div>
</div>

<style>
    .container {
        display: flex;
        min-width: 10rem;
        scroll-snap-align: start;
        scroll-snap-stop: always
    }

    .right-margin {
        margin-right: 1rem
    }

    .content {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .content p {
        font-weight: 700;
    }
</style>
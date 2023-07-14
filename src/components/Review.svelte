<script lang="ts">
    export let nickname: string;
    export let image: string | undefined = undefined;
    export let content: string;
    export let rightMargin = false;
</script>

<div class="container" class:right-margin={rightMargin}>
    {#if image !== undefined}
        <div class="image">
            <img src={image} alt="후기 이미지" />
        </div>
    {/if}
    <div class="content">
        <p>{nickname}</p>
        <span>{content}</span>
    </div>
</div>

<style>
    .container {
        display: flex;
        min-width: 15rem;
        scroll-snap-align: start;
        scroll-snap-stop: always
    }

    .right-margin {
        margin-right: 1rem;
    }

    .image {
        max-width: 5rem;
        max-height: 5rem;
        margin-right: 0.5rem;
    }

    .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--radius);
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
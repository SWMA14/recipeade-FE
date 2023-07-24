<script lang="ts">
    export let name: string;
</script>

<div class="container">
    <div class="image-thumbanil">
        <div>
            <img src="https://img.youtube.com/vi/c5it8ttzJuY/sddefault.jpg" alt="요리사진"/>
        </div>
    </div>
    <div class="info">
        {name}
    </div>
</div>


<style>
    .info {
        padding-left: 0.5rem;
        font-size: 1.25rem;
        font-weight: 500;
        color: black;
    }

    .image-thumbanil > div {
        position: absolute;
        top: -16.75%;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .image-thumbanil {
        width: 100%;
        padding-bottom: 56%;
        object-fit: cover;
        position: relative;
        border-radius: var(--radius);
        overflow: hidden;
    }

    .container {
        margin: 1rem 1rem 0rem 0rem;
        width: calc(50% - 1rem);
        position: relative;
        display: flex;
        flex-direction: column;
        background-color: var(--c-background-lightdark);
        border-radius: var(--radius);
        overflow: hidden;
        aspect-ratio: 1 / 1;
    }
</style>
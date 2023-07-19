<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    
    export let name: string;
    export let isDelete: boolean;
    const dispatch = createEventDispatcher();

    const handleDelete = (event : any) => {
        event.stopPropagation();
        dispatch('remove',name);
    };
</script>

<span class="container" transition:fade>
    {name}
    {#if isDelete}
        <span on:click={handleDelete}>
            X 
        </span>
    {/if}
</span>

<style>
    .container > span:hover{
        cursor: pointer;
    }

    .container > span {
        margin-left: 0.5rem;
    }

    .container {
        min-width: 15%;
        max-width: fit-content;
        margin: 0.5rem;
        padding: 0.15rem 0.55rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        border-radius: 20px;
        border: 1px solid var(--c-foreground-gray);
        background-color: var(--c-foreground-gray);
        color: gray;
    }
</style>
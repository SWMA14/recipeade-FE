<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    
    export let name: string;
    const dispatch = createEventDispatcher();

    const handleDelete = (event : any) => {
        event.stopPropagation();
        dispatch('remove',name);
    };
</script>

<span class="container" transition:fade>
    <a href="/">
        {name}
    </a>
    <span on:click={handleDelete}>
        X 
    </span>
</span>

<style>
    .container > a {
        width: 100%;
    }

    .container > span {
        color: var(--gray-400);
    }

    .container {
        width: 100%;
        background-color: var(--gray-100);
        padding: 0.5rem 1rem;
        border-radius: var(--radius);
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        color: var(--gray-900);
        margin-top: 1rem;
    }

</style>
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
    {name}
    <span on:click={handleDelete}>
            X 
    </span>
</span>

<style>
    .container > span {
        color: #cbd5e0;
    }

    .container {
        width: 100%;
        background-color: #f7fafc;
        padding: 0.5rem 1rem;
        border-radius: var(--radius);
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        color: #1a202c;
        margin-top: 1rem;
    }

</style>
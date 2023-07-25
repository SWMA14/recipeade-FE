<script lang="ts">
    import { page } from "$app/stores";
    import { createEventDispatcher } from "svelte";

    $: sortby = $page.url.searchParams.get("sortby");

    export let name: string;

    $: isClicked = name === sortby ? true : false;
    const dispatch = createEventDispatcher();

    const handleClick = (event : any) => {
        if(!isClicked){
            dispatch('click',event);

            const target = event.target;

            const state = target.getAttribute('aria-checked');

            isClicked = state === 'true' ? false : true;
        }
        
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span 
    class={isClicked ? "clicked" : "filter"} 
    on:click={handleClick}
    aria-checked={isClicked}
>
    {name}
</span>

<style>
    .clicked {
        background-color: var(--primary-500);
        color: white;
        margin: 0.15rem;
        padding: 0.15rem 0.55rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        border-radius: 20px;
        border: 1px solid var(--primary-500);
    }

    .filter {
        margin: 0.15rem;
        padding: 0.15rem 0.55rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        border-radius: 20px;
        border: 1px solid var(--gray-400);
        color: var(--gray-400);
    }
</style>
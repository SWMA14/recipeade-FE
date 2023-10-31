<script lang="ts">
    import Fa from "svelte-fa";
    import { faBookmark, faFire, faGear } from "@fortawesome/free-solid-svg-icons";
    import { page } from "$app/stores";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";

    export let isEditing: boolean;
    export let selected = 0;
    export let onEditExit: () => void;
    export let isAddingRecipe: boolean;
    export let onAddRecipe: () => void;

    let tabs = [
        {
            href: "/",
            icon: faBookmark
        },
        {
            href: "/discover",
            icon: faFire
        },
        {
            href: "/settings",
            icon: faGear
        }
    ];
</script>

{#if isEditing}
    {#if selected > 0}
        <Button on:click={onEditExit}>레시피 {selected}개 삭제하기</Button>
    {:else}
        <Button kind="primary-light">레시피 0개 삭제하기</Button>
    {/if}
{:else if isAddingRecipe}
    <Button on:click={onAddRecipe}>추가하기</Button>
{:else}
    <Card backgroundColor="primary-500">
        <div class="content">
            {#each tabs as { href, icon } (href)}
                <a {href} class:selected={href === $page.route.id}><Fa {icon} /></a>
            {/each}
        </div>
    </Card>
{/if}

<style>
    .content {
        display: flex;
        justify-content: space-between;
        color: var(--primary-400);
    }

    .content a {
        transition: all 0.25s;
    }

    .selected {
        color: var(--white);
    }
</style>
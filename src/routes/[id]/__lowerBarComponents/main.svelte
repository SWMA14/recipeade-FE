<script lang="ts">
    import { _ } from "svelte-i18n";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import Button from "$components/Button.svelte";

    export let isEditing: boolean;
    export let onEditExit: () => void;
</script>

{#if isEditing}
    <Button on:click={onEditExit}>{$_("page.recipe.saveRecipe")}</Button>
{:else}
    <Button on:click={() => goto(`/${$page.params.id}/cook`)}>{$_("page.recipe.startCooking")}</Button>
{/if}
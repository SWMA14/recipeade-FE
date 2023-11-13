<script lang="ts">
    import { _ } from "svelte-i18n";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import Button from "$components/Button.svelte";
</script>

<Button on:click={() => goto(`/${$page.params.id}`, { replaceState: true })}>{$_("page.recipe.goBack")}</Button>
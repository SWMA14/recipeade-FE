<script lang="ts">
    import { _ } from "svelte-i18n";
    import { goto } from "$app/navigation";
    import Button from "$components/Button.svelte";

    export let selected = 0;
    export let threshold = 0;
</script>

{#if selected < threshold}
    <Button kind="primary-light">{$_("page.login.surveySelectMore", { values: { count: threshold - selected } })}</Button>
{:else}
    <Button on:click={() => goto("/")}>{$_("page.login.surveyStart")}</Button>
{/if}
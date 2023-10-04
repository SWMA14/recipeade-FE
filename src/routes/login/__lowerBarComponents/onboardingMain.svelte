<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "$components/Button.svelte";

    export let onClick: () => void;
</script>

<Button on:click={onClick}>{$_("page.login.onboardingOkay")}</Button>
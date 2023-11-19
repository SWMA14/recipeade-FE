<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "$components/Button.svelte";

    export let isFinished: boolean;
    export let onClick: () => void;
</script>

<Button on:click={onClick}>{isFinished ? $_("page.login.onboardingOkay") : $_("page.login.onboardingNext")}</Button>
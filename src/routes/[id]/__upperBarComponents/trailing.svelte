<script lang="ts">
    import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
    import Button from "$components/Button.svelte";

    export let onClick: () => void;
</script>

<Button kind="white" noHover icon={faShareNodes} on:click={onClick} />
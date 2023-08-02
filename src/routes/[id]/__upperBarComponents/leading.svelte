<script lang="ts">
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
    import Button from "$components/Button.svelte";

    export let onClick: () => void;
</script>

<Button kind="white" noHover icon={faArrowLeft} on:click={onClick} />
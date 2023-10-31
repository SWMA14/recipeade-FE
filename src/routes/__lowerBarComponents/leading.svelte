<script lang="ts">
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import Button from "$components/Button.svelte";

    export let onEditCancel: () => void;
</script>

<Button kind="black" noHover icon={faXmark} on:click={onEditCancel} />
<script lang="ts">
    import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
    import Button from "$components/Button.svelte";

    export let isEditing: boolean;
    export let onClick: () => void;
</script>

<Button kind="primary-light" noHover icon={faPenToSquare} on:click={onClick} />
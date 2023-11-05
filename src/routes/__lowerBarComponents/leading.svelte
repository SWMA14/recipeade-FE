<script lang="ts">
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import Button from "$components/Button.svelte";

    export let isEditing: boolean;
    export let onEditCancel: () => void;
    export let onAddCancel: () => void;
</script>

<Button kind="black" noHover icon={faXmark} on:click={isEditing ? onEditCancel : onAddCancel} />
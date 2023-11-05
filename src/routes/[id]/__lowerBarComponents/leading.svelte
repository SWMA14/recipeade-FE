<script lang="ts">
    import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
    import Button from "$components/Button.svelte";

    export let isEditing: boolean;
    export let onEditStart: () => void;
    export let onEditCancel: () => void;
</script>

<Button kind="black" noHover icon={isEditing ? faXmark : faPen} on:click={isEditing ? onEditCancel : onEditStart} />
<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import Button from "$components/Button.svelte";

    export let isEditing: boolean;
    export let onEditExit: () => void;
</script>

{#if isEditing}
    <Button on:click={onEditExit}>저장하기</Button>
{:else}
    <Button on:click={() => goto(`/${$page.params.id}/cook`)}>요리 시작하기</Button>
{/if}
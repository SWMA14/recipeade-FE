<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$components/Button.svelte";

    export let selected = 0;
    export let threshold = 0;
</script>

{#if selected < threshold}
    <Button kind="primary-light">레시피 {threshold - selected}개를 더 선택해 주세요</Button>
{:else}
    <Button on:click={() => goto("/")}>시작하기</Button>
{/if}
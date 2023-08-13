<script>
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import Button from "$components/Button.svelte";
</script>

<Button on:click={() => goto(`/${$page.params.id}/cook`)}>요리 시작하기</Button>
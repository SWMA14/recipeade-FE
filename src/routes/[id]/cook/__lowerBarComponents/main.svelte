<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import Button from "$components/Button.svelte";
</script>

<Button on:click={() => goto(`/${$page.params.id}`)}>돌아가기</Button>
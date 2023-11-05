<script lang="ts">
    import Button from "$components/Button.svelte";

    export let text: string;
    export let hide: () => void;
</script>

<Button kind="danger" on:click={hide}>{text}</Button>
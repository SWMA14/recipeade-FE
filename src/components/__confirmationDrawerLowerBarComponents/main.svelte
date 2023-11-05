<script lang="ts">
    import Button from "$components/Button.svelte";

    export let text: string;
    export let hide: () => void;
    export let onConfirm: () => void;
</script>

<Button kind="danger" on:click={() => {
        hide();
        onConfirm();
    }}>{text}</Button>
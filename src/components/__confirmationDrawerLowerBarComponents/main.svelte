<script lang="ts">
    import Button from "$components/Button.svelte";

    export let text: string;
    export let hide: () => void;
    export let onHide: (() => void) | undefined = undefined;
    export let onConfirm: () => void;
</script>

<Button kind="danger" on:click={() => {
        hide();
        onHide?.();
        onConfirm();
    }}>{text}</Button>
<script lang="ts">
    import Button from "$components/Button.svelte";

    export let onClick: () => void;
</script>

<Button on:click={onClick}>알겠어요</Button>
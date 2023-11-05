<script lang="ts">
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import Button from "$components/Button.svelte";
    import Drawer from "$components/Drawer.svelte";
    import main from "./__confirmationDrawerLowerBarComponents/main.svelte";

    export let heading: string | undefined = undefined;
    export let text: string | undefined = undefined;
    export let shown = false;
    export let show: (() => void) | undefined = undefined;
    export let hide: (() => void) | undefined = undefined;
    export let confirmText = $_("page.confirm");
    export let onConfirm: () => void;
    export let onCancel: (() => void) | undefined = undefined;

    const lowerBar = getContext<Writable<DynamicBarContext>>("lowerBar");

    let cached: DynamicBarContext = {};

    function updateLowerBar()
    {
        cached = $lowerBar;
        lowerBar.update(x => x = {
            main,
            mainProps: {
                text: confirmText,
                hide,
                onConfirm
            }
        });
    }

    function cancelAndrevertDynamicBar()
    {
        onCancel?.();
        lowerBar.update(x => x = cached);
    }
</script>

<Drawer {heading} bind:shown bind:show onShow={updateLowerBar} bind:hide onHide={cancelAndrevertDynamicBar}>
    {#if text}
        <span class="text">{text}</span>
    {/if}
    <Button kind="gray" on:click={() => {
            hide?.();
            cancelAndrevertDynamicBar();
        }}>{$_("page.cancel")}</Button>
</Drawer>

<style>
    .text {
        align-self: flex-start;
        margin-bottom: var(--space-xs);
    }
</style>
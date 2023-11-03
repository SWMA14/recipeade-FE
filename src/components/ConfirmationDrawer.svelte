<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import Button from "$components/Button.svelte";
    import Drawer from "$components/Drawer.svelte";
    import main from "./__confirmationDrawerLowerBarComponents/main.svelte";

    export let shown = false;
    export let show: (() => void) | undefined = undefined;
    export let hide: (() => void) | undefined = undefined;
    export let confirmText = "확인";
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

<Drawer top="calc(100vh - var(--space-3xl) * 2 - var(--space-2xs))" bind:shown bind:show onShow={updateLowerBar} bind:hide onHide={cancelAndrevertDynamicBar}>
    <Button kind="gray" on:click={() => {
            hide?.();
            cancelAndrevertDynamicBar();
        }}>취소</Button>
</Drawer>
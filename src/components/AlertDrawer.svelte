<script lang="ts">
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import Drawer from "$components/Drawer.svelte";
    import main from "./__confirmationDrawerLowerBarComponents/main.svelte";

    export let heading: string;
    export let text: string;
    export let shown = false;
    export let show: (() => void) | undefined = undefined;
    export let hide: (() => void) | undefined = undefined;
    export let confirmText = $_("page.confirm");

    const lowerBar = getContext<Writable<DynamicBarContext>>("lowerBar");

    let cached: DynamicBarContext = {};

    function updateLowerBar()
    {
        cached = $lowerBar;
        lowerBar.update(x => x = {
            main,
            mainProps: {
                text: confirmText,
                hide
            }
        });
    }

    function revert()
    {
        lowerBar.update(x => x = cached);
    }
</script>

<Drawer {heading} bind:shown bind:show onShow={updateLowerBar} bind:hide onHide={revert}>
    <span style="align-self: flex-start;">{text}</span>
</Drawer>
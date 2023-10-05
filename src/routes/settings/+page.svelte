<script lang="ts">
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import Button from "$components/Button.svelte";
    import upperMain from "./__upperBarComponents/main.svelte";
    import lowerMain from "../__lowerBarComponents/main.svelte";

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isBackgroundShown: true,
        main: upperMain
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        main: lowerMain
    });
</script>

<div>
    <Button kind="gray" bottomMargin="2xs">{$_("page.settings.signOut")}</Button>
    <Button kind="danger">{$_("page.settings.deleteAccount")}</Button>
</div>

<style>
    div {
        width: 100%;
        margin-top: calc(var(--space-3xl) + env(safe-area-inset-top));
    }
</style>
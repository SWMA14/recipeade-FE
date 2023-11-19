<script lang="ts">
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { goto } from "$app/navigation";
    import { removeAuthTokens } from "$lib/auth";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import Button from "$components/Button.svelte";
    import lowerMain from "../__lowerBarComponents/main.svelte";

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        main: lowerMain,
        isFitted: true
    });

    async function signOut()
    {
        await removeAuthTokens()
            .then(() => goto("/login"));
    }
</script>

<div>
    <h2>설정</h2>
    <Button kind="gray" bottomMargin="xs" on:click={signOut}>{$_("page.settings.signOut")}</Button>
    <Button kind="danger" on:click={signOut}>{$_("page.settings.deleteAccount")}</Button>
</div>

<style>
    div {
        width: 100%;
        margin-top: calc(var(--space-m) + env(safe-area-inset-top));
    }

    h2 {
        margin-bottom: var(--space-m);
    }
</style>
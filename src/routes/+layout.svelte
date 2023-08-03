<script lang="ts">
    import "../app.css";
    import { Device } from "@capacitor/device";
    import { App } from "@capacitor/app";
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    import { stacks } from "../store";
    import { page } from "$app/stores";
    import { duration, flyingFade } from "$lib/transition";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import DynamicBar from "$components/DynamicBar.svelte";

    $: console.log($page.route.id);

    let device: "ios" | "android" | "web";
    let upperBarContext = writable({
        isHidden: true
    } as DynamicBarContext);
    let lowerBarContext = writable({} as DynamicBarContext);

    Device.getInfo()
        .then(x => device = x.platform)
        .catch(() => device = "web");
    setContext("upperBar", upperBarContext);
    setContext("lowerBar", lowerBarContext);

    onMount(() => {
        App.addListener("backButton", () => {
            const length = $stacks.length;

            if (length > 0)
                $stacks[length - 1]();
            else if ($page.route.id !== "/")
                history.back();
        });
    });
</script>

<main>
    <slot />
</main>
{#if !$upperBarContext.isHidden}
    <div class="navigation title" class:background={$upperBarContext.isBackgroundShown}
        transition:flyingFade={{ y: -20, duration: duration * 2 }}>
        <DynamicBar leading={$upperBarContext.leading} leadingProps={$upperBarContext.leadingProps}
            main={$upperBarContext.main} mainProps={$upperBarContext.mainProps}
            trailing={$upperBarContext.trailing} trailingProps={$upperBarContext.trailingProps} />
    </div>
{/if}
{#if !$lowerBarContext.isHidden}
    <div class="navigation bottom" class:ios={device === "ios"} transition:flyingFade={{ duration: duration * 2 }}>
        <DynamicBar leading={$lowerBarContext.leading} leadingProps={$lowerBarContext.leadingProps}
            main={$lowerBarContext.main} mainProps={$lowerBarContext.mainProps}
            trailing={$lowerBarContext.trailing} trailingProps={$lowerBarContext.trailingProps} />
    </div>
    <div class="overlay" class:ios={device === "ios"} />
{/if}

<style lang="postcss">
    main {
        width: 100%;
        max-width: var(--max-width);
        margin: 0 auto;
        margin-top: env(safe-area-inset-top);
        padding: 0 var(--space-xs);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media only screen and (min-width: 64rem) {
        main {
            padding: 0;
        }
    }

    .navigation {
        position: fixed;
        z-index: 1000;

        &.title {
            width: 100%;
            padding: var(--space-3xs) var(--space-xs);
            padding-top: calc(var(--space-3xs) + env(safe-area-inset-top));
            top: 0;
            left: 0;

            &.background {
                background-color: var(--white);
            }
        }

        &.bottom {
            width: calc(100% - var(--space-xs) * 2);
            bottom: var(--space-xs);
            left: var(--space-xs);

            &.ios {
                bottom: var(--space-s);
            }
        }
    }

    .overlay {
        width: 100%;
        height: calc(var(--space-xl) * 2);
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 999;
        background-image: linear-gradient(to top, var(--white) 15%, transparent);

        &.ios {
            height: calc(var(--space-xl) * 2 + var(--space-s));
        }
    }
</style>
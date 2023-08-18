<script lang="ts">
    import { duration, growingFade } from "$lib/transition";
    import { sineIn, sineOut } from "svelte/easing";

    export let leading: any = undefined;
    export let leadingWidth = "var(--space-2xl)";
    export let leadingProps: object = {};
    export let main: any = undefined;
    export let mainProps: object = {};
    export let trailing: any = undefined;
    export let trailingWidth = "var(--space-2xl)";
    export let trailingProps: object = {};
</script>

<div class="container">
    {#if leading}
        <div class="leading" in:growingFade={{ width: leadingWidth, easing: sineOut, rightMargin: "var(--space-xs)", duration: duration * 2 }}
            out:growingFade={{ width: leadingWidth, rightMargin: "var(--space-xs)", easing: sineIn, duration: duration * 2 }}>
            <svelte:component this={leading} {...leadingProps} />
        </div>
    {/if}
    <div class="main">
        <svelte:component this={main} {...mainProps} />
    </div>
    {#if trailing}
        <div class="trailing" in:growingFade={{ width: trailingWidth, easing: sineOut, leftMargin: "var(--space-xs)", duration: duration * 2 }}
            out:growingFade={{ width: trailingWidth, leftMargin: "var(--space-xs)", easing: sineIn, duration: duration * 2 }}>
            <svelte:component this={trailing} {...trailingProps} />
        </div>
    {/if}
</div>

<style>
    .container {
        height: var(--space-xl);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .container div {
        height: 100%;
    }

    .leading {
        width: var(--space-2xl);
        margin-right: var(--space-xs);
        display: inline-block;
        overflow: hidden;
    }

    .main {
        width: 100%;
        transition: width 1s;
    }

    .trailing {
        width: var(--space-2xl);
        margin-left: var(--space-xs);
        display: inline-block;
        overflow: hidden;
    }
</style>
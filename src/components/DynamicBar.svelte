<script lang="ts">
    import { duration, growingFade } from "$lib/transition";
    import { quartIn, backOut } from "svelte/easing";

    export let leading: any = undefined;
    export let leadingWidth = "var(--space-xxl)";
    export let main: any = undefined;
    export let trailing: any = undefined;
    export let trailingWidth = "var(--space-xxl)";
</script>

<div class="container">
    {#if leading}
        <div class="leading" in:growingFade={{ width: leadingWidth, easing: backOut, rightMargin: "var(--space-xs)", duration: duration * 3 }}
            out:growingFade={{ width: leadingWidth, rightMargin: "var(--space-xs)", easing: quartIn, duration: duration * 3 }}>
            <svelte:component this={leading} />
        </div>
    {/if}
    <div class="main">
        <svelte:component this={main} />
    </div>
    {#if trailing}
        <div class="trailing" in:growingFade={{ width: trailingWidth, easing: backOut, leftMargin: "var(--space-xs)", duration: duration * 3 }}
            out:growingFade={{ width: trailingWidth, leftMargin: "var(--space-xs)", easing: quartIn, duration: duration * 3 }}>
            <svelte:component this={trailing} />
        </div>
    {/if}
</div>

<style>
    .container {
        height: var(--space-xl);
        display: flex;
    }

    .container div {
        height: 100%;
    }

    .leading {
        width: var(--space-xxl);
        margin-right: var(--space-xs);
        display: inline-block;
        overflow: hidden;
    }

    .main {
        width: 100%;
        transition: width 1s;
    }

    .trailing {
        width: var(--space-xxl);
        margin-left: var(--space-xs);
        display: inline-block;
        overflow: hidden;
    }
</style>
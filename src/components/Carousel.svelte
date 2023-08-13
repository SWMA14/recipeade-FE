<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { duration, flyingFade } from "$lib/transition";
    import Stack from "$components/Stack.svelte";
    import main from "./__carouselUpperBarComponents/main.svelte";
    import leading from "./__carouselUpperBarComponents/leading.svelte";

    export let leftOverflow = false;
    export let rightOverflow = false;
    export let heading: string | undefined = undefined;
    export let body: string | undefined = undefined;
    export let canShowAll = false;

    const dynamicBarContext: DynamicBarContext = {
        main,
        mainProps: {
            heading
        },
        leading,
        leadingProps: {
            onClick: hide
        }
    };

    let shown = false;

    function show()
    {
        shown = true;
    }

    function hide()
    {
        shown = false;
    }
</script>

<div class="container">
    {#if heading || body}
        <div class="title">
            <div class="heading">
                {#if heading}
                    <h2>{heading}</h2>
                {/if}
                {#if canShowAll}
                    <span class="show-all typo-body-2" role="button" tabindex="0" on:click={show} on:keydown={show}>
                        모두 보기
                    </span>
                {/if}
            </div>
            {#if body}
                <span>{body}</span>
            {/if}
        </div>
    {/if}
    <div class="scroll" class:left-overflow={leftOverflow} class:right-overflow={rightOverflow}>
        <slot />
    </div>
</div>
{#if shown}
    <Stack {dynamicBarContext} onBack={hide}>
        <div class="grid">
            <slot name="grid" />
        </div>
    </Stack>
{/if}

<style>
    .container {
        width: auto;
    }

    .title {
        margin-bottom: var(--space-2xs);
        display: flex;
        flex-direction: column;
    }

    .heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .show-all {
        color: var(--gray-400);
    }

    .scroll {
        display: flex;
        scroll-snap-type: x mandatory;
        scroll-padding-left: var(--space-xs);
        -webkit-overflow-scrolling: touch;
        overflow-x: scroll;
    }

    .scroll::-webkit-scrollbar {
        display: none;
    }

    .grid {
        margin-top: calc(var(--space-3xl) + env(safe-area-inset-top));
        padding: 0 var(--space-xs);
        display: flex;
        flex-direction: column;
    }

    .left-overflow {
        margin-left: calc(var(--space-xs) * -1);
    }

    .right-overflow {
        margin-right: calc(var(--space-xs) * -1);
    }
</style>
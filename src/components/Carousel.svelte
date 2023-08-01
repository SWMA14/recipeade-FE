<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { duration, flyingFade } from "$lib/transition";
    import main from "./__carouselUpperBarComponents/main.svelte";
    import leading from "./__carouselUpperBarComponents/leading.svelte";

    export let leftOverflow = false;
    export let rightOverflow = false;
    export let heading: string | undefined = undefined;
    export let body: string | undefined = undefined;
    export let canShowAll = false;

    let shown = false;
    let upperBarContext = getContext<Writable<DynamicBarContext>>("upperBar");
    let cachedUpperBarContext = $upperBarContext;
    let lowerBarContext = getContext<Writable<DynamicBarContext>>("lowerBar");

    function show()
    {
        shown = true;
        $upperBarContext = {
            main,
            mainProps: {
                heading
            },
            leading,
            leadingProps: {
                onClick: hide
            },
            isHidden: false,
            isBackgroundShown: true
        };
        $lowerBarContext.isHidden = true;
    }

    function hide()
    {
        shown = false;
        $upperBarContext = cachedUpperBarContext;
        $lowerBarContext.isHidden = false;
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
                    <span class="show-all typo-body-2" on:click={show}>모두 보기</span>
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
    <div class="panel" transition:flyingFade={{ duration: duration * 2, y: 50 }}>
        <div class="grid">
            <slot name="grid" />
        </div>
    </div>
{/if}

<style>
    .panel {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        background-color: var(--white);
        overflow-y: scroll;
    }

    .panel::-webkit-scrollbar {
        display: none;
    }

    .title-bar {
        width: 100%;
        height: var(--space-xl);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 11;
        display: flex;
        align-items: center;
        background-color: var(--white);
    }

    .back-button {
        width: var(--space-2xl);
    }

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
        margin-top: var(--space-3xl);
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
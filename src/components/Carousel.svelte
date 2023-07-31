<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import Button from "./Button.svelte";
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
    import { duration, flyingFade } from "$lib/transition";

    export let leftOverflow = false;
    export let rightOverflow = false;
    export let heading: string | undefined = undefined;
    export let body: string | undefined = undefined;
    export let canShowAll = false;

    let shown = false;
    let dynamicBarContext = getContext<Writable<DynamicBarContext>>("dynamicBar");

    function show()
    {
        shown = true;
        $dynamicBarContext.isHidden = true;
    }

    function hide()
    {
        shown = false;
        $dynamicBarContext.isHidden = false;
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
        <div class="title-bar">
            <div class="back-button">
                <Button kind="white" icon={faArrowLeft} on:click={hide} />
            </div>
            {#if heading}
                <h2>{heading}</h2>
            {/if}
        </div>
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
        width: var(--space-xxl);
    }

    .container {
        width: auto;
    }

    .title {
        margin-bottom: var(--space-xxs);
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
        margin-top: var(--space-xxxl);
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
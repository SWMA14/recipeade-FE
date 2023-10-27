<script lang="ts">
    import { faXmark, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import type { SpaceType } from "$lib/types";
    import Button from "$components/Button.svelte";

    export let placeholder = "";
    export let icon: IconDefinition | undefined = undefined;
    export let iconClicked: () => void = () => {};
    export let valueChanged: (value: string) => void = () => {};
    export let value: string = "";
    export let autoBreak = false;
    export let fittedHeight = false;
    export let noPadding = false;
    export let noDelete = false;
    export let bottomMargin: SpaceType | undefined = undefined;

    $: valueChanged(value);

    let bottomMarginValue = bottomMargin ? `var(--space-${bottomMargin})` : undefined;
</script>

<div class="container" class:bottom-margin={bottomMargin} style="--bottom-margin: {bottomMarginValue};">
    {#if icon}
        <div class="button">
            <Button kind="transparent" {icon} on:click={iconClicked} />
        </div>
    {/if}
    <form on:submit|preventDefault={iconClicked}>
        {#if autoBreak}
            <div class="auto-break" contenteditable="true" {placeholder} on:focusout>
                {value}
            </div>
        {:else}
            <input class:fitted-height={fittedHeight} class:padding-left={icon} class:no-padding={noPadding}
                {placeholder} bind:value on:change on:click {...$$restProps} />
        {/if}
    </form>
    {#if value && !noDelete}
        <div class="button right">
            <Button kind="transparent" icon={faXmark} on:click={() => value = ""} />
        </div>
    {/if}
</div>

<style lang="postcss">
    .container {
        width: 100%;
        position: relative;
    }

    .button {
        width: var(--space-xl);
        position: absolute;
        top: 0;
        left: 0;

        &.right {
            left: unset;
            right: 0;
        }
    }

    input {
        width: 100%;
        height: var(--space-xl);
        padding: var(--space-xs);
        padding-right: var(--space-l);
        border-radius: var(--radius);
        background-color: var(--gray-50);

        &.fitted-height {
            height: unset;
        }

        &.padding-left {
            padding-left: var(--space-l);
        }

        &.no-padding {
            padding: 0;
        }
    }

    input::placeholder {
        color: var(--gray-400);
    }

    .auto-break:empty:before {
        content: attr(placeholder);
        color: var(--gray-400);
    }

    .bottom-margin {
        margin-bottom: var(--bottom-margin);
    }
</style>
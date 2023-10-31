<script lang="ts">
    import type { SpaceType } from "$lib/types";

    export let kind: "slot" | "heading" | "body" | "smallBody" = "slot";
    export let lines = 1;
    export let leftMargin: SpaceType | undefined = undefined;
    export let rightMargin: SpaceType | undefined = undefined;
    export let bottomMargin: SpaceType | undefined = undefined;

    let leftMarginValue = leftMargin ? `var(--space-${leftMargin})` : undefined;
    let rightMarginValue = rightMargin ? `var(--space-${rightMargin})` : undefined;
    let bottomMarginValue = bottomMargin ? `var(--space-${bottomMargin})` : undefined;
</script>

{#if lines > 1}
    {#each Array(lines - 1) as _}
        <div class="{kind} bottom-margin" style="--bottom-margin: var(--space-xs);" />
    {/each}
{/if}
<div class={kind} class:partial={kind !== "slot"}
    class:left-margin={leftMargin} class:right-margin={rightMargin} class:bottom-margin={bottomMargin}
    style="--left-margin: {leftMarginValue}; --right-margin: {rightMarginValue}; --bottom-margin: {bottomMarginValue};">
    {#if kind === "slot"}
        <slot />
    {/if}
</div>

<style lang="postcss">
    @keyframes flicker {
        0% {
            background-color: var(--gray-100);
        }

        100% {
            background-color: var(--gray-200);
        }
    }

    div {
        background-color: var(--gray-100);
        animation: flicker 2s infinite alternate;
        border-radius: var(--radius);

        &.heading {
            height: var(--space-m);

            &.partial {
                width: 35%;
            }
        }

        &.body {
            height: var(--space-xs);

            &.partial {
                width: 65%;
            }
        }

        &.smallBody {
            height: var(--space-2xs);

            &.partial {
                width: 50%;
            }
        }
    }

    .left-margin {
        margin-left: var(--left-margin);
    }

    .right-margin {
        margin-right: var(--right-margin);
    }

    .bottom-margin {
        margin-bottom: var(--bottom-margin);
    }
</style>
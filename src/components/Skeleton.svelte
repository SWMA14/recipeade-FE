<script lang="ts">
    import type { SpaceType } from "$lib/types";

    export let kind: "slot" | "heading" | "body" | "smallBody" = "slot";
    export let lines = 1;
    export let leftMargin: SpaceType | undefined = undefined;
    export let rightMargin: SpaceType | undefined = undefined;
    export let topMargin: SpaceType | undefined = undefined;
    export let bottomMargin: SpaceType | undefined = undefined;

    let leftMarginValue = leftMargin ? `var(--space-${leftMargin})` : undefined;
    let rightMarginValue = rightMargin ? `var(--space-${rightMargin})` : undefined;
    let topMarginValue = topMargin ? `var(--space-${topMargin})` : undefined;
    let bottomMarginValue = bottomMargin ? `var(--space-${bottomMargin})` : undefined;
</script>

<div class="container" class:left-margin={leftMargin} class:right-margin={rightMargin} class:top-margin={topMargin} class:bottom-margin={bottomMargin}
    style="--left-margin: {leftMarginValue}; --right-margin: {rightMarginValue}; --top-margin: {topMarginValue}; --bottom-margin: {bottomMarginValue};">
    {#if lines > 1}
        {#each Array(lines - 1) as _}
            <div class="skeleton {kind} bottom-margin" style="--bottom-margin: var(--space-xs);" />
        {/each}
    {/if}
    <div class="skeleton {kind}" class:partial={kind !== "slot"}>
        {#if kind === "slot"}
            <slot />
        {/if}
    </div>
</div>

<style lang="postcss">
    @keyframes flicker {
        0% {
            background-position: 100% 50%;
        }

        100% {
            background-position: 20% 50%;
        }
    }

    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .skeleton {
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to right, var(--gray-100) 40%, var(--gray-300) 60%, var(--gray-300) 70%, var(--gray-100) 70%);
        background-size: 500% auto;
        animation: flicker 2.5s infinite;
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

    .top-margin {
        margin-top: var(--top-margin);
    }

    .bottom-margin {
        margin-bottom: var(--bottom-margin);
    }
</style>
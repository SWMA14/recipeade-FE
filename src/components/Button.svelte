<script lang="ts">
    import Fa from "svelte-fa";
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import type { ButtonType, SpaceType } from "$lib/types";

    export let kind: ButtonType = "primary";
    export let size: "default" | "small" = "default";
    export let icon: IconDefinition | undefined = undefined;
    export let leftMargin: SpaceType | undefined = undefined;
    export let rightMargin: SpaceType | undefined = undefined;
    export let noHover = false;
    export let selected = false;
    export let progress: number | undefined = undefined;
    export let skeleton = false;

    let leftMarginValue = leftMargin ? `var(--space-${leftMargin})` : undefined;
    let rightMarginValue = rightMargin ? `var(--space-${rightMargin})` : undefined;
</script>

<button class="kind-{kind} size-{size}" {...$$restProps} class:no-hover={noHover} class:typo-body-2={size === "small"}
    class:left-margin={leftMargin} class:right-margin={rightMargin} class:selected
    class:progress style="--progress: {progress ?? 0}%; --left-margin: {leftMarginValue}; --right-margin: {rightMarginValue};"
    on:click on:focus on:mouseenter on:mousemove on:mouseleave>
    {#if icon}
        <Fa {icon} />
    {/if}
    <slot />
</button>

<style lang="postcss">
    button {
        width: 100%;
        height: var(--space-xl);
        padding: 0 var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius);
        transition: all 0.25s;

        &.kind-primary {
            color: var(--white);
            background-color: var(--primary-500);

            &:not(.no-hover):hover {
                background-color: var(--primary-600);
            }
        }

        &.kind-primary-light {
            color: var(--primary-500);
            background-color: var(--primary-100);

            &:not(.no-hover):hover {
                background-color: var(--primary-200);
            }
        }

        &.kind-gray {
            color: var(--gray-900);
            background-color: var(--gray-200);

            &:not(.no-hover):hover {
                background-color: var(--gray-300);
            }
        }

        &.kind-info {
            color: var(--white);
            background-color: var(--info-500);

            &:not(.no-hover):hover {
                background-color: var(--info-600);
            }
        }

        &.kind-success {
            color: var(--white);
            background-color: var(--success-500);

            &:not(.no-hover):hover {
                background-color: var(--success-600);
            }
        }

        &.kind-warning {
            color: var(--white);
            background-color: var(--warning-500);

            &:not(.no-hover):hover {
                background-color: var(--warning-600);
            }
        }

        &.kind-danger {
            color: var(--white);
            background-color: var(--danger-500);

            &:not(.no-hover):hover {
                background-color: var(--danger-600);
            }
        }

        &.kind-white {
            color: var(--gray-900);
            background-color: var(--white);

            &:not(.no-hover):hover {
                background-color: var(--gray-100);
            }
        }

        &.kind-transparent {
            color: var(--gray-400);
            background-color: transparent;
        }

        &.size-small {
            height: var(--space-s);
        }

        &.selected {
            color: var(--gray-900);
            background-color: var(--white);

            &.progress {
                background-image: linear-gradient(to right, var(--c-primary-light) var(--progress), var(--white) 0%);
                /* TODO: match original color */
            }
        }
    }

    .left-margin {
        margin-left: var(--left-margin);
    }

    .right-margin {
        margin-right: var(--right-margin);
    }
</style>
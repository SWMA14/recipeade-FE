<script lang="ts">
    import Fa from "svelte-fa";
    import type { IconDefinition as SolidIconDefinition } from "@fortawesome/free-solid-svg-icons";
    import type { IconDefinition as BrandIconDefinition } from "@fortawesome/free-brands-svg-icons";
    import { getContext } from "svelte";
    import type { ButtonType, SpaceType } from "$lib/types";

    export let kind: ButtonType = "primary";
    export let size: "default" | "medium" | "small" = "default";
    export let icon: SolidIconDefinition | BrandIconDefinition | undefined = undefined;
    export let leftMargin: SpaceType | undefined = undefined;
    export let rightMargin: SpaceType | undefined = undefined;
    export let bottomMargin: SpaceType | undefined = undefined;
    export let noHover = false;
    export let selected = false;
    export let fitted = false;
    export let badge = false;
    export let progress: number | undefined = undefined;
    export let style: string | undefined = undefined;

    // export let skeleton = false;

    let leftMarginValue = leftMargin ? `var(--space-${leftMargin})` : undefined;
    let rightMarginValue = rightMargin ? `var(--space-${rightMargin})` : undefined;
    let bottomMarginValue = bottomMargin ? `var(--space-${bottomMargin})` : undefined;
    let device: "ios" | "android" | "web" = getContext("device");
</script>

<button class="kind-{kind} size-{size}" {...$$restProps} class:no-hover={noHover || device !== "web"} class:typo-body-2={size === "small"}
    class:left-margin={leftMargin} class:right-margin={rightMargin} class:bottom-margin={bottomMargin} class:selected class:progress class:fitted class:badge
    style="--progress: {progress ?? 0}%; --left-margin: {leftMarginValue}; --right-margin: {rightMarginValue}; --bottom-margin: {bottomMarginValue};
    --color: var(--kind-{kind}-color); --background-color: var(--kind-{kind}-background-color); --hover: var(--kind-{kind}-hover-background-color);
    --selected-hover: var(--kind-{kind}-selected-hover-background-color); {style ?? ""}"
    on:click on:focus on:mouseenter on:mousemove on:mouseleave>
    {#if icon}
        <div class:icon-margin={$$slots.default}>
            <Fa {icon} />
        </div>
    {/if}
    <slot />
</button>

<style lang="postcss">
    button {
        --kind-primary-color: var(--white);
        --kind-primary-background-color: var(--primary-500);
        --kind-primary-hover-background-color: var(--primary-600);
        --kind-primary-selected-hover-background-color: var(--primary-100);
        --kind-primary-light-color: var(--primary-500);
        --kind-primary-light-background-color: var(--primary-100);
        --kind-primary-light-hover-background-color: var(--primary-200);
        --kind-primary-light-selected-hover-background-color: var(--primary-600);
        --kind-gray-color: var(--gray-900);
        --kind-gray-background-color: var(--gray-50);
        --kind-gray-hover-background-color: var(--gray-200);
        --kind-gray-selected-hover-background-color: var(--gray-800);
        --kind-info-color: var(--white);
        --kind-info-background-color: var(--info-500);
        --kind-info-hover-background-color: var(--info-600);
        --kind-info-selected-hover-background-color: var(--info-100);
        --kind-success-color: var(--white);
        --kind-success-background-color: var(--success-500);
        --kind-success-hover-background-color: var(--success-600);
        --kind-success-selected-hover-background-color: var(--success-100);
        --kind-warning-color: var(--white);
        --kind-warning-background-color: var(--warning-500);
        --kind-warning-hover-background-color: var(--warning-600);
        --kind-warning-selected-hover-background-color: var(--warning-100);
        --kind-danger-color: var(--white);
        --kind-danger-background-color: var(--danger-500);
        --kind-danger-hover-background-color: var(--danger-600);
        --kind-danger-selected-hover-background-color: var(--danger-100);
        --kind-white-color: var(--gray-900);
        --kind-white-background-color: var(--white);
        --kind-white-hover-background-color: var(--gray-50);
        --kind-white-selected-hover-background-color: var(--gray-800);
        --kind-black-color: var(--white);
        --kind-black-background-color: var(--gray-900);
        --kind-black-hover-background-color: var(--gray-800);
        --kind-black-selected-hover-background-color: var(--gray-50);
        --kind-transparent-color: var(--gray-400);
        --kind-transparent-background-color: transparent;
        --kind-transparent-hover-background-color: transparent;
        --kind-transparent-selected-hover-background-color: var(--gray-500);

        width: 100%;
        height: var(--space-xl);
        padding: 0 var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius);
        transition: all 0.25s;
        color: var(--color);
        background-color: var(--background-color);
        
        &:not(.no-hover):hover {
            background-color: var(--hover);

            &.selected {
                background-color: var(--selected-hover);
            }
        }

        &.size-medium {
            height: var(--space-m);
        }

        &.size-small {
            height: var(--space-s);
        }

        &.selected {
            color: var(--background-color);
            background-color: var(--color);

            &.progress {
                background-image: linear-gradient(to right, var(--primary-100) var(--progress), var(--white) 0%);
            }
        }

        &.fitted {
            width: fit-content;
            height: fit-content;
            padding: 0;
        }

        &.badge {
            border-radius: var(--radius-big);
        }

        & .icon-margin {
            margin-right: var(--space-2xs);
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
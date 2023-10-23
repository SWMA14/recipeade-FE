<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let primary = false;
    export let dark = false;
    export let icon: IconDefinition | undefined = undefined;
    export let leftMargin = false;
    export let rightMargin = false;
</script>

<div class="badge typo-body-2" class:primary class:dark class:left-margin={leftMargin} class:right-margin={rightMargin}>
    {#if icon}
        <div class="icon-margin">
            <Fa {icon} />
        </div>
    {/if}
    <slot />
</div>

<style lang="postcss">
    .badge {
        height: var(--space-s);
        padding: var(--space-2xs);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gray-800);
        background-color: var(--white);
        border-radius: var(--radius-big);

        &.primary {
            color: var(--white);
            background-color: var(--primary-500);
        }

        & .icon-margin {
            margin-right: var(--space-2xs);
        }
    }

    .left-margin {
        margin-left: var(--space-2xs);
    }

    .right-margin {
        margin-right: var(--space-2xs);
    }
</style>
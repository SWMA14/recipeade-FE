<script lang="ts">
    import { _ } from "svelte-i18n";
    import Card from "$components/Card.svelte";

    export let ref: HTMLElement | undefined = undefined;
    export let index: number;
    export let description: string;
</script>

<div bind:this={ref} class="wrapper">
    <Card>
        <span>{description}</span>
        <div class="divider" />
        <span class="typo-body-2 steps">{$_("page.recipe.ingredientsUsedStep", { values: { step: index.toString() } })}</span>
    </Card>
</div>

<style lang="postcss">
    .wrapper {
        width: 100%;
        height: fit-content;

        &.top-offset {
            margin-top: var(--top);
            margin-bottom: calc(var(--top) * -1);
        }

        &.right-margin {
            margin-right: var(--space-xs);
        }

        &.bottom-margin {
            margin-bottom: var(--space-xs);
        }

        & .summary-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        & .amount {
            color: var(--primary-500);
        }

        & .divider {
            margin: var(--space-xs) calc(var(--space-xs) * -1);
            border-top: 2.25px solid var(--white);
        }

        & .steps {
            color: var(--gray-700);
            word-spacing: var(--space-3xs);
        }

        & .summary {
            margin-top: var(--space-2xs);
            word-wrap: break-word;
        }
    }
</style>
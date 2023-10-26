<script lang="ts">
    import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
    import { _ } from "svelte-i18n";
    import type { SpaceType } from "$lib/types";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";

    export let ref: HTMLElement | undefined = undefined;
    export let name: string;
    export let amount: string | undefined = undefined;
    export let usedSteps: number[] | undefined = undefined;
    export let summary: string | undefined = undefined;
    export let bottomMargin: SpaceType | undefined = undefined;

    let summaryExpanded = false;
    let bottomMarginValue = bottomMargin ? `var(--space-${bottomMargin})` : undefined;

    function getUsedStepsString(): string
    {
        const result = usedSteps!
            .map(i => $_("page.recipe.ingredientsUsedStep", { values: { step: (i + 1).toString() } }));

        return result.join(" · ");
    }
</script>

<div bind:this={ref} class="wrapper" class:bottom-margin={bottomMargin} style="--bottom-margin: {bottomMarginValue};">
    <Card>
        <span>{name}</span>
        {#if !usedSteps && summary}
            <div class="summary-wrapper">
                <span class="amount">{amount}</span>
                <Button kind="transparent" icon={faAngleDown} fitted />
            </div>
        {:else if amount}
            <span class="amount">{amount}</span>
        {/if}
        {#if usedSteps}
            <div class="divider" />
            <div class="summary-wrapper">
                <span class="typo-body-2 steps">{getUsedStepsString()}</span>
                {#if summary}
                    <Button kind="transparent" icon={summaryExpanded ? faAngleUp : faAngleDown} fitted leftMargin="2xs"
                        on:click={() => summaryExpanded = !summaryExpanded} />
                {/if}
            </div>
            {#if summaryExpanded}
                <span class="typo-body-2 summary">{summary}</span>
            {/if}
        {/if}
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
            margin-bottom: var(--bottom-margin);
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
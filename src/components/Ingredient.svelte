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
    export let alters: string[] = [];
    export let summary: string | undefined = undefined;
    export let bottomMargin: SpaceType | undefined = undefined;
    export let white = false;

    let flipped = false;
    let bottomMarginValue = bottomMargin ? `var(--space-${bottomMargin})` : undefined;

    function getUsedStepsString(): string
    {
        const result = usedSteps!
            .map(i => $_("page.recipe.ingredientsUsedStep", { values: { step: (i + 1).toString() } }));

        return result.join(" &bull; ");
    }

    function flip()
    {
        if (alters.length === 0 && !summary)
            return;

        flipped = !flipped;
    }
</script>

<div bind:this={ref} class="wrapper" class:bottom-margin={bottomMargin} style="--bottom-margin: {bottomMarginValue};" on:click={flip}>
    {#if flipped}
        <Card backgroundColor="gray-900">
            {#if alters.length > 0}
                <span style="color: var(--gray-400);">대체 가능: </span><span class="black">{alters.join(", ")}</span>
            {/if}
            {#if summary}
                {#if alters.length > 0}
                    <div class="divider black"/>
                {/if}
                <span class="summary black">{summary}</span>
            {/if}
        </Card>
    {:else}
        <Card backgroundColor={white ? "white" : "gray-50"}>
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
                <div class="divider" class:white />
                <div class="summary-wrapper">
                    <span class="typo-body-2 steps">{@html getUsedStepsString()}</span>
                </div>
            {/if}
        </Card>
    {/if}
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

            &.white {
                border-top: 2.25px solid var(--gray-50);
            }
        }

        & .steps {
            color: var(--gray-700);
            word-spacing: var(--space-3xs);
        }

        & .summary {
            margin-top: var(--space-2xs);
            word-wrap: break-word;
        }

        & .black {
            color: var(--white);
        }
    }
</style>
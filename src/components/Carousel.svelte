<script lang="ts">
    export let leftOverflow = false;
    export let rightOverflow = false;
    export let heading: string | undefined = undefined;
    export let body: string | undefined = undefined;
    export let canShowAll = false;
</script>

<div class="container">
    {#if heading || body}
        <div class="title">
            <div class="heading">
                {#if heading}
                    <h2>{heading}</h2>
                {/if}
                {#if canShowAll}
                    <span class="show-all typo-body-2">모두 보기</span>
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

<style>
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

    .left-overflow {
        margin-left: calc(var(--space-xs) * -1);
    }

    .right-overflow {
        margin-right: calc(var(--space-xs) * -1);
    }
</style>
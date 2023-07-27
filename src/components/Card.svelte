<script lang="ts">
    export let backgroundColor = "gray-100";
    export let video = undefined;
    export let heading: string | undefined = undefined;
    export let body: string | undefined = undefined;
    export let modifier: string | undefined = undefined;
    export let darkOverlay = false;
    export let visibleOverflow = false;
    export let noRadius = false;
    export let noPadding = false;
    export let largePadding = false;
    export let columnFlex = false;
    export let leftMargin = false;
    export let rightMargin = false;
    export let bottomMargin = false;
    export let scrollSnap = false;
</script>

<div class="container" style="--card-background-color: var(--{backgroundColor});"
    class:visible-overflow={visibleOverflow} class:no-radius={noRadius} class:no-padding={noPadding}
    class:large-padding={largePadding} class:column-flex={columnFlex} class:scroll-snap={scrollSnap}
    class:left-margin={leftMargin} class:right-margin={rightMargin} class:bottom-margin={bottomMargin}>
    {#if heading || body || modifier}
        <div class="texts" class:flex-end={!heading}>
            {#if heading}
                <h1>{heading}</h1>
            {/if}
            <div class="body">
                {#if modifier}
                    <span class="typo-body-2">{modifier}</span>
                {/if}
                {#if body}
                    <span class="body-text">{body}</span>
                {/if}
            </div>
        </div>
    {/if}
    {#if darkOverlay}
        <div class="overlay" />
    {/if}
    <slot />
</div>

<style>
    .container {
        width: 100%;
        min-width: var(--card-min-width);
        padding: var(--space-xs);
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--card-background-color);
        border-radius: var(--radius);
        overflow: hidden;
    }

    .texts {
        width: 100%;
        height: 100%;
        padding: var(--space-xs);
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .flex-end {
        justify-content: flex-end;
    }

    .body {
        display: flex;
        flex-direction: column;
    }

    .body-text {
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--gray-900);
        opacity: var(--overlay-opacity);
    }

    .visible-overflow {
        overflow: visible;
    }

    .no-radius {
        border-radius: 0;
    }

    .no-padding {
        padding: 0;
    }

    .large-padding {
        padding: var(--space-m);
    }

    .column-flex {
        flex-direction: column;
    }

    .left-margin {
        margin-left: var(--space-xs);
    }

    .right-margin {
        margin-right: var(--space-xs);
    }

    .bottom-margin {
        margin-bottom: var(--space-xs);
    }

    .scroll-snap {
        scroll-snap-align: start;
        scroll-snap-stop: always;
    }
</style>
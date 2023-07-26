<script lang="ts">
    export let video = undefined;
    export let noRadius = false;
    export let noPadding = false;
    export let columnFlex = false;
    export let rightMargin = false;
    export let bottomMargin = false;
    export let scrollSnap = false;
</script>

<div class:no-radius={noRadius} class:no-padding={noPadding} class:column-flex={columnFlex}
    class:right-margin={rightMargin} class:bottom-margin={bottomMargin} class:scroll-snap={scrollSnap}>
    <slot />
</div>

<style>
    div {
        width: 100%;
        min-width: calc(100% - var(--space-xl));
        padding: var(--space-xs);
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--gray-100);
        border-radius: var(--radius);
    }

    .no-radius {
        border-radius: 0;
    }

    .no-padding {
        padding: 0;
    }

    .column-flex {
        flex-direction: column;
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
<script lang="ts">
    export let leftOverflow = false;
    export let rightOverflow = true;
</script>

<div class="container" class:left-overflow={leftOverflow} class:right-overflow={rightOverflow}>
    <slot />
</div>

<style>
    .container {
        width: auto;
        display: flex;
        scroll-snap-type: x mandatory;
        scroll-padding-left: var(--space-xs);
        -webkit-overflow-scrolling: touch;
        overflow-x: scroll;
    }

    .container::-webkit-scrollbar {
        display: none;
    }

    .left-overflow {
        margin-left: calc(var(--space-xs) * -1);
    }

    .right-overflow {
        margin-right: calc(var(--space-xs) * -1);
    }
</style>
<script lang="ts">
    export let dark = false;
    export let rightMargin = false;
</script>

<div class="typo-body-2" class:dark={dark} class:rightMargin={rightMargin}>
    <slot />
</div>

<style>
    div {
        height: var(--space-s);
        padding: var(--space-3xs) var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gray-800);
        background-color: var(--white);
        border-radius: var(--radius-big);
    }

    .dark {
        background-color: var(--gray-100);
    }

    .rightMargin {
        margin-right: var(--space-2xs);
    }
</style>
<script lang="ts">
    function firstChild(node: HTMLElement)
    {
        const offset = (node.firstChild as HTMLElement).clientHeight / 2;

        for (let i = 1; i < node.children.length; i += 2)
        {
            const element = node.children[i] as HTMLElement;
            element.style.marginTop = `${offset}px`;
            element.style.marginBottom = `-${offset}px`;
        }
    }
</script>

<div use:firstChild>
    <slot />
</div>

<style>
    div {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-xs);
    }
</style>
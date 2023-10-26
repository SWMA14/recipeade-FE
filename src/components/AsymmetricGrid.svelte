<script lang="ts">
    let firsts: HTMLElement[] = [];
    let seconds: HTMLElement[] = [];
    let offset: number = 0;

    function splitChildren(node: HTMLElement)
    {
        offset = (node.children[0] as HTMLElement).clientHeight / 2;

        for (let i = 0; i < node.children.length; i++)
        {
            const element = node.children[i] as HTMLElement;

            if (i < node.children.length - 2)
                element.style.marginBottom = "var(--space-xs)";

            if (i % 2 === 0)
                firsts.push(element);
            else
                seconds.push(element);
        }
    }

    function setFirstChildren(node: HTMLElement)
    {
        node.replaceChildren(...firsts);
    }

    function setSecondChildren(node: HTMLElement)
    {
        node.style.marginTop = `${offset}px`;
        node.replaceChildren(...seconds);
    }
</script>

<div use:splitChildren>
    <slot />
</div>
<div class="wrapper">
    <div class="first" use:setFirstChildren />
    <div class="second" use:setSecondChildren />
</div>

<style lang="postcss">
    .wrapper {
        width: 100%;
        display: grid;
        grid-template-columns: calc(50% - var(--space-2xs)) calc(50% - var(--space-2xs));
        gap: var(--space-xs);
    }
</style>
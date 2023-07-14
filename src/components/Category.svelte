<script lang="ts">
    import { getCategoryById } from "$lib/category";

    export let id: number | string;

    const category = getCategoryById(id)!;
</script>

<span class="category">{category}</span>

<style>
    .category {
        margin: 0.15rem;
        padding: 0.15rem 0.55rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        border-radius: 20px;
        border: 1px solid var(--c-foreground-gray);
        color: var(--c-foreground-gray);
    }
</style>
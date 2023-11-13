<script lang="ts">
    import { goto } from "$app/navigation";

    export let data;

    goto(`/${data.id}/${data.isOverview ? "overview" : "detail"}`, { replaceState: true });
</script>
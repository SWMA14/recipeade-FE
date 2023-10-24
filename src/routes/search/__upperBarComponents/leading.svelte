<script lang="ts">
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
    import Button from "$components/Button.svelte";
</script>

<Button kind="white" icon={faArrowLeft} on:click={history.back} />
<script lang="ts">
    import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
    import { faHeart } from "@fortawesome/free-regular-svg-icons";
    import Button from "$components/Button.svelte";

    export let liked: Promise<boolean>;
    export let onClick: () => void;
</script>

{#await liked then isLiked}
    <Button kind="primary-light" icon={isLiked ? faHeartFilled : faHeart} on:click={onClick} />
{/await}
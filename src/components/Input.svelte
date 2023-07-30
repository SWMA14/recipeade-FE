<script lang="ts">
    import { faXmark, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Button from "$components/Button.svelte";

    export let placeholder = "";
    export let icon: IconDefinition | undefined = undefined;

    let value: string;
</script>

<div class="container">
    {#if icon}
        <div class="button">
            <Button kind="transparent" {icon} on:click />
        </div>
    {/if}
    <input type="text" class:padding-left={icon} {placeholder} bind:value />
    {#if value}
        <div class="button right">
            <Button kind="transparent" icon={faXmark} on:click={() => value = ""} />
        </div>
    {/if}
</div>

<style lang="postcss">
    .container {
        position: relative;
    }

    .button {
        width: var(--space-xl);
        position: absolute;
        top: 0;
        left: 0;

        &.right {
            left: unset;
            right: 0;
        }
    }

    input {
        width: 100%;
        height: var(--space-xl);
        padding: var(--space-xs);
        padding-right: var(--space-l);
        border: 1px solid var(--gray-200);
        border-radius: var(--radius);
    }

    input::placeholder {
        color: var(--gray-400);
    }

    .padding-left {
        padding-left: var(--space-l);
    }
</style>
<script lang="ts">
    export let kind:
        "primary" | "primary-light" | "gray" | "info" | "success" | "warning" | "danger" = "primary";
    export let size: "default" | "small" = "default";
    export let icon = undefined;
    export let skeleton = false;
</script>

<button class="kind-{kind} size-{size}">
    <slot />
</button>

<style lang="postcss">
    button {
        height: 3rem;
        padding: 0 var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius);
        transition: all 0.25s;

        &.kind-primary {
            color: var(--white);
            background-color: var(--primary-500);

            &:hover {
                background-color: var(--primary-600);
            }
        }

        &.kind-primary-light {
            color: var(--primary-500);
            background-color: var(--primary-100);

            &:hover {
                background-color: var(--primary-200);
            }
        }

        &.kind-gray {
            color: var(--gray-900);
            background-color: var(--gray-200);

            &:hover {
                background-color: var(--gray-300);
            }
        }

        &.kind-info {
            color: var(--white);
            background-color: var(--info-500);

            &:hover {
                background-color: var(--info-600);
            }
        }

        &.kind-success {
            color: var(--white);
            background-color: var(--success-500);

            &:hover {
                background-color: var(--success-600);
            }
        }

        &.kind-warning {
            color: var(--white);
            background-color: var(--warning-500);

            &:hover {
                background-color: var(--warning-600);
            }
        }

        &.kind-danger {
            color: var(--white);
            background-color: var(--danger-500);

            &:hover {
                background-color: var(--danger-600);
            }
        }
    }
</style>
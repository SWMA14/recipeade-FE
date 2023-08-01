<script lang="ts">
    import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
    import Input from "$components/Input.svelte";

    export let onValueChanged: (value: string) => void;
    export let onClick: () => void;
</script>

<Input icon={faMagnifyingGlass} placeholder="어떤 요리를 해 볼까요?" valueChanged={onValueChanged} on:click={onClick} />
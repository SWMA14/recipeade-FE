<script lang="ts">
    import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
    import Input from "$components/Input.svelte";

    export let onValueChanged: (value: string) => void;
    export let onIconClicked: () => void;
    export let onClick: () => void;
    export let value: string;
</script>

<Input icon={faMagnifyingGlass} placeholder="어떤 요리를 해 볼까요?" valueChanged={onValueChanged}
    iconClicked={onIconClicked} on:click={onClick} {value} />
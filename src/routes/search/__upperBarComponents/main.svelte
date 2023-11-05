<script lang="ts">
    import { _ } from "svelte-i18n";
    import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
    import Input from "$components/Input.svelte";

    export let onValueChanged: (value: string) => void;
    export let onIconClicked: () => void;
    export let onClick: () => void;
    export let value: string;
</script>

<Input icon={faMagnifyingGlass} placeholder={$_("page.discover.searchPlaceholder")} valueChanged={onValueChanged}
    iconClicked={onIconClicked} on:click={onClick} {value} />
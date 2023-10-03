<script lang="ts">
    import Fa from "svelte-fa";
    import { faHouse, faMagnifyingGlass, faHeart, faBookmark, faFire, faGear } from "@fortawesome/free-solid-svg-icons";
    import { page } from "$app/stores";
    import Card from "$components/Card.svelte";

    let tabs = [
        {
            href: "/",
            icon: faBookmark
        },
        {
            href: "/discover",
            icon: faFire
        },
        {
            href: "/search",
            icon: faMagnifyingGlass
        },
        {
            href: "/settings",
            icon: faGear
        }
    ];
</script>

<Card backgroundColor="primary-500">
    <div class="content">
        {#each tabs as { href, icon } (href)}
            <a {href} class:selected={href === $page.route.id}><Fa {icon} /></a>
        {/each}
    </div>
</Card>

<style>
    .content {
        display: flex;
        justify-content: space-between;
        color: var(--primary-400);
    }

    .content a {
        transition: all 0.25s;
    }

    .selected {
        color: var(--white);
    }
</style>
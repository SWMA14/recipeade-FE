<script lang="ts">
    import { onMount } from "svelte";
    import Device from "svelte-device-info";
    import {goto} from  "$app/navigation";

    let isLoggedIn = false;
    let isMobile = true;

    onMount(() => {
        isMobile = Device.isMobile;
    })
</script>


<div class="profile-form">
    <div class="profile">
        <img src="https://i.namu.wiki/i/d1A_wD4kuLHmOOFqJdVlOXVt1TWA9NfNt_HA0CS0Y_N0zayUAX8olMuv7odG2FiDLDQZIRBqbPQwBSArXfEJlQ.webp" alt="채널 이미지" />
        {#if isLoggedIn}
            <h2> Placeholder</h2>
            <img style="height: 1.5rem; width: 1.5rem; padding-left: 0.25rem;" alt="settings" src="/images/icons/autonext-selected.png"/>
        {:else}
            <h2>로그인 해주세요</h2>
        {/if}
    </div>
    <button on:click={() => goto(`/mypage/settings`)} >
        <img alt="settings" src="/images/icons/autonext-selected.png"/>
    </button>
</div>

<div class="divider" />

<div class="section-form">
    <a href="/mypage/creator" class="section">
        <h3>구독한 크리에이터</h3>
        <img alt="creater" src="/images/icons/autonext-selected.png"/>
    </a>
    <a href="/mypage/review" class="section">
        <h3>작성한 후기</h3>
        <img alt="review" src="/images/icons/autonext-selected.png"/>
    </a>
</div>

<style>
    .profile {
        display: flex;
        align-items: center;
    }

    .profile > img {
        width: 4rem;
        height: 4rem;
        margin-right: 0.5rem;
        object-fit: cover;
        border-radius: 20px;
    }

    .profile-form {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .section > img {
        width: 1.5rem;
    }

    .section-form {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .divider {
        width: 100%;
        background-color: gray; 
        height: 0.75rem;
        margin-top: 0.75rem;
    }

    .section {
        display: flex;
        flex-direction: row;
        width: 100%;
        text-align: center;
        padding: 0.5rem;
        padding-left: 1rem;
        border-bottom: 1px solid #000;
        border-color: black;
        justify-content: space-between;
    }
</style>





<script lang="ts">
    import { onMount } from "svelte";
    import Device from "svelte-device-info";
    import {goto} from  "$app/navigation";

    let isLoggedIn = true;
    let isMobile = true;

    onMount(() => {
        isMobile = Device.isMobile;
    })
</script>


<div class="profile-form">
    <div class="profile">
        <button on:click={()=>{goto('/mypage')}}>
            <img src="https://i.namu.wiki/i/d1A_wD4kuLHmOOFqJdVlOXVt1TWA9NfNt_HA0CS0Y_N0zayUAX8olMuv7odG2FiDLDQZIRBqbPQwBSArXfEJlQ.webp" alt="채널 이미지" />
        </button>
        <h2>내 정보 수정</h2>
    </div>
</div>

<div class="divider" />

<div class="section-form">
    <div class="section">
        <img class="section-profile-img" src="https://i.namu.wiki/i/d1A_wD4kuLHmOOFqJdVlOXVt1TWA9NfNt_HA0CS0Y_N0zayUAX8olMuv7odG2FiDLDQZIRBqbPQwBSArXfEJlQ.webp" alt="프로필 이미지" />
        <img class="section-profile-change" src="https://i.namu.wiki/i/d1A_wD4kuLHmOOFqJdVlOXVt1TWA9NfNt_HA0CS0Y_N0zayUAX8olMuv7odG2FiDLDQZIRBqbPQwBSArXfEJlQ.webp" alt="프로필 변경 이미지"/>
    </div>
    <div class="section">
        <h2>닉네임</h2>
        <div class="section-end">
            <p>Placeholder</p>
            <img alt="settings" src="/images/icons/autonext-selected.png"/>
        </div>
    </div>
    <div class="section">
        <h2>이메일</h2>
        <div class="section-end">
            <p>example@naver.com</p>
            <img alt="settings" src="/images/icons/autonext-selected.png"/>
        </div>
    </div>
    <div class="section">
        <h2>비밀번호 변경</h2>
        <div class="section-end">
            <img alt="settings" src="/images/icons/autonext-selected.png"/>
        </div>
    </div>
</div>

<style>
    .section-end > p {
        margin-right: 0.5rem;
        color: gray;
    }

    .section-end > img {
        width: 1.5rem;
        height: 1.5rem;
    }

    .section-end {
        margin-top: 0.25rem;
        display: flex; 
        flex-direction: row;
    }

    .section-profile-change{
        width: 4rem;
        height: 4rem;
        border-radius: 70%;
        object-fit: cover;
        margin-bottom: 2rem;
        display: block;
        margin: 0px auto;
        z-index: 10;
    }

    .profile {
        display: flex;
        align-items: center;
    }

    .profile > button > img {
        width: 4rem;
        height: 4rem;
        margin-right: 0.5rem;
        object-fit: cover;
    }

    .profile-form {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .section-profile-img {
        justify-content: center;
        width: 10rem;
        height: 10rem;
        border-radius: 70%;
        object-fit: cover;
        margin-bottom: 2rem;
        display: block;
        margin: 0px auto;
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





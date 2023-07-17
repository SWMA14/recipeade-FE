<script lang="ts">
    import { onMount } from "svelte";
    import Device from "svelte-device-info";
    import {goto} from  "$app/navigation";
    import Video from "$components/Video.svelte";

    export let data;

    let isLoggedIn = false;
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

<div class="section">
    <div class="videos-container grid" class:desktop={!isMobile}>
        {#each data.highViews as video (video.thumbnail)}
            <Video {video} bottomMargin />
        {/each}
    </div>
</div>



<style>
    .section {
        width: 100%;
        margin-bottom: 2rem;
    }

    .videos-container {
        display: flex;
        margin-top: 0.5rem;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        overflow-x: scroll;
    }

    .videos-container::-webkit-scrollbar {
        display: none;
    }

    .videos-container.desktop {
        padding-bottom: 1rem;
    }

    .videos-container.desktop::-webkit-scrollbar {
        display: block;
    }

    .grid {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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


    .divider {
        width: 100%;
        background-color: gray; 
        height: 0.75rem;
        margin-top: 0.75rem;
    }

</style>
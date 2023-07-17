<script lang="ts">
    import { onMount } from "svelte";
    import Device from "svelte-device-info";
    import { MetaTags } from "svelte-meta-tags";

    const title = "로그인 페이지";
    const description = "로그인 페이지입니다.";

    let isMobile = true;

    onMount(() => {
        isMobile = Device.isMobile;
    })
</script>

<MetaTags
    {title}
    {description}
    canonical=""
/>

<h1>
    레시피에이드
</h1>


<div class="loginsec">
    <form class="login-form" method="post" action="?/OAuth2">
        <button class="login-btn google" type="submit">
            <img class="google-logo" alt="구글 로고" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/32px-Google_%22G%22_Logo.svg.png" />
            구글로 계속하기
        </button>
    </form>
    <button class="login-btn kakao">카카오로 계속하기</button>
    <a href="/" class="login-form">
        <button class="login-btn">로그인 없이 계속하기</button>
    </a>
</div>



<style>
    .google-logo{
        position: absolute;
        padding-left: 1rem;
        left: 0%;
    }
    .google {
        background-color: white;
    }

    .kakao {
        background-color: #FEE500;
    }

    .login-form{
        width: 100%;
    }

    .loginsec {
        position: absolute;
        bottom: 0rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        width: 75%;
    }


    .login-btn {
        margin-bottom: 1rem;
        padding: 0.75rem 1.5rem;
        color: black;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        width: 100%;
        left: 50%;
        text-align: center;
        font-size: large;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";
    import Device from "svelte-device-info";
    import { MetaTags } from "svelte-meta-tags";
    import Button from "$components/Button.svelte";
    import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
    import { goto } from "$app/navigation";
    
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

<div class="margin"></div>
<h1>
    레시피에이드
</h1>

    <Button icon={faEnvelope} on:click={()=>{goto('/login/email')}}>
        이메일로 계속하기
    </Button>
    <div class="separator">
        또는
     </div>
     <form class="login-form" method="post" action="?/OAuth2">
        <Button kind="white">
            <img class="google-logo" alt="구글 로고" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/32px-Google_%22G%22_Logo.svg.png" />
            구글로 계속하기
        </Button>
     </form>
    <div class="margin"></div>
    <Button kind="success">
        네이버로 계속하기    
    </Button>
    <div class="margin"></div>


<span class="agreement">
    서비스를 이용함으로써 귀하는 본 
    <span class="underline">이용약관</span>과 
</span>
<span class="agreement">
    <span class="underline">개인정보처리방침</span>에 동의하게 됩니다.
</span>


<style>
    .underline {
        text-decoration: underline;
    }

    .agreement {
        font-size: 0.9rem;
        text-align: center;
        position: relative;
        justify-content: center;
    }
    

    .margin {
        margin-bottom: 1rem;
    }

    .separator {
        width: 100%;
        text-align: center;
        margin: 20px 0;
        position: relative;
    }

    .separator::before, .separator::after {
        content: '';
        position: absolute;
        width: 40%;
        border-bottom: 1px solid #000; /* 구분선 색상 */
    }

    .separator::before {
        left: 0;
        bottom: 50%;
    }

    .separator::after {
        right: 0;
        bottom: 50%;
    }

    .google-logo{
        position: absolute;
        padding-left: 1rem;
        left: 5%;
    }

</style>

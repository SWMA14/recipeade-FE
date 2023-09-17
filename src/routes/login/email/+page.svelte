<script lang="ts">
    import Input from "$components/Input.svelte";


    let email : string;
    let password : string;
    let isEmail : boolean = false;

    const ChangeEmail = (value: string) => {
        email = value;
    }

    const ChangePassword = (value: string) => {
        password = value;
    }   

    const validateEmail = () => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(regex.test(email)){
            //backend 서버에 있는 회원인지 아닌지 확인 후
            //있으면 password 일치 확인 후 로그인
            //틀리면 password 생성
            isEmail = true;
        }
        else{
            isEmail = false;
        }
    }
</script>


<h1>
    이메일로 계속하기
</h1>
<div class="margin"></div>
<div style="width: 90%;">
    <Input placeholder="이메일을 작성해주세요" valueChanged={ChangeEmail} value={email} iconClicked={validateEmail}/>
    <div class="margin"></div>
    {#if isEmail}
        <Input placeholder="비밀번호를 작성해주세요" valueChanged={ChangePassword} value={password}/>
    {/if}
</div>



<style>
    .margin {
        margin-bottom: 3rem;
    }
</style>




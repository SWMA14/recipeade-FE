<svelte:head>
    <meta name="appleid-signin-client-id" content="net.recipeade.svelte">
    <meta name="appleid-signin-scope" content="email">
    <meta name="appleid-signin-redirect-uri" content="https://recipeade.net/login/oauth_apple">
    <meta name="appleid-signin-use-popup" content="true">
</svelte:head>

<style>
 .signin-button {
    width: 210px;
    height: 40px;
    cursor: pointer;
}
</style>

<div id="appleid-signin" class="signin-button" data-color="{color}" data-border="{border}" data-type="{type}"></div>

<script type="text/javascript">
    import { onMount } from "svelte";

    onMount(() => {
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        document.body.appendChild(script);
    });
// data types

    export let type = 'sign in'; // can only be 'sign in' and 'continue'
    export let color = 'black'; // can only be 'black' and 'white'
    export let border = 'false'; // can only be 'true in' and 'false'
</script>
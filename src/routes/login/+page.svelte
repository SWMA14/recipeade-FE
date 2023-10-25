<script lang="ts">
    import { type SignInWithAppleOptions, SignInWithApple } from "@capacitor-community/apple-sign-in";
    import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth"
    import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
    import { _, format } from "svelte-i18n";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import { allVideos, surveyedVideos } from "../../store";
    import { beforeNavigate, goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import { PUBLIC_API_ENDPOINT } from "$env/static/public";
    import { getAccessToken, getIsOnboarded, saveAuthTokens, saveOnboardingCompleted } from "$lib/auth";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import Input from "$components/Input.svelte";
    import Video from "$components/Video.svelte";
    import onboardingMain from "./__lowerBarComponents/onboardingMain.svelte";
    import surveyMain from "./__lowerBarComponents/surveyMain.svelte";
    import surveyUpperMain from "./__upperBarComponents/surveyMain.svelte";

    let device: "ios" | "android" | "web" = getContext("device");
    let isSignedIn = false;
    let isSigningWithEmail = false;
    let isOnboarded = false;
    let endOnboardingButtonShown = false;
    let isSurveyed = true; // temporary

    let videos = Array<HTMLVideoElement>(4);
    let isPlayed = Array<boolean>(4).fill(false);
    isPlayed[0] = true;

    let email = "";
    let emailValidating: Promise<boolean>;
    let password = "";

    $: getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
        // isHidden: !isOnboarded || isSurveyed,
        // isBackgroundShown: true,
        // main: surveyUpperMain  -- temporary
    });
    $: getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        isHidden: !isSignedIn || !endOnboardingButtonShown,
        main: onboardingMain,
        mainProps: {
            onClick: () => goto("/")
        }
        // main: !isOnboarded ? onboardingMain : surveyMain,
        // mainProps: !isOnboarded ? {
        //     onClick: startSurvey
        // } : {
        //     selected: $surveyedVideos.length,
        //     threshold: 5
        // }  -- temporary
    });

    onMount(async () => {
        if (browser)
            GoogleAuth.initialize({
                clientId: "627309130382-9109aakabgpnjm91n43inhnhbtja28fp.apps.googleusercontent.com",
                scopes: ["profile", "email"],
                grantOfflineAccess: true
            });

        // isOnboarded = await getIsOnboarded();
    });

    beforeNavigate(async ({ cancel, to }) => {
        if (to && to.url.searchParams.has("succeeded"))
        {
            to.url.searchParams.delete("succeeded");
            return;
        }

        cancel();
        if (to && await getAccessToken() !== null)
        {
            to.url.searchParams.append("succeeded", "");
            goto(to.url);
        }
        else
            console.log("cancelled")
    });

    async function signInWithApple()
    {
        const options: SignInWithAppleOptions = {
            clientId: "com.recipeade.svelte",
            redirectURI: "https://recipeade.net/login/oauth_apple",
            scopes: "name email",
            state: "12345"
        };

        SignInWithApple.authorize(options)
            .then(async signedInfo => {
                const result = await fetch(`${PUBLIC_API_ENDPOINT}/login/oauth/apple`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "token_type": "id_token",
                        "token": signedInfo.response.identityToken
                    })
                }).then(response => response.json());

                await saveAuthTokens(result["access_token"], result["refresh_token"]);

                if (await getIsOnboarded())
                    goto("/");
                else
                    isSignedIn = true;
            });
    }

    function signInWithGoogle()
    {
        GoogleAuth.signIn()
            .then(async signedInfo => {
                const result = await fetch(`${PUBLIC_API_ENDPOINT}/login/oauth/google`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "token_type": "id_token",
                        "token": signedInfo.authentication.idToken
                    })
                }).then(response => response.json());

                await saveAuthTokens(result["access_token"], result["refresh_token"]);

                if (await getIsOnboarded())
                    goto("/");
                else
                    isSignedIn = true;
            });
    }

    function signInWithEmail()
    {
        isSigningWithEmail = true;
    }

    function completeOnboarding()
    {
        endOnboardingButtonShown = true;
        saveOnboardingCompleted();
    }

    function startSurvey()
    {
        isOnboarded = true;
    }

    function checkVideosVisible(e: any)
    {
        for (const [i, video] of videos.entries())
        {
            if (!video)
                continue;

            if (!isPlayed[i] && (e.target.scrollLeft >= e.target.clientWidth * 0.8 * i || e.target.scrollLeft + e.target.clientWidth >= e.target.scrollWidth))
            {
                video.play();
                isPlayed[i] = true;
            }
        }
    }
</script>

<div class="container">
    {#if !isSignedIn && !isSigningWithEmail}
        <div class="tall login">
            <div class="slogan">
                <h1>{@html $_("page.login.slogan")}</h1>
            </div>
            <div class="buttons">
                {#if device !== "android"}
                    <Button kind="black" icon={faApple} bottomMargin="2xs" on:click={signInWithApple}>{$_("page.login.signInWithApple")}</Button>
                {/if}
                <Button kind="info" icon={faGoogle} on:click={signInWithGoogle}>{$_("page.login.signInWithGoogle")}</Button>
                <!-- <span class="divider typo-body-2">{$_("page.login.signInOr")}</span>
                <Button on:click={signInWithEmail}>{$_("page.login.signUp")}</Button> -->
                <span class="disclaimer typo-body-2">{@html $_("page.login.signInTOS")}</span>
            </div>
        </div>
    {:else if !isSignedIn && isSigningWithEmail}
        <div class="tall">
            <h1>{@html $_("page.login.enterEmail")}</h1>
            <Input value={email} placeholder={$_("page.login.enterEmailPlaceholder")} />
        </div>
    {:else if !isOnboarded}
        <div class="onboarding">
            <Carousel leftOverflow rightOverflow onScroll={checkVideosVisible} onScrollEnd={completeOnboarding}>
                {#each Array(3) as _, i}
                    <Card leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs" columnFlex scrollSnap>
                        <div class="feature-video">
                            <video src="/videos/landing-{i + 1}.mp4" bind:this={videos[i]} muted autoplay={i === 0} playsinline />
                        </div>
                        <div class="description">
                            <h2>{$format(`page.login.onboardingHeader${i + 1}`)}</h2>
                            <span>{$format(`page.login.onboardingDescription${i + 1}`)}</span>
                        </div>
                    </Card>
                {/each}
            </Carousel>
        </div>
    {:else if !isSurveyed}
        <div class="survey">
            {#each $allVideos as video (video.youtubeThumbnail)}
                <Video {video} selectable verbose bottomMargin="xs" />
            {/each}
        </div>
    {/if}
</div>

<style lang="postcss">
    .container {
        width: 100%;
        margin: auto 0;
    }

    .tall {
        height: 100vh;
        display: flex;
        flex-direction: column;

        & h1 {
            margin-top: calc(var(--space-3xl) + env(safe-area-inset-top));
            margin-bottom: var(--space-m);
        }
    }

    .login {
        & .slogan {
            height: -webkit-fill-available;
            display: flex;
            align-items: center;
        }

        & h1 {
            background-image: linear-gradient(315deg, var(--primary-900) 10%, var(--primary-500));
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        & .buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    
        & .divider {
            margin: var(--space-2xs) 0;
            color: var(--gray-500);
        }

        & .disclaimer {
            margin-top: var(--space-xs);
            margin-bottom: var(--space-m);
            padding: 0 var(--space-m);
            color: var(--gray-500);
            text-align: center;
        }
    }

    .survey {
        margin-top: calc(var(--space-3xl) + env(safe-area-inset-top));
    }

    .section {
        padding: var(--space-3xl) var(--space-m);
        display: flex;

        @media (max-width: 64rem) {
            flex-direction: column;
        }
    }

    .feature-video {
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-big);
        overflow: hidden;
        box-shadow: 0 0 5rem rgba(120, 14, 0, 0.1);

        & video {
            min-width: 150%;
            min-height: 150%;
        }
    }

    .description {
        margin: var(--space-s) 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;

        &.left {
            padding-right: var(--space-m);
        }

        & .white {
            color: var(--white);
        }

        & span {
            margin-top: var(--space-2xs);
        }
    }
</style>
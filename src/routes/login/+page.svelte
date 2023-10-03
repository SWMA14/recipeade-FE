<script lang="ts">
    import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { allVideos, surveyedVideos } from "../../store";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Carousel from "$components/Carousel.svelte";
    import Video from "$components/Video.svelte";
    import onboardingMain from "./__lowerBarComponents/onboardingMain.svelte";
    import surveyMain from "./__lowerBarComponents/surveyMain.svelte";
    import surveyUpperMain from "./__upperBarComponents/surveyMain.svelte";

    let isSignedIn = false;
    let isOnboarded = false;
    let isOnboardingCompleted = false;
    let isSurveyed = false;

    $: getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: !isOnboarded || isSurveyed,
        isBackgroundShown: true,
        main: surveyUpperMain
    });
    $: getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        isHidden: !isSignedIn || !isOnboardingCompleted,
        main: !isOnboarded ? onboardingMain : surveyMain,
        mainProps: !isOnboarded ? {
            onClick: startSurvey
        } : {
            selected: $surveyedVideos.length,
            threshold: 5
        }
    });

    function signIn()
    {
        isSignedIn = true;
    }

    function completeOnboarding()
    {
        isOnboardingCompleted = true;
    }

    function startSurvey()
    {
        isOnboarded = true;
    }
</script>

<div class="container">
    {#if !isSignedIn}
        <div class="login">
            <h1>{@html $_("page.login.slogan")}</h1>
            <Button kind="gray" icon={faApple} bottomMargin="2xs" on:click={signIn}>{$_("page.login.signInWithApple")}</Button>
            <Button kind="gray" icon={faGoogle} on:click={signIn}>{$_("page.login.signInWithGoogle")}</Button>
            <span class="divider typo-body-2">{$_("page.login.signInOr")}</span>
            <Button on:click={signIn}>{$_("page.login.signUp")}</Button>
        </div>
    {:else if !isOnboarded}
        <div class="onboarding">
            <Carousel leftOverflow rightOverflow onScrollEnd={completeOnboarding}>
                {#each ["유튜브에서 공유해 레시피를 만들어요", "요리 모드로 편리하게 요리해요", "음성으로 제어해 손을 쓰지 않아도 괜찮아요"] as text, i (text)}
                    <Card backgroundColor="primary-200" leftMargin={i === 0 ? "xs" : undefined} rightMargin="xs"
                        columnFlex scrollSnap>
                        <div style="height: 50vh;">
                            {text}
                        </div>
                    </Card>
                {/each}
            </Carousel>
        </div>
    {:else if !isSurveyed}
        <div class="survey">
            {#each $allVideos as video (video.youtubeThumbnail)}
                <Video {video} selectable verbose bottomMargin />
            {/each}
        </div>
    {/if}
</div>

<style lang="postcss">
    .container {
        width: 100%;
        margin: auto 0;
    }

    .login {
        display: flex;
        flex-direction: column;
        align-items: center;

        & h1 {
            margin-bottom: calc(var(--space-3xl) * 3);
            align-self: flex-start;
            background-image: linear-gradient(315deg, var(--primary-900) 10%, var(--primary-500));
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    
        & .divider {
            margin: var(--space-2xs) 0;
            color: var(--gray-500);
        }
    }

    .survey {
        margin-top: calc(var(--space-3xl) + env(safe-area-inset-top));
    }
</style>
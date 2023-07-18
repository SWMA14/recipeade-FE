<script lang="ts">
    import "../app.css";
    import { fade, fly } from "svelte/transition";
    import { expoOut } from "svelte/easing";
    import { questions } from "$lib/questions";
    import { duration } from "$lib/transition";
    import { feedbackResult } from "../store";

    const answerTexts = ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];

    let isFeedbackShown = false;
    let submitResult = "";

    export const snapshot = {
        capture: () => $feedbackResult,
        restore: value => $feedbackResult = value
    };

    function number(x: any): number
    {
        return x as number;
    }

    function feedback()
    {
        isFeedbackShown = true;
    }

    function cancelFeedback()
    {
        isFeedbackShown = false;
    }

    function submitFeedback()
    {
        const isInvalid = $feedbackResult.overall.some((x, i) => questions[i].required && x == -1);
        submitResult = isInvalid ? "필수 항목을 모두 입력해 주세요." : "소중한 피드백 감사드립니다 🙇";
        setTimeout(() => submitResult = "", 1500);

        if (!isInvalid)
            fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify($feedbackResult)
            });
    }

    function handleInput(i: number, value: any)
    {
        $feedbackResult.overall[i] = value;
    }
</script>

<main>
    <slot />
    <!-- <div class="main-content">
    </div> -->
</main>
  
<style>
    main {
        width: 100%;
        max-width: var(--max-width);
        margin: 0 auto;
        margin-top: 2rem;
        padding: 0 var(--padding);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media only screen and (min-width: 64rem) {
        main {
            padding: 0;
        }
    }
</style>
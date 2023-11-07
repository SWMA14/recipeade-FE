<script lang="ts">
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { allVideos } from "../../store";
    import { type AssistantResponse, sendMessage } from "$lib/assistant";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { type VideoData, VideoOverviewToEmptyData } from "$lib/video";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Skeleton from "$components/Skeleton.svelte";
    import Video from "$components/Video.svelte";
    import main from "../__lowerBarComponents/main.svelte";

    getContext<Writable<DynamicBarContext>>("upperBar").update(x => x = {
        isHidden: true
    });
    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        main,
        isFitted: true
    });

    let value = "";
    let response: Promise<AssistantResponse> | undefined = undefined;

    function confident(target: any)
    {
        return target!;
    }

    function submit()
    {
        response = sendMessage(value);
    }

    function getVideos(ids: string[])
    {
        return ids.map(id => {
            const video = $allVideos.find(x => x.id === id);

            if (video)
                return VideoOverviewToEmptyData(video);
        }).filter(x => x) as VideoData[];
    }
</script>

<div class="messages">
    <h1 class="assistant">어떤 요리를 찾고 계세요?</h1>
    <form>
        <div class="user" contenteditable="true" placeholder="집에 감자가 너무 많아요" on:input={e => value = confident(e.target).innerText}>
            {value}
        </div>
    </form>
    {#if value !== "" && response === undefined}
        <Button kind="gray" on:click={submit}>전송하기</Button>
    {:else if response !== undefined}
        {#await response}
            <Skeleton kind="body" lines={2} />
        {:then data}
            {#each getVideos(data.curatedVideos) as video}
                <Video {video} />
            {/each}
            <h1 class="answer">
                {data.text}
            </h1>
        {:catch}
            <Card backgroundColor="danger-100">
                오류가 발생했어요. 다시 시도해 주세요.
            </Card>
        {/await}
    {/if}
</div>

<style lang="postcss">
    .messages {
        width: 100%;
        margin-top: calc(var(--space-3xl) * 4 + env(safe-area-inset-top));
        display: flex;
        flex-direction: column;

        & form {
            margin-bottom: var(--space-m);
        }
    }

    .question {
        color: var(--black);
    }

    .answer {
        font-size: 1.75rem;
        font-weight: 400;
        line-height: 1.4;
    }

    .user {
        font-size: 1.75rem;
        line-height: 1.4;

        &:empty:before {
            content: attr(placeholder);
            color: var(--gray-400);
        }
    }
</style>
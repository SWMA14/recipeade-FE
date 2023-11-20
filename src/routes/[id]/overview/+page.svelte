<script lang="ts">
    import { _ } from "svelte-i18n";
    import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { savedVideos } from "../../../store";
    import { goto } from "$app/navigation";
    import { PUBLIC_API_ENDPOINT } from "$env/static/public";
    import { authedFetch } from "$lib/auth";
    import type { DynamicBarContext } from "$lib/dynamicBar";
    import { unitizeViews, convertApiToVideoData, type VideoData, getVideoInfo } from "$lib/video";
    import Button from "$components/Button.svelte";
    import Card from "$components/Card.svelte";
    import Skeleton from "$components/Skeleton.svelte";
    import main from "./__lowerBarComponents/main.svelte";

    export let data;

    getContext<Writable<DynamicBarContext>>("lowerBar").update(x => x = {
        main,
        mainProps: {
            onClick: addRecipe
        }
    });

    let device: "ios" | "android" | "web" = getContext("device");
    let pending = false;

    async function fetchSavedRecipes(): Promise<VideoData[]>
    {
        const result = await authedFetch(`${PUBLIC_API_ENDPOINT}/customize/recipes`)
            .then(response => response.status === 404 ? [] : response.json());

        return await Promise.all(result
            .map(async (video: any) => convertApiToVideoData(video)));
    }

    async function addRecipe()
    {
        pending = true;

        await authedFetch(`${PUBLIC_API_ENDPOINT}/customize/create_default?sourceLink=https://www.youtube.com/watch?v=${data.id}&lang=${$_("locale")}`, {
            method: "POST"
        });
        const info = await getVideoInfo(data.id);

        $savedVideos = [{
            youtubeVideoId: data.id,
            youtubeTitle: info.title,
                youtubeThumbnail: info.thumbnail,
                youtubeViewCount: info.viewCounts,
                channel: info.channel,
                temporary: true
            } as VideoData, ...$savedVideos];

        const interval = setInterval(async () => {
            const videos = await fetchSavedRecipes();

            if (videos.find(x => x.youtubeVideoId === data.id)?.ingredients !== undefined)
            {
                clearInterval(interval);
                $savedVideos = videos;
                goto(`/${data.id}/detail`, { replaceState: true});
            }
        }, 1000);
    }
</script>

<div class="section">
    <div class="title no-margin">
        <h2>{data.video.youtubeTitle}</h2>
        <Button kind="white" style="width: var(--space-xl);" icon={faAngleDown} on:click={() => history.back()} />
    </div>
    <p class="statistics typo-body-2">
        {$_("page.recipe.viewCounts", { values: { count: unitizeViews(data.video.youtubeViewCount, $_("locale")) }})} · {data.video.channel}
    </p>
    {#if !pending}
        <h2 class="guide">레시피를 저장하고<br>재료와 단계를 확인해 보세요</h2>
    {/if}
</div>
{#if pending}
    <div class="section second">
        <Skeleton kind="heading" bottomMargin="xs" />
        <Card skeleton bottomMargin="xs">
            <div class="skeleton-ingredient" />
        </Card>
        <Card skeleton>
            <div class="skeleton-ingredient" />
        </Card>
    </div>
    <div class="section last" class:ios={device === "ios"}>
        <Skeleton kind="heading" bottomMargin="xs" />
        <Card skeleton bottomMargin="xs">
            <div class="skeleton-step" />
        </Card>
        <Card skeleton>
            <div class="skeleton-step" />
        </Card>
    </div>
{/if}

<style lang="postcss">
    .section {
        width: 100%;
        height: 100%;
        margin-bottom: var(--space-m);

        &.second {
            margin-top: var(--space-3xl);
        }

        &.last {
            margin-bottom: var(--space-xs);

            &.ios {
                margin-bottom: var(--space-s);
            }
        }

        & .guide {
            margin-top: var(--space-3xl);
            align-self: center;
            text-align: center;
        }
    }

    .title {
        margin-bottom: var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: space-between;

        &.no-margin {
            margin-bottom: 0;
        }
    }

    .statistics {
        color: var(--gray-700);
    }

    .skeleton-ingredient {
        height: var(--space-xl);
    }

    .skeleton-step {
        height: calc(var(--space-xl) * 2);
    }
</style>
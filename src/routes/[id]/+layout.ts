import { get } from "svelte/store";
import { allVideos, savedVideos } from "../../store";
import { VideoOverviewToEmptyData } from "$lib/video";

export const prerender = false;

export async function load({ params })
{
    let video = get(savedVideos).find(x => x.youtubeVideoId === params.id);
    let isOverview = false;

    if (!video)
    {
        video = VideoOverviewToEmptyData(get(allVideos).find(x => x.id === params.id)!)
        isOverview = true;
    }

    return {
        video,
        isOverview,
        id: params.id
    };
}
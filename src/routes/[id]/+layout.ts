import { get } from "svelte/store";
import { allVideos } from "../../store";

export const prerender = false;

export async function load({ params })
{
    return {
        video: get(allVideos).find(x => x.youtubeVideoId === params.id)!,
        id: params.id
    };
}
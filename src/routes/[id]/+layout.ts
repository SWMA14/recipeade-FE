import { get } from "svelte/store";
import { allVideos, savedVideos } from "../../store";

export const prerender = false;

export async function load({ params })
{
    return {
        video: get(savedVideos).find(x => x.youtubeVideoId === params.id)!,
        id: params.id
    };
}
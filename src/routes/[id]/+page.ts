import { get } from "svelte/store";
import { allVideos } from "../../store";
import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import type { VideoData } from "$lib/video";

export async function load({ params, fetch })
{
    const target = get(allVideos).find(x => x.youtubeVideoId === params.id)!;
    const recommendedIds = await fetch(`${PUBLIC_API_ENDPOINT}/recipe/recommend/?difficulty=${target.difficulty}&category=${target.category}`)
        .then(response => response.json())
        .then(result => (result as VideoData[]).map(x => x.youtubeVideoId));
    const recommended = get(allVideos).filter(x => recommendedIds.includes(x.youtubeVideoId) && x.youtubeVideoId !== params.id);

    return {
        recommended
    };
}
import { get } from "svelte/store";
import { allVideos } from "../store";
import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import type { VideoData } from "$lib/video";

export async function load({ fetch })
{
    if (get(allVideos).length === 0)
        allVideos.set(await fetch(`${PUBLIC_API_ENDPOINT}/recipe`)
            .then(response => response.json())
            .then(result => result as VideoData[]));

    const random = get(allVideos).sort(() => 0.5 - Math.random())[0];
    const rest = get(allVideos).filter(x => x !== random);

    const highViews = rest.sort((a, b) => b.youtubeViewCount - a.youtubeViewCount).slice(0, 5);
    const easy = rest.filter(x => x.difficulty <= 2);
    const others = rest.filter(x => !highViews.includes(x) && !easy.includes(x));

    return {
        random,
        highViews,
        easy,
        others
    }
}
import { API_ENDPOINT } from "$env/static/private";
import type { Video } from "$lib/video";

export const prerender = true;

export async function load({ fetch })
{
    const all = await fetch(`${API_ENDPOINT}/recipe`)
        .then(response => response.json())
        .then(result => result as Video[]);

    const random = all.sort(() => 0.5 - Math.random())[0];
    const rest = all.filter(x => x !== random);

    const highViews = rest.sort((a, b) => b.youtubeViewCount - a.youtubeViewCount).slice(0, 5);
    const easy = rest.filter(x => x.difficulty <= 2);
    const others = rest.filter(x => !highViews.includes(x) && !easy.includes(x));

    return {
        all,
        random,
        highViews,
        easy,
        others,
        apiEndpoint: API_ENDPOINT
    };
}
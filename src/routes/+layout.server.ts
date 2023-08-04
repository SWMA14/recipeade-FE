import { PUBLIC_API_ENDPOINT, PUBLIC_RECOMMENDED_SEARCH_PLACEHOLDER } from "$env/static/public";
import type { Video } from "$lib/video";

export const prerender = true;

export async function load({ fetch })
{
    const all = await fetch(`${PUBLIC_API_ENDPOINT}/recipe`)
        .then(response => response.json())
        .then(result => result as Video[]);

    const random = all.sort(() => 0.5 - Math.random())[0];
    const rest = all.filter(x => x !== random);

    const highViews = rest.sort((a, b) => b.youtubeViewCount - a.youtubeViewCount).slice(0, 5);
    const easy = rest.filter(x => x.difficulty <= 2);
    const others = rest.filter(x => !highViews.includes(x) && !easy.includes(x));

    let recommendedWords = [] as {
        word: string;
        video: string;
    }[];
    for (const word of PUBLIC_RECOMMENDED_SEARCH_PLACEHOLDER.split(","))
    {
        const videos = await fetch(`${PUBLIC_API_ENDPOINT}/search/${word}`)
            .then(response => response.json());
    
        recommendedWords.push({
            word,
            video: videos.sort(() => 0.5 - Math.random())[0].youtubeVideoId
        });
    }

    return {
        all,
        random,
        highViews,
        easy,
        others,
        recommendedWords
    };
}
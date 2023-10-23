import { PUBLIC_API_ENDPOINT, PUBLIC_RECOMMENDED_SEARCH_PLACEHOLDER } from "$env/static/public";

export const prerender = false;

export async function load({ fetch })
{
    let recommendedWords = [] as {
        word: string;
        video: string;
    }[];

    for (const word of PUBLIC_RECOMMENDED_SEARCH_PLACEHOLDER.split(","))
    {
        const videos = await fetch(`${PUBLIC_API_ENDPOINT}/search/${word}`)
            .then(response => response.json());

        if (videos.length > 0)
            recommendedWords.push({
                word,
                video: videos.sort(() => 0.5 - Math.random())[0].youtubeVideoId
            });
    }

    return {
        recommendedWords
    };
}
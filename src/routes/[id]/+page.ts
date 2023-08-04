import { PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { Video } from '$lib/video';

export async function load({ parent, params, fetch })
{
    const parentData = await parent();
    const target = parentData.all.find(x => x.youtubeVideoId === params.id)!;
    const recommendedIds = await fetch(`${PUBLIC_API_ENDPOINT}/recipe/recommend/?difficulty=${target.difficulty}&category=${target.category}`)
        .then(response => response.json())
        .catch(() => [])
        .then(result => (result as Video[]).map(x => x.youtubeVideoId));
    const recommended = parentData.all.filter(x => recommendedIds.includes(x.youtubeVideoId) && x.youtubeVideoId !== params.id);

    return {
        recommended
    };
}
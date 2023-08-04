export async function load({ parent, params })
{
    return {
        video: (await parent()).all.find(x => x.youtubeVideoId === params.id)!,
        id: params.id
    };
}
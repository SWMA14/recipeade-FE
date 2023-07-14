import { data } from "$lib/rawData";

export async function load({ params })
{
    return {
        video: data.find(x => x.video.includes(params.id))!,
        id: params.id
    };
}
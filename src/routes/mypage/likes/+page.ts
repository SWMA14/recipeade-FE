import { data } from "$lib/rawData";

export async function load()
{
    const highViews = data.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

    return {
        highViews
    };
}
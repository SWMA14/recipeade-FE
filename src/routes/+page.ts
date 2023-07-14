import { data } from "$lib/rawData";

export async function load()
{
    const highViews = data.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
    const easy = data.filter(x => x.difficulty <= 2);
    const others = data.filter(x => !highViews.includes(x) && !easy.includes(x));

    return {
        highViews,
        easy,
        others
    };
}
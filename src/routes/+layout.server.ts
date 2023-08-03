import { data } from "$lib/rawData";

export const prerender = true;

export async function load()
{
    const random = data.sort(() => 0.5 - Math.random())[0];
    const rest = data.filter(x => x !== random);

    const highViews = rest.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
    const easy = rest.filter(x => x.difficulty <= 2);
    const others = rest.filter(x => !highViews.includes(x) && !easy.includes(x));

    return {
        random,
        highViews,
        easy,
        others
    };
}
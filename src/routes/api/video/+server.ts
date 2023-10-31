import { json } from "@sveltejs/kit";

export async function POST({ fetch, request })
{
    const titleRegex = /(?<=<meta name="title" content=").+?(?=">)/g;
    const channelRegex = /(?<="ownerChannelName":").+?(?=")/;
    const viewCountsRegex = /(?<="viewCount":{"videoViewCountRenderer":{"viewCount":{"simpleText":").+?(?=")/;
    const dateRegex = /(?<="dateText":{"simpleText":").+?(?=")/;
    const id = await request.text();

    const result = await fetch(`https://www.youtube.com/watch?v=${id}`)
        .then(response => response.text());

    return json({
        title: result.match(titleRegex)?.[0] ?? undefined,
        channel: result.match(channelRegex)?.[0] ?? undefined,
        viewCounts: parseInt(result.match(viewCountsRegex)?.[0].replace(/\D/g, "") ?? "0"),
        date: result.match(dateRegex)?.[0] ?? undefined,
        thumbnail: `https://i.ytimg.com/vi/${id}/sddefault.jpg`
    });
}
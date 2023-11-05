import { error, json } from "@sveltejs/kit";

export async function POST({ fetch, request })
{
    const titleRegex = /(?<=<meta name="title" content=").+?(?=">)/g;
    const channelRegex = /(?<="ownerChannelName":").+?(?=")/;
    const viewCountsRegex = /(?<="viewCount":{"videoViewCountRenderer":{"viewCount":{"simpleText":").+?(?=")/;
    const dateRegex = /(?<="dateText":{"simpleText":").+?(?=")/;
    const id = await request.text();

    const result = await fetch(`https://youtu.be/${id}`)
        .then(response => response.text());

    const title = result.match(titleRegex)?.[0];
    const channel = result.match(channelRegex)?.[0];
    const viewCounts = parseInt(result.match(viewCountsRegex)?.[0].replace(/\D/g, "") ?? "0");
    const date = result.match(dateRegex)?.[0];

    if (!title || !channel || !date)
        throw error(400, "Invalid video ID");

    return json({
        title,
        channel,
        viewCounts,
        date,
        thumbnail: `https://i.ytimg.com/vi/${id}/sddefault.jpg`
    });
}
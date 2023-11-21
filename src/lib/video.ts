import { PUBLIC_API_ENDPOINT } from "$env/static/public";

export interface VideoData
{
    youtubeVideoId: string;
    youtubeTitle: string;
    youtubeViewCount: number;
    difficulty: number;
    category: string;
    youtubeThumbnail: string;
    id: string;
    ingredients: Ingredient[];
    recipesteps: Step[];
    channel: string;
    tags?: string[];
    temporary?: boolean;
}

export interface Ingredient
{
    name: string;
    quantity: number | string | null;
    unit: string | null;
    usedSteps: number[] | undefined;
}

export interface Step
{
    seconds: number;
    timestamp: string;
    // ingredients: string[];
    description: string;
}

export interface VideoOverview
{
    id: string;
    title: string;
    thumbnail: string;
    viewCounts: number;
    date: string;
    channel: string;
}

export function VideoOverviewToEmptyData(video: VideoOverview): VideoData
{
    return {
        youtubeVideoId: video.id,
        youtubeTitle: video.title,
        youtubeViewCount: video.viewCounts,
        difficulty: 0,
        category: "",
        youtubeThumbnail: video.thumbnail,
        id: video.id,
        channel: video.channel,
        ingredients: [],
        recipesteps: [],
        tags: []
    };
}

export function unitizeViews(views: number, locale: string): string
{
    if (views < 1000)
        return views.toString();

    if (locale === "ko")
    {
        if (views < 10000)
            return `${(views / 1000).toFixed(1)}천`;
        else if (views < 1000000)
            return `${(views / 10000).toFixed(1)}만`;
        else if (views < 10000000)
            return `${(views / 1000000).toFixed(1)}백만`;
        else
            return `${(views / 10000000).toFixed(1)}천만`;
    }
    else
    {
        if (views < 1000000)
            return `${(views / 1000).toFixed(1)}K`;
        else
            return `${(views / 1000000).toFixed(1)}M`;
    }
}

export function timestampToSeconds(timestamp: string): number
{
    const regex = /\d{1,}:\d{2}/;
    const match = timestamp.match(regex)![0];
    const [minute, second] = match.split(":").map((x) => parseInt(x));

    return minute * 60 + second;
}

function includes(source: string, target: string): boolean
{
    const splitted = target.split(" ");

    return splitted.some(x => source.includes(x));
}

export function getUsedSteps(steps: Step[], ingredient: string): number[] | undefined
{
    const result = [] as number[];

    for (let i = 0; i < steps.length; i++)
        if (includes(steps[i].description, ingredient))
            result.push(i);

    return result.length > 0 ? result : undefined;
}

export async function getVideoInfo(id: string)
{
    let result = await fetch(`${PUBLIC_API_ENDPOINT}/customize/get_youtube_info?url=https://www.youtube.com/watch?v=${id}`)
        .then(response => response.json());

    while (result["msg"] === "failed")
        result = await fetch(`${PUBLIC_API_ENDPOINT}/customize/get_youtube_info?url=https://www.youtube.com/watch?v=${id}`)
            .then(response => response.json());

    return {
        title: result["title"],
        channel: result["channel"],
        viewCounts: parseInt(result["views"].replace(",", "")),
        date: result["date"],
        thumbnail: `https://i.ytimg.com/vi/${id}/sddefault.jpg`
    };
}

export async function convertApiToVideoData(video: any): Promise<VideoData>
{
    const info = await getVideoInfo(video["sourceId"]);

    return {
        youtubeVideoId: video["sourceId"],
        youtubeTitle: info.title,
        youtubeViewCount: info.viewCounts,
        difficulty: video["difficulty"],
        category: video["category"],
        youtubeThumbnail: info.thumbnail,
        id: video["id"],
        channel: info.channel,
        ingredients: video["ingredients"],
        recipesteps: video["steps"].map((step: any) => ({
            seconds: timestampToSeconds(step["timestamp"]),
            timestamp: step["timestamp"],
            description: step["step"]
        })),
        tags: video["tags"]
    };
}

export function convertVideoDataToApi(video: VideoData)
{
    return {
        title: video.youtubeTitle,
        steps: video.recipesteps.map(step => ({
            step: step.description,
            timestamp: step.timestamp
        })),
        ingredients: video.ingredients,
        tags: video.tags ?? "",
        difficulty: video.difficulty,
        category: video.category
    };
}
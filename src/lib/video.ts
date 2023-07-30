export interface Video
{
    author: string;
    channelUrl: string;
    publishDate: string;
    title: string;
    views: number;
    description: string;
    transcript: string;
    generated: boolean;
    thumbnail: string;
    difficulty: number;
    kind: string;
}

interface Ingredient
{
    name: string;
    quantity: number | string | null;
    unit: string | null;
}

interface Step
{
    description: string;
    timestamp: string;
}

export interface DemoVideo
{
    video: string;
    thumbnail: string;
    title: string;
    viewCount: number;
    channel: string;
    publishedAt: string;
    ingredients: Ingredient[];
    steps: Step[];
    difficulty: number;
    cateogry: string;
}

export function unitizeViews(views: number): string
{
    if (views < 1000)
        return views.toString();
    else if (views < 10000)
        return `${(views / 1000).toFixed(1)}천`;
    else if (views < 1000000)
        return `${(views / 10000).toFixed(1)}만`;
    else if (views < 10000000)
        return `${(views / 1000000).toFixed(1)}백만`;
    else
        return `${(views / 10000000).toFixed(1)}천만`;
}

export function extractId(video: DemoVideo): string | undefined
{
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = video.video.match(regex);

    return match ? match[1] : undefined;
}

export function timestampToSeconds(timestamp: string): number
{
    const regex = /\d{1,}:\d{2}/;
    const match = timestamp.match(regex)![0];
    const [minute, second] = match.split(":").map((x) => parseInt(x));

    return minute * 60 + second;
}
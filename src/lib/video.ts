import { Preferences } from "@capacitor/preferences";

export interface Video
{
    youtubeVideoId: string;
    youtubeTitle: string;
    youtubeViewCount: number;
    difficulty: number;
    category: string;
    youtubeThumbnail: string;
    id: number;
    rating: number;
    ingredients: Ingredient[];
    recipesteps: Step[];
    channel: Channel;
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

interface Channel
{
    channelID: string;
    ChannelName: string;
    id: number;
}

interface LikedVideo {
    id: string;
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

export function timestampToSeconds(timestamp: string): number
{
    const regex = /\d{1,}:\d{2}/;
    const match = timestamp.match(regex)![0];
    const [minute, second] = match.split(":").map((x) => parseInt(x));

    return minute * 60 + second;
}

export async function getLikedVideos(): Promise<LikedVideo[]>
{
    const result = await Preferences.get({
        key: "likedVideos"
    });

    const a = JSON.parse(result.value ?? "[]") as LikedVideo[];
    console.log(a);

    return a;
}

export async function saveLikedVideo(id: string)
{
    const videos = await getLikedVideos();

    if (!videos.some(x => x.id === id))
        await Preferences.set({
            key: "likedVideos",
            value: JSON.stringify([
                {
                    id
                },
                ...videos
            ])
        });
}

export async function removeLikedVideo(id: string)
{
    const videos = await getLikedVideos();

    await Preferences.set({
        key: "likedVideos",
        value: JSON.stringify(videos.filter(x => x.id !== id))
    });
}

export async function clearLikedVideos()
{
    await Preferences.remove({
        key: "likedVideos"
    });
}
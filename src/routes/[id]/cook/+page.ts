import { data } from "$lib/rawData";
import { extractId } from "$lib/video";

export function entries()
{
    return data.map(x => ({
        id: extractId(x)!
    }));
}
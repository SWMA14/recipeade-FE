import { data } from "$lib/rawData";

export function entries()
{
    return data.map(x => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = x.video.match(regex);

        return {
            id: match![1]
        };
    });
}
import { data } from "$lib/rawData";
import { extractId } from "$lib/video";

// export async function load({ fetch })
// {
//     const searchResult = await fetch(`http://ec2-3-37-59-231.ap-northeast-2.compute.amazonaws.com/search/${"고기"}`)
//         .then(response => response.json())
//         .then(result => result as JSON[])
//         .catch(error => [] as JSON[]);

//     console.log(searchResult);

//     return {
//         searchResult
//     };
// }

export function entries()
{
    return data.map(x => ({
        id: extractId(x)!
    }));
}
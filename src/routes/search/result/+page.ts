import type { Load } from "@sveltejs/kit";

export const prerender = false;

export const load: Load = async ({ fetch,url}) => {
    const query = url.searchParams.get('query');
    
    //sort는 rating, current, viewCount 가능
    const response_current = await fetch(`http://ec2-3-37-59-231.ap-northeast-2.compute.amazonaws.com/search/${query}?sort=current`)
    .then((response) => { return response.json();})
    .catch((error) => {console.log(error); return null;})

    const response_rating = await fetch(`http://ec2-3-37-59-231.ap-northeast-2.compute.amazonaws.com/search/${query}?sort=rating`)
    .then((response) => { return response.json();})
    .catch((error) => {console.log(error); return null;})

    const response_viewCount = await fetch(`http://ec2-3-37-59-231.ap-northeast-2.compute.amazonaws.com/search/${query}?sort=viewCount`)
    .then((response) => { return response.json();})
    .catch((error) => {console.log(error); return null;})
    
    return {
        response_current,
        response_rating,
        response_viewCount
    }

}

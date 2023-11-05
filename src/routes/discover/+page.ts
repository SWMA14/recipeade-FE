import { PUBLIC_API_ENDPOINT } from '$env/static/public';

export async function load({ fetch })
{
    await fetch(`${PUBLIC_API_ENDPOINT}/`)
}
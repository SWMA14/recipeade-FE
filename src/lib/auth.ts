import { Preferences } from "@capacitor/preferences";

export async function saveAuthTokens(accessToken: string, refreshToken: string)
{
    await Preferences.set({
        key: "accessToken",
        value: accessToken
    });
    await Preferences.set({
        key: "refreshToken",
        value: refreshToken
    });
}

export async function getAccessToken(): Promise<string | null>
{
    const token = await Preferences.get({
        key: "accessToken"
    });

    return token.value;
}

export async function getRefreshToken(): Promise<string | null>
{
    const token = await Preferences.get({
        key: "refreshToken"
    });

    return token.value;
}

export async function removeAuthTokens()
{
    await Preferences.remove({
        key: "accessToken"
    });
    await Preferences.remove({
        key: "refreshToken"
    });
}

export async function authedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
{
    if (await getAccessToken() === null)
        throw new Error("Not authenticated");

    let tempInit = init ?? {};

    tempInit.headers = {
        ...tempInit.headers,
        "Authorization": `Bearer ${await getAccessToken()}`
    };

    let response = await fetch(input, tempInit);

    if (!response.ok)
    {
        const refresh = await fetch("https://recipeade.net/login/refresh", {
            method: "POST",
            body: JSON.stringify({
                "token_type": "refresh_token",
                "token": await getRefreshToken()
            })
        }).then(res => res.json());

        saveAuthTokens(refresh["access_token"], refresh["refresh_token"]);

        tempInit = init ?? {};

        tempInit.headers = {
            ...tempInit.headers,
            "Authorization": `Bearer ${await getAccessToken()}`
        };

        response = await fetch(input, tempInit);
    }

    return response;
}
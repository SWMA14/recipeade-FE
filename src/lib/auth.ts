import { Preferences } from "@capacitor/preferences";
import { goto } from "$app/navigation";

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

    if (response.status === 402)
    {
        const refresh = await fetch("https://recipeade.net/login/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "token_type": "refresh_token",
                "token": await getRefreshToken()
            })
        }).then(result => result.json());

        saveAuthTokens(refresh["access_token"], refresh["refresh_token"]);

        tempInit = init ?? {};

        tempInit.headers = {
            ...tempInit.headers,
            "Authorization": `Bearer ${await getAccessToken()}`
        };

        response = await fetch(input, tempInit);
    }

    if (response.status === 402)
    {
        await removeAuthTokens();
        goto("/login?alert");
    }

    return response;
}

export async function saveOnboardingCompleted()
{
    await Preferences.set({
        key: "onboarded",
        value: "true"
    });
}

export async function getIsOnboarded(): Promise<boolean>
{
    return await Preferences.get({
        key: "onboarded"
    }).then(result => result.value === "true");
}

export async function getVoiceGuided(): Promise<boolean>
{
    return await Preferences.get({
        key: "voiceGuided"
    }).then(result => result.value === "true");
}

export async function saveVoiceGuided()
{
    await Preferences.set({
        key: "voiceGuided",
        value: "true"
    });
}
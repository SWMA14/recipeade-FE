import { Preferences } from "@capacitor/preferences";

interface SearchHistory
{
    word: string;
}

export async function getHistory(): Promise<SearchHistory[]>
{
    const result = await Preferences.get({
        key: "searchHistory"
    });

    const a = JSON.parse(result.value ?? "[]") as SearchHistory[];
    console.log(a);

    return a;
}

export async function saveHistory(value: string)
{
    const histories = await getHistory();
    console.log(histories, value);

    await Preferences.set({
        key: "searchHistory",
        value: JSON.stringify([
            {
                word: value
            },
            ...histories
        ])
    });
}

export async function removeHistory(value: string)
{
    const histories = await getHistory();

    await Preferences.set({
        key: "searchHistory",
        value: JSON.stringify(histories.filter(history => history.word !== value))
    });
}

export async function clearHistory()
{
    await Preferences.remove({
        key: "searchHistory"
    });
}
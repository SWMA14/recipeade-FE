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

    return JSON.parse(result.value ?? "[]") as SearchHistory[];
}

export async function saveHistory(value: string)
{
    const histories = await getHistory();
    const rest = histories.some(x => x.word === value) ? histories.filter(x => x.word !== value) : histories;

    await Preferences.set({
        key: "searchHistory",
        value: JSON.stringify([
            {
                word: value
            },
            ...rest
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
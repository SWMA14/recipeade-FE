import { browser } from "$app/environment";
import "$lib/i18n"; //import to init
import { locale, waitLocale } from "svelte-i18n";

export const prerender = true;

export async function load()
{
    if (browser)
        locale.set(window.navigator.language);

    await waitLocale();
}
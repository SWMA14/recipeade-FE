import { quartOut } from "svelte/easing";

export const duration = 150;

export function flyingFade(node: HTMLElement, { delay = 0, easing = quartOut, y = 20, duration = 1000 })
{
    return {
        delay,
        duration,
        easing,
        css: (t: number) => {
            return `
                transform: translateY(${y * (1 - t)}px);
                opacity: ${t};
            `;
        }
    };
}

export function growingFade(node: HTMLElement, { delay = 0, easing = quartOut, width = "100%", leftMargin = "", rightMargin = "", duration = 1000 })
{
    return {
        delay,
        duration,
        easing,
        css: (t: number) => {
            return `
                width: calc(${width} * ${t});
                min-width: calc(${width} * ${t});
                ${leftMargin !== "" ? `margin-left: calc(${leftMargin} * ${t});` : ""}
                ${rightMargin !== "" ? `margin-right: calc(${rightMargin} * ${t});` : ""}
                opacity: ${t};
            `;
        }
    }
}
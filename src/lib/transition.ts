import { quartOut } from "svelte/easing";

export const duration = 150;

export function flyingFade(node: HTMLElement, { delay = 0, easing = quartOut, y = 20, duration = 1000 })
{
    return {
        delay,
        duration,
        css: (t: number) => {
            const eased = easing(t);

            return `
                transform: translateY(${y * (1 - eased)}px);
                opacity: ${eased};
            `;
        }
    };
}

export function growingFade(node: HTMLElement, { delay = 0, easing = quartOut, width = "100%", leftMargin = "", rightMargin = "", duration = 1000 })
{
    return {
        delay,
        duration,
        css: (t: number) => {
            const eased = easing(t);

            return `
                width: calc(${width} * ${eased});
                min-width: calc(${width} * ${eased});
                ${leftMargin !== "" ? `margin-left: calc(${leftMargin} * ${eased});` : ""}
                ${rightMargin !== "" ? `margin-right: calc(${rightMargin} * ${eased});` : ""}
                opacity: ${eased};
            `;
        }
    }
}
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
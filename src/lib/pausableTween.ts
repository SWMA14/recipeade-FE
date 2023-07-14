import { tweened } from "svelte/motion";
import { get } from "svelte/store";

export function pausableTweened(initial: number, options?: any)
{
    const store = tweened(initial, options);
    const { set, subscribe, update } = store;

    let paused = false;
    let lastValue = initial;
    let duration = options.duration;

    return {
        paused,
        subscribe,
        update,
        set: (value: number, opts: any) => {
            paused = false;
            lastValue = value;

            return set(value, opts);
        },
        pause: () => {
            paused = true;

            return set(get(store), { duration: 0 });
        },
        continue: () => {
            paused = false;
            const completed = (get(store) - initial) / (lastValue - initial);
            const remaining = duration * (1 - completed);

            return store.set(lastValue, { duration: remaining })
        }
    };
}
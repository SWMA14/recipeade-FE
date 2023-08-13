import type { ComponentType } from "svelte";

export interface DynamicBarContext
{
    main?: ComponentType;
    mainProps?: object;
    leading?: ComponentType;
    leadingProps?: object;
    trailing?: ComponentType;
    trailingProps?: object;
    isHidden?: boolean;
    isBackgroundShown?: boolean;
}
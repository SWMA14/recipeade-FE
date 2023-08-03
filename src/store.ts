import { writable } from "svelte/store";
import type { YouTubePlayer } from "youtube-player/dist/types";

export const sharedPlayer = writable<YouTubePlayer>();

export const stacks = writable([] as (() => void)[]);
import { writable } from "svelte/store";
import type { YouTubePlayer } from "youtube-player/dist/types";
import type { VideoData } from "$lib/video";

export const surveyedVideos = writable([] as string[]);
export const allVideos = writable([] as VideoData[]);
export const sharedPlayer = writable<YouTubePlayer>();
export const stacks = writable([] as (() => void)[]);
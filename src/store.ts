import { writable } from "svelte/store";
import type { YouTubePlayer } from "youtube-player/dist/types";
import type { VideoData, VideoOverview } from "$lib/video";
import type * as handPose from "@tensorflow-models/handpose";

export const surveyedVideos = writable([] as string[]);
export const savedVideos = writable([] as VideoData[]);
export const allVideos = writable([] as VideoOverview[]);
export const sharedPlayer = writable<YouTubePlayer>();
export const stacks = writable([] as (() => void)[]);
export const assistantThreadID = writable("");
export const assistantRunID = writable("");
export const handModel = writable<handPose.HandPose | null>(null);
export const cookingFullscreen = writable(false);
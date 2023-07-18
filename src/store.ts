import { questions } from "$lib/questions";
import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import type { YouTubePlayer } from "youtube-player/dist/types";

interface StepFeedback
{
    title: string;
    index: number;
    score: number;
};

export const feedbackResult = writable({
    uuid: uuidv4(),
    steps: [] as StepFeedback[],
    overall: Array<number | string>(questions.length).fill(-1)
});

export const sharedPlayer = writable<YouTubePlayer>();
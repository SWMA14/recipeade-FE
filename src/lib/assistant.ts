import { get } from "svelte/store";
import { assistantThreadID, assistantRunID } from "../store";
import { PUBLIC_ASSISTANT_ID, PUBLIC_OPENAI_API_KEY } from "$env/static/public";

export interface AssistantResponse
{
    curatedVideos: string[];
    text: string;
}

export async function createThread()
{
    const result = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${PUBLIC_OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1"
        }
    }).then(response => response.json());
    
    assistantThreadID.set(result["id"]);
    console.log(get(assistantThreadID));
}

export async function deleteThread()
{
    if (get(assistantThreadID) === "")
        return;

    await fetch(`https://api.openai.com/v1/threads/${get(assistantThreadID)}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${PUBLIC_OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1"
        }
    }).then(() => assistantThreadID.set(""));
}

export async function createRun()
{
    if (get(assistantThreadID) === "")
    {
        console.log("no thread found");
        return;
    }

    const result = await fetch(`https://api.openai.com/v1/threads/${get(assistantThreadID)}/runs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${PUBLIC_OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1"
        },
        body: JSON.stringify({
            assistant_id: PUBLIC_ASSISTANT_ID
        })
    }).then(response => response.json());

    assistantRunID.set(result["id"]);
}

export async function startCheckRunInterval(): Promise<AssistantResponse>
{
    if (get(assistantThreadID) === "" || get(assistantRunID) === "")
        throw new Error("Thread or run ID is empty");

    return await new Promise((resolve, reject) => {
        let response = {} as AssistantResponse;

        const interval = setInterval(async () => {
            const result = await fetch(`https://api.openai.com/v1/threads/${get(assistantThreadID)}/runs/${get(assistantRunID)}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${PUBLIC_OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v1"
                }
            }).then(response => response.json());
            
            if (result["status"] === "requires_action")
            {
                console.log("action required")
                console.log(result);
                const toolCalls = result["required_action"]["submit_tool_outputs"]["tool_calls"][0];
                const callID = toolCalls["id"];
                response.curatedVideos = JSON.parse(toolCalls["function"]["arguments"])["ids"] as string[];
                console.log(callID, response.curatedVideos);

                await fetch(`https://api.openai.com/v1/threads/${get(assistantThreadID)}/runs/${get(assistantRunID)}/submit_tool_outputs`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${PUBLIC_OPENAI_API_KEY}`,
                        "OpenAI-Beta": "assistants=v1"
                    },
                    body: JSON.stringify({
                        "tool_outputs": [
                            {
                                "tool_call_id": callID,
                                "output": "success"
                            }
                        ]
                    })
                });
            }
            else if (result["status"] === "completed")
            {
                console.log("completed")
                const messages = await fetch(`https://api.openai.com/v1/threads/${get(assistantThreadID)}/messages`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${PUBLIC_OPENAI_API_KEY}`,
                        "OpenAI-Beta": "assistants=v1"
                    }
                })
                    .then(response => response.json())
                    .then(result => result["data"]);
                response.text = messages[0]["content"][0]["text"]["value"];
                assistantRunID.set("");

                clearInterval(interval);
                resolve(response);
            }
            else if (result["status"] === "failed")
            {
                console.log("failed")
                clearInterval(interval);
                reject();
            }
        }, 10000);
    });
}

export async function sendMessage(content: string)
{
    if (get(assistantThreadID) === "")
    {
        console.log("creating thread")
        await createThread();
    }

    console.log("sending message")
    await fetch(`https://api.openai.com/v1/threads/${get(assistantThreadID)}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${PUBLIC_OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1"
        },
        body: JSON.stringify({
            role: "user",
            content
        })
    });
    console.log("creating run")
    await createRun();

    console.log("starting polling")
    return await startCheckRunInterval();
}
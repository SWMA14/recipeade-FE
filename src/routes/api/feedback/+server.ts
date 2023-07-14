import { json } from "@sveltejs/kit";

export async function POST({ request, platform })
{
    const feedback = await request.json();
    platform!.context.waitUntil(platform!.env.FEEDBACKS.put(feedback.uuid, JSON.stringify({
        steps: feedback.steps,
        overall: feedback.overall
    })));

    return json({
        success: true
    });
}
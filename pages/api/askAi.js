// import necessary modules
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { Configuration, OpenAIApi } from "openai";
import openaiTokenCounter from 'openai-gpt-token-counter';
import rateLimit from '../../utils/rateLimit'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 100, // Max 100 users per second
})
// Create OpenAI instance
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default withIronSessionApiRoute(handler, ironOptions);

async function handler(req, res) {
    // Check if user is logged in
    try {
    await limiter.check(res, 5, 'CACHE_TOKEN', req);
    } catch(e) {
        return res.status(429).json({ error: "I'm overloaded! Try me again in a minute." });
    }

    const user = req.session.user
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    // Ensure this is a POST request
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    // Destructure the title, contents and prompt from the request body
    const { title, contents, prompt, bio } = req.body;
    if(bio) {
        try {
            const messages =  [
                { role: "system", content: "You are a professional bio writer. Write in 1st person, and Only output the finished bio text, NOTHING else." },
                { role: "user", content: `${contents}\n\n Based on the above info, generate a bio for this user with this modification prompt: ${prompt}. Please output just the rewritten \`bio\`, nothing else !` }
            ];
            let model = "gpt-3.5-turbo-0613"
            const tokens = openaiTokenCounter.chat(messages, "gpt-3.5-turbo-0613");
            if(tokens > 4000) {
                model = "gpt-3.5-turbo-0613-16k"
                if(openaiTokenCounter.chat(messages, model) > 8000) {
                    return res.status(200).json({ error: "Your text is too big for the AI!" });
                }
            }

            const chatCompletion = await openai.createChatCompletion({
                model,
                messages
            });

            const gptResponse = chatCompletion.data.choices[0].message;
            if(gptResponse.content.startsWith("Bio: ")) {
                return res.status(200).json({ gptResponse: {content: gptResponse.content.substring(5)} });
            }
            res.status(200).json({ gptResponse });
        } catch (error) {
            console.log(error)
            res.status(200).json({ error: "Failed to process" });
        }
    } else {
    if (!title || !contents) {
        res.status(200).json({ error: "Title or Content is empty!" });
        return;
    }
    if(!prompt) {
        res.status(200).json({ error: "Please enter a prompt" });
        return;
    }

    // Process with GPT-3.5-turbo
    try {
        const messages1 = [
            { role: "system", content: "You are a job/volunteer opportunity writer. Only output the finished text that goes in 'contents', NOTHING else. Please use markdown to style it amazingly." },
            { role: "user", content: `title: ${title}\n contents: ${contents}\n\n Rewrite the above 'contents' with this modification prompt: ${prompt}. Please output just the rewritten \`contents\`, nothing else (not even title)!` }
        ]
        if(openaiTokenCounter.chat(messages1, "gpt-3.5-turbo-0613") > 4000) {
            return res.status(200).json({ error: "Your text is too big for the AI!" });
        }
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-0613",
            messages: messages1,
        });

        const gptResponse = chatCompletion.data.choices[0].message;
        const messages2 = [
            { role: "system", content: "You are a job/volunteer opportunity title writer. Only output the finished title, NOTHING else." },
            { role: "user", content: `contents: ${contents}\n\n Generate a title for the above contents. Please output just the rewritten \`title\`, nothing else (not even title)!` }
        ]
        // Write new title
        const chatCompletion2 = await openai.createChatCompletion({
          model: "gpt-3.5-turbo-0613",
          messages: messages2,
      });

      const gptResponse2 = chatCompletion2.data.choices[0].message;
        res.status(200).json({ gptResponse, gptResponse2 });
    } catch (error) {
        console.log(error)
        res.status(200).json({ error: "Failed to process" });
    }
}

}

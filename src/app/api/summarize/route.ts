import { HfInference } from "@huggingface/inference";
import axios from "axios";
import * as cheerio from "cheerio";

const HF_TOKEN = "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";

function cleanString(input: string): string {
  return input ? input.trim().replace(/^["'.!,?<]|["'.!,?>]$/g, "") : "None";
}

function formatSummary(summary: string): string {
  return summary
    .split("\n")
    .map((line) => line.trim().replace(/^- /, ""))
    .filter((line) => line)
    .join("\n");
}

function cleanReferences(references: string): string[] {
  try {
    const parsedReferences = JSON.parse(references);
    if (Array.isArray(parsedReferences)) {
      return parsedReferences.map((ref) => cleanString(ref));
    } else {
      return [cleanString(references)];
    }
  } catch (error) {
    return [cleanString(references)];
  }
}

const formatResponse = (response: string) => {
  const sections = response.split(
    /\n?\s*(?:\s*(TITLE|SUMMARY|METRICS|REFERENCES|AUTHOR|SENTIMENT)):\s*/i
  );

  // Remove the first empty element resulting from the split
  sections.shift();

  // Combine the sections into pairs of section name and content
  const tokens = [];
  for (let i = 0; i < sections.length; i += 2) {
    tokens.push(sections[i + 1].trim());
  }
  console.log("[Gist.ai Logs] tokens\n", tokens);

  const respTokens = {
    title: tokens[0],
    summary: tokens[1],
    metrics: tokens[2],
    references: tokens[3],
    author: tokens[4],
    sentiment: tokens[5],
  };
  console.log("[Gist.ai Logs] Resp object before cleaning\n", respTokens);

  respTokens.title = cleanString(respTokens.title);
  respTokens.summary = formatSummary(respTokens.summary);
  respTokens.metrics = cleanString(respTokens.metrics);
  respTokens.references = cleanReferences(respTokens.references).join(", ");
  respTokens.author = cleanString(respTokens.author);

  return respTokens;
};

const summarizeText = async (
  title: string,
  content: string
): Promise<string> => {
  const inference = new HfInference(HF_TOKEN);
  try {
    const resp = await inference.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "user",
          content: `Summarize the text delimited by " and strictly follow the following instructions:
        1. Extract the title - Refer to as TITLE
        2. Summarize the text - Refer to as SUMMARY. Provide a summary in no less then 10 sentences and no more than 15 sentences.
        3. Extract all important quantative metrics and its context - Refer to as METRICS. Return None if no metrics are found. Provide the metrics as full sentences in a list of strings. The metrics should have numeric values to support them
        4. Extract the references links - Refer to as REFERENCES. Return None if no references are found.
        5. Extract the author - Refer to as AUTHOR
        6. Identify the sentiment of the text using Polarity-Based Sentiment Analysis - Refer to as SENTIMENT.
        7. Return a response string containing TITLE, SUMMARY, METRICS, REFERENCES, AUTHOR and SENTIMENT delimitted by "\n\n"
        Do not include titles for each section

        "
        ${title}
        ${content}
        "`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.2,
    });

    return resp.choices[0].message.content ?? "";
  } catch (error) {
    throw error;
  }
};

export async function POST(request: Request) {
  const reqParams = await request.json();
  const { url } = reqParams;

  if (!url) {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $("title").text() || "No title found";
    const content = $("p")
      .map((_, el) => $(el).text())
      .get()
      .join(" ");

    const summaryResponse = await summarizeText(title, content);
    const formattedResp = formatResponse(summaryResponse);

    return Response.json({ response: formattedResp }, { status: 200 });
  } catch (error) {
    console.log("Error", error);
    return Response.json({}, { status: 400 });
  }
}

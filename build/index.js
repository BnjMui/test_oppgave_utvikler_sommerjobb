import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from 'dotenv';
// Load environment variables if present
dotenv.config();
const braveApiKey = process.env.BRAVE_API_KEY ?? "";
// API functions
const braveApiBaseUrl = "https://api.search.brave.com/res/v1/web/search";
const search = async (apiKey, query) => {
    const searchParams = new URLSearchParams({
        q: query,
        result_filter: "web",
        count: "10",
    });
    try {
        const response = await fetch(`${braveApiBaseUrl}?${searchParams.toString()}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Accept-Encoding": "gzip",
                "x-subscription-token": apiKey,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching data from Brave API:", error);
        return null;
    }
};
// Api formatting
const formatSearchResults = (results) => {
    const formattedResults = results.map((result) => {
        return `Title: ${result.title}\nURL: ${result.url}\nDescription: ${result.description}\nMetaURL: ${result.meta_url}\nLanguage: ${result.language}\n`;
    });
    return formattedResults.join("\n\n") ?? "No results found";
};
// MCP Server
const server = new McpServer({
    name: "brave-search",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// Server tool
server.tool("brave-search", "Search the web using Brave Search", {
    query: z.string().min(1, "Query must not be empty").max(400, "Query must not be longer than 100 characters").refine((val) => val.split(" ").length <= 50, "Query must not contain more than 10 words"),
}, async ({ query }) => {
    const searchResults = await search(braveApiKey, query);
    if (!searchResults) {
        return {
            content: [
                {
                    type: "text",
                    text: "Failed to retrieve search results",
                }
            ]
        };
    }
    const results = searchResults.web.results;
    const formattedResults = results.length > 0 ? formatSearchResults(results) : "No results found";
    return {
        content: [
            {
                type: "text",
                text: formattedResults,
            }
        ]
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Server is running on Stdio");
}
main().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
});

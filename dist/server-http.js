#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { tools, toolsByName } from './tools.js';
import { serverPath, serverPort } from './config.js';
const app = express();
app.use(cors());
app.use((req, res, next) => {
    console.log(`[Incoming Request] ${req.method} ${req.path}`);
    next();
});
app.use(express.json({ limit: '1mb' }));
const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    enableDnsRebindingProtection: true,
});
const server = new Server({
    name: 'episode-manager-mcp',
    version: '1.0.0',
}, {
    capabilities: { tools: {} },
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.log('Received ListToolsRequest');
    return {
        tools: tools.map(({ name, description, inputSchema }) => ({
            name,
            description,
            inputSchema,
        })),
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    console.log(`Received CallToolRequest for: ${name}`);
    const tool = toolsByName.get(name);
    if (!tool) {
        return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
        };
    }
    return tool.execute(args);
});
async function main() {
    await server.connect(transport);
    app.all(serverPath, async (req, res) => {
        try {
            await transport.handleRequest(req, res, req.body);
        }
        catch (error) {
            console.error('Transport error', error);
            res.status(500).json({ error: 'Transport error', message: String(error) });
        }
    });
    app.listen(serverPort, '0.0.0.0', () => {
        console.error(`Episode Manager MCP listening at http://0.0.0.0:${serverPort}${serverPath}`);
        console.error(`If using Docker n8n, use URL: http://host.docker.internal:${serverPort}${serverPath}`);
    });
}
main().catch((error) => {
    console.error('Failed to start HTTP MCP server', error);
    process.exit(1);
});
//# sourceMappingURL=server-http.js.map
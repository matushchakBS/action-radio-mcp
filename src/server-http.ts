#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools, toolsByName } from './tools.js';
// We will override these manually below to ensure connectivity
import { serverPath, serverPort } from './config.js';
import { captureHostFromRequest } from './dynamicConfig.js';

const app = express();
app.use(cors());

// --- DEBUG LOGGING ---
// This will print every request hitting the server.
// If n8n clicks fail and you see nothing here, it's a wrong Port or IP.
app.use((req, res, next) => {
    console.log(`[Incoming Request] ${req.method} ${req.path}`);
    // Capture the host from the first request
    captureHostFromRequest(req);
    next();
});

app.use(express.json({ limit: '1mb' }));

const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    enableDnsRebindingProtection: true,
});

const server = new Server(
    {
        name: 'episode-manager-mcp',
        version: '1.0.0',
    },
    {
        capabilities: { tools: {} },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.log('Received ListToolsRequest'); // Debug log
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
    console.log(`Received CallToolRequest for: ${name}`); // Debug log

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
            // Pass the already parsed body to the transport
            await transport.handleRequest(req, res, req.body);
        } catch (error) {
            console.error('Transport error', error);
            res.status(500).json({ error: 'Transport error', message: String(error) });
        }
    });

    // LISTEN ON 0.0.0.0 to accept connections from Docker/Network
    app.listen(serverPort, '0.0.0.0', () => {
        console.error(`Episode Manager MCP listening at http://0.0.0.0:${serverPort}${serverPath}`);
        console.error(`If using Docker n8n, use URL: http://host.docker.internal:${serverPort}${serverPath}`);
    });
}

main().catch((error) => {
    console.error('Failed to start HTTP MCP server', error);
    process.exit(1);
});

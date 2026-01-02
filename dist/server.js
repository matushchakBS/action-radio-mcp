#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { tools, toolsByName } from './tools.js';
const server = new Server({
    name: 'episode-manager-mcp',
    version: '1.0.0',
}, {
    capabilities: { tools: {} },
});
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map(({ name, description, inputSchema }) => ({
        name,
        description,
        inputSchema,
    })),
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = toolsByName.get(name);
    if (!tool) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Unknown tool: ${name}`,
                },
            ],
            isError: true,
        };
    }
    return tool.execute(args);
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    const executablePath = path.resolve(fileURLToPath(import.meta.url));
    console.error(`Episode Manager MCP server running over stdio (no network URL). Launch command: node ${executablePath}`);
}
main().catch((error) => {
    console.error('Failed to start Episode Manager MCP server', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map
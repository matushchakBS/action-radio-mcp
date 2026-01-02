#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
const serverUrl = process.env.MCP_TEST_URL ?? 'http://localhost:1088/mcp';
async function main() {
    console.log(`Connecting to MCP server at ${serverUrl}`);
    const transport = new StreamableHTTPClientTransport(new URL(serverUrl));
    const client = new Client({ name: 'episode-manager-mcp-client', version: '0.0.1' });
    await client.connect(transport);
    console.log('Connected');
    const toolsList = await client.listTools({});
    console.log('tools/list ->', JSON.stringify(toolsList.tools, null, 2));
    const health = await client.callTool({ name: 'health', arguments: {} });
    console.log('tools/call health ->', JSON.stringify(health, null, 2));
    await transport.close();
}
main().catch((error) => {
    console.error('HTTP MCP test failed:', error);
    process.exit(1);
});
//# sourceMappingURL=test-http.js.map
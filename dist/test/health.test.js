#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
const serverUrl = process.env.MCP_TEST_URL ?? 'http://localhost:1088/mcp';
async function main() {
    console.log(`\n🏥 Testing Health & Connection at ${serverUrl}\n`);
    const transport = new StreamableHTTPClientTransport(new URL(serverUrl));
    const client = new Client({ name: 'health-test-client', version: '0.0.1' });
    try {
        await client.connect(transport);
        console.log('✅ Connected to MCP server');
        console.log('\n📋 Test 1: List All Tools');
        const toolsList = await client.listTools({});
        console.log(`Found ${toolsList.tools.length} tools:`);
        toolsList.tools.forEach(tool => {
            console.log(`  - ${tool.name}: ${tool.description}`);
        });
        console.log('✅ Tools list passed\n');
        console.log('🏥 Test 2: Health Check');
        const health = await client.callTool({ name: 'health', arguments: {} });
        console.log('Result:', JSON.stringify(health, null, 2));
        console.log('✅ Health check passed\n');
        console.log('🎉 All Health Tests Completed Successfully!');
    }
    catch (error) {
        console.error('❌ Health test failed:', error);
        process.exit(1);
    }
    finally {
        await transport.close();
    }
}
main().catch((error) => {
    console.error('❌ Health MCP test failed:', error);
    process.exit(1);
});
//# sourceMappingURL=health.test.js.map
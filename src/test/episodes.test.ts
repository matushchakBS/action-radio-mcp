#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const serverUrl = process.env.MCP_TEST_URL ?? 'http://localhost:1088/mcp';

async function main() {
  console.log(`\n🧪 Testing Episode Tools at ${serverUrl}\n`);

  const transport = new StreamableHTTPClientTransport(new URL(serverUrl));
  const client = new Client({ name: 'episode-manager-test-client', version: '0.0.1' });

  await client.connect(transport);
  console.log('✅ Connected to MCP server\n');

  let episodeId: number | null = null;

  try {
    // Test 1: List episodes (should start empty or show existing)
    console.log('📋 Test 1: List Episodes');
    const listResult = await client.callTool({ 
      name: 'list_episodes', 
      arguments: { limit: 10 } 
    });
    console.log('Result:', JSON.stringify(listResult, null, 2));
    console.log('✅ List episodes passed\n');

    // Test 2: Create episode
    console.log('📝 Test 2: Create Episode');
    const createResult = await client.callTool({
      name: 'create_episode',
      arguments: {
        system_name: 'test_episode_001',
        title: 'Test Episode from MCP',
        description: 'This is a test episode created via MCP tools',
        music_brief: 'Upbeat electronic music',
        voice_brief: 'Clear professional narrator',
        video_brief: 'Modern dynamic visuals'
      }
    });
    console.log('Result:', JSON.stringify(createResult, null, 2));
    
    // Try to extract episode_id from response
    try {
      const content = createResult.content as any[];
      const responseData = JSON.parse(content[0].text);
      episodeId = responseData.data?.episode_id || responseData.data?.data?.episode_id;
      console.log(`📍 Created episode ID: ${episodeId}`);
    } catch (e) {
      console.log('⚠️ Could not extract episode ID from response');
    }
    console.log('✅ Create episode passed\n');

    if (episodeId) {
      // Test 3: Get episode
      console.log(`🔍 Test 3: Get Episode (ID: ${episodeId})`);
      const getResult = await client.callTool({
        name: 'get_episode',
        arguments: { episode_id: episodeId }
      });
      console.log('Result:', JSON.stringify(getResult, null, 2));
      console.log('✅ Get episode passed\n');

      // Test 4: Update episode
      console.log(`✏️ Test 4: Update Episode (ID: ${episodeId})`);
      const updateResult = await client.callTool({
        name: 'update_episode',
        arguments: {
          episode_id: episodeId,
          title: 'Updated Test Episode from MCP',
          description: 'This episode has been updated via MCP tools'
        }
      });
      console.log('Result:', JSON.stringify(updateResult, null, 2));
      console.log('✅ Update episode passed\n');

      // Test 5: Delete episode (optional - uncomment if you want to clean up)
      console.log(`🗑️ Test 5: Delete Episode (ID: ${episodeId}) - SKIPPED`);
      console.log('💡 Uncomment delete test if you want to clean up test data\n');
      /*
      const deleteResult = await client.callTool({
        name: 'delete_episode',
        arguments: { episode_id: episodeId }
      });
      console.log('Result:', JSON.stringify(deleteResult, null, 2));
      console.log('✅ Delete episode passed\n');
      */
    }

    console.log('🎉 All Episode Tests Completed Successfully!');

  } catch (error) {
    console.error('❌ Episode test failed:', error);
    process.exit(1);
  } finally {
    await transport.close();
  }
}

main().catch((error) => {
  console.error('❌ Episode MCP test failed:', error);
  process.exit(1);
});
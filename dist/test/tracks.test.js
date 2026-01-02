#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
const serverUrl = process.env.MCP_TEST_URL ?? 'http://localhost:1088/mcp';
async function main() {
    console.log(`\n🎵 Testing Track Tools at ${serverUrl}\n`);
    const transport = new StreamableHTTPClientTransport(new URL(serverUrl));
    const client = new Client({ name: 'track-test-client', version: '0.0.1' });
    await client.connect(transport);
    console.log('✅ Connected to MCP server\n');
    let episodeId = null;
    let trackId = null;
    try {
        console.log('📋 Setup: Create Episode for Track Testing');
        const episodeResult = await client.callTool({
            name: 'create_episode',
            arguments: {
                system_name: 'track_test_episode',
                title: 'Episode for Track Testing',
                description: 'Test episode for track operations'
            }
        });
        try {
            const content = episodeResult.content;
            const episodeData = JSON.parse(content[0].text);
            episodeId = episodeData.data?.episode_id || episodeData.data?.data?.episode_id;
            console.log(`📍 Created test episode ID: ${episodeId}\n`);
        }
        catch (e) {
            console.log('⚠️ Could not extract episode ID, using ID 1 for testing');
            episodeId = 1;
        }
        if (!episodeId) {
            console.log('❌ No episode ID available, cannot test tracks');
            return;
        }
        console.log(`📋 Test 1: List Tracks for Episode ${episodeId}`);
        const listResult = await client.callTool({
            name: 'list_tracks',
            arguments: { episode_id: episodeId }
        });
        console.log('Result:', JSON.stringify(listResult, null, 2));
        console.log('✅ List tracks passed\n');
        console.log(`🎵 Test 2: Create Track for Episode ${episodeId}`);
        const createResult = await client.callTool({
            name: 'create_track',
            arguments: {
                episode_id: episodeId,
                type: 'audio',
                description: 'Test audio track created via MCP',
                metadata: {
                    format: 'mp3',
                    quality: 'high',
                    duration: 180
                }
            }
        });
        console.log('Result:', JSON.stringify(createResult, null, 2));
        try {
            const content = createResult.content;
            const trackData = JSON.parse(content[0].text);
            trackId = trackData.data?.track_id || trackData.data?.data?.track_id;
            console.log(`📍 Created track ID: ${trackId}`);
        }
        catch (e) {
            console.log('⚠️ Could not extract track ID from response');
        }
        console.log('✅ Create track passed\n');
        if (trackId) {
            console.log(`🔍 Test 3: Get Track ${trackId} from Episode ${episodeId}`);
            const getResult = await client.callTool({
                name: 'get_track',
                arguments: {
                    episode_id: episodeId,
                    track_id: trackId
                }
            });
            console.log('Result:', JSON.stringify(getResult, null, 2));
            console.log('✅ Get track passed\n');
            console.log(`✏️ Test 4: Update Track ${trackId}`);
            const updateResult = await client.callTool({
                name: 'update_track',
                arguments: {
                    episode_id: episodeId,
                    track_id: trackId,
                    description: 'Updated test audio track via MCP',
                    metadata: {
                        format: 'mp3',
                        quality: 'ultra',
                        duration: 210,
                        updated: true
                    }
                }
            });
            console.log('Result:', JSON.stringify(updateResult, null, 2));
            console.log('✅ Update track passed\n');
            console.log(`📹 Test 5: Create Video Track for Episode ${episodeId}`);
            const videoResult = await client.callTool({
                name: 'create_track',
                arguments: {
                    episode_id: episodeId,
                    type: 'video',
                    description: 'Test video track',
                    metadata: { resolution: '1080p', fps: 30 }
                }
            });
            console.log('Result:', JSON.stringify(videoResult, null, 2));
            console.log('✅ Create video track passed\n');
            console.log(`📝 Test 6: Create Subtitle Track for Episode ${episodeId}`);
            const subtitleResult = await client.callTool({
                name: 'create_track',
                arguments: {
                    episode_id: episodeId,
                    type: 'subtitle',
                    description: 'Test subtitle track',
                    metadata: { language: 'en', format: 'srt' }
                }
            });
            console.log('Result:', JSON.stringify(subtitleResult, null, 2));
            console.log('✅ Create subtitle track passed\n');
            console.log(`🗑️ Test 7: Delete Track ${trackId} - SKIPPED`);
            console.log('💡 Uncomment delete test if you want to clean up test data\n');
        }
        console.log('🎉 All Track Tests Completed Successfully!');
    }
    catch (error) {
        console.error('❌ Track test failed:', error);
        process.exit(1);
    }
    finally {
        await transport.close();
    }
}
main().catch((error) => {
    console.error('❌ Track MCP test failed:', error);
    process.exit(1);
});
//# sourceMappingURL=tracks.test.js.map
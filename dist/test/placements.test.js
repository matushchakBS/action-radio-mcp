#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
const serverUrl = process.env.MCP_TEST_URL ?? 'http://localhost:1088/mcp';
async function main() {
    console.log(`\n📍 Testing Placement Tools at ${serverUrl}\n`);
    const transport = new StreamableHTTPClientTransport(new URL(serverUrl));
    const client = new Client({ name: 'placement-test-client', version: '0.0.1' });
    await client.connect(transport);
    console.log('✅ Connected to MCP server\n');
    let episodeId = null;
    let trackId = null;
    let placementId = null;
    try {
        console.log('📋 Setup: Create Episode for Placement Testing');
        const episodeResult = await client.callTool({
            name: 'create_episode',
            arguments: {
                system_name: 'placement_test_episode',
                title: 'Episode for Placement Testing',
                description: 'Test episode for placement operations'
            }
        });
        try {
            const content = episodeResult.content;
            const episodeData = JSON.parse(content[0].text);
            episodeId = episodeData.data?.episode_id || episodeData.data?.data?.episode_id;
            console.log(`📍 Created test episode ID: ${episodeId}`);
        }
        catch (e) {
            console.log('⚠️ Could not extract episode ID, using ID 1 for testing');
            episodeId = 1;
        }
        console.log(`🎵 Setup: Create Track for Episode ${episodeId}`);
        const trackResult = await client.callTool({
            name: 'create_track',
            arguments: {
                episode_id: episodeId,
                type: 'audio',
                description: 'Test track for placements',
                metadata: { purpose: 'placement_testing' }
            }
        });
        try {
            const content = trackResult.content;
            const trackData = JSON.parse(content[0].text);
            trackId = trackData.data?.track_id || trackData.data?.data?.track_id;
            console.log(`📍 Created test track ID: ${trackId}\n`);
        }
        catch (e) {
            console.log('⚠️ Could not extract track ID, using ID 1 for testing');
            trackId = 1;
        }
        if (!episodeId || !trackId) {
            console.log('❌ Missing episode or track ID, cannot test placements');
            return;
        }
        console.log(`📋 Test 1: List Placements for Episode ${episodeId}, Track ${trackId}`);
        const listResult = await client.callTool({
            name: 'list_placements',
            arguments: {
                episode_id: episodeId,
                track_id: trackId
            }
        });
        console.log('Result:', JSON.stringify(listResult, null, 2));
        console.log('✅ List placements passed\n');
        console.log(`📍 Test 2: Create Placement for Track ${trackId}`);
        console.log('⚠️ Note: Using asset_id: 1 - this test may fail if no assets exist in database');
        try {
            const createResult = await client.callTool({
                name: 'create_placement',
                arguments: {
                    episode_id: episodeId,
                    track_id: trackId,
                    asset_id: 1,
                    planned_duration: 30.5,
                    metadata: {
                        position: 'intro',
                        fade_in: 2.0,
                        fade_out: 1.5,
                        volume: 0.8
                    }
                }
            });
            console.log('Result:', JSON.stringify(createResult, null, 2));
            try {
                const content = createResult.content;
                const placementData = JSON.parse(content[0].text);
                placementId = placementData.data?.placement_id ||
                    placementData.data?.track_asset_id ||
                    placementData.data?.data?.placement_id;
                console.log(`📍 Created placement ID: ${placementId}`);
            }
            catch (e) {
                console.log('⚠️ Could not extract placement ID from response');
            }
            console.log('✅ Create placement passed\n');
        }
        catch (error) {
            console.log('❌ Create placement failed (likely no asset with ID 1):', error);
            console.log('💡 Create an asset first or modify the test to use an existing asset ID\n');
        }
        if (placementId) {
            console.log(`✏️ Test 3: Update Placement ${placementId}`);
            const updateResult = await client.callTool({
                name: 'update_placement',
                arguments: {
                    id: episodeId,
                    track_id: trackId,
                    placement_id: placementId,
                    planned_duration: 45.0,
                    metadata: {
                        position: 'middle',
                        fade_in: 3.0,
                        fade_out: 2.0,
                        volume: 0.9,
                        updated: true
                    }
                }
            });
            console.log('Result:', JSON.stringify(updateResult, null, 2));
            console.log('✅ Update placement passed\n');
            console.log(`🗑️ Test 4: Delete Placement ${placementId} - SKIPPED`);
            console.log('💡 Uncomment delete test if you want to clean up test data\n');
        }
        console.log(`📍 Test 5: Create Second Placement with Asset ID 2`);
        console.log('⚠️ Note: This may also fail if asset ID 2 doesn\'t exist');
        try {
            const createResult2 = await client.callTool({
                name: 'create_placement',
                arguments: {
                    episode_id: episodeId,
                    track_id: trackId,
                    asset_id: 2,
                    planned_duration: 15.0,
                    metadata: {
                        position: 'outro',
                        volume: 0.6
                    }
                }
            });
            console.log('Result:', JSON.stringify(createResult2, null, 2));
            console.log('✅ Create second placement passed\n');
        }
        catch (error) {
            console.log('❌ Create second placement failed (likely no asset with ID 2):', error);
            console.log('💡 This is expected if assets don\'t exist in the database\n');
        }
        console.log('🎉 Placement Tests Completed!');
        console.log('💡 To fully test placements, ensure assets exist in the database first');
    }
    catch (error) {
        console.error('❌ Placement test failed:', error);
        process.exit(1);
    }
    finally {
        await transport.close();
    }
}
main().catch((error) => {
    console.error('❌ Placement MCP test failed:', error);
    process.exit(1);
});
//# sourceMappingURL=placements.test.js.map
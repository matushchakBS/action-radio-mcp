# MCP Tools Test Suite

Comprehensive tests for all Episode Manager MCP tools, covering Episodes, Tracks, and Placements.

## Prerequisites

1. **Start the Laravel API** (must be running first):
   ```bash
   # In the main project directory
   docker-compose up -d
   # Or if running locally: php artisan serve
   ```

2. **Start the MCP Server**:
   ```bash
   npm run start:http
   # Server will run on http://localhost:1088/mcp
   ```

3. **Build the MCP tools** (if not done already):
   ```bash
   npm run build
   ```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Individual Test Suites
```bash
# Health check and connection test
npm run test:health

# Episode CRUD operations
npm run test:episodes

# Track management tests
npm run test:tracks

# Placement operations tests  
npm run test:placements
```

### Custom Test URL
```bash
# Use a different MCP server URL
MCP_TEST_URL=http://localhost:3001/mcp npm test
```

## Test Structure

### 🏥 Health Tests (`health.test.ts`)
- MCP server connection
- Tool listing
- Basic health check

### 📺 Episode Tests (`episodes.test.ts`)
- List episodes
- Create episode
- Get episode details
- Update episode
- Delete episode (commented out by default)

### 🎵 Track Tests (`tracks.test.ts`)
- Create test episode first
- List tracks for episode
- Create audio/video/subtitle tracks
- Get track details
- Update track metadata
- Delete track (commented out by default)

### 📍 Placement Tests (`placements.test.ts`)
- Create test episode and track
- List placements
- Create placements (requires existing assets)
- Update placement metadata
- Delete placement (commented out by default)

## Test Data Management

### Cleanup
By default, delete operations are **commented out** to preserve test data for inspection. Uncomment delete tests in each file if you want automatic cleanup.

### Asset Dependencies
Placement tests require existing assets in the database. If you get "asset not found" errors:

1. Create assets through the API first
2. Update the test files with valid asset IDs
3. Or create asset management tools

## Expected Output

Each test provides detailed, color-coded output:
- ✅ Successful operations
- ❌ Failed operations  
- ⚠️ Warnings (expected failures)
- 💡 Helpful tips

Example output:
```
🧪 Testing Episode Tools at http://localhost:1088/mcp

✅ Connected to MCP server

📋 Test 1: List Episodes
Result: {...}
✅ List episodes passed

📝 Test 2: Create Episode  
📍 Created episode ID: 123
✅ Create episode passed

🎉 All Episode Tests Completed Successfully!
```

## Troubleshooting

### "Connection refused"
- Ensure MCP server is running: `npm run start:http`
- Check the server URL (default: `http://localhost:1088/mcp`)

### "Laravel API errors"
- Ensure Docker containers are running: `docker-compose ps`
- Check Laravel API health: `curl http://localhost:1091/api/compile/health`

### "Asset not found" (Placements)
- Create assets first or update test with valid asset IDs
- This is expected if no assets exist in the database

### "Episode/Track not found"
- Tests create their own test data
- If IDs can't be extracted, they fallback to ID 1
- Ensure episode/track creation tests pass first

## Adding New Tests

1. Create new test file: `new-feature.test.ts`
2. Follow the pattern from existing tests
3. Add to `run-tests.ts` test array
4. Add npm script to `package.json`
5. Update this README

Each test should be self-contained and handle its own setup/teardown.
#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tests = [
  { name: 'health', file: 'health.test.ts', description: 'Health check and connection' },
  { name: 'episodes', file: 'episodes.test.ts', description: 'Episode CRUD operations' },
  { name: 'tracks', file: 'tracks.test.ts', description: 'Track management' },
  { name: 'placements', file: 'placements.test.ts', description: 'Placement operations' },
  { name: 'assets', file: 'assets.test.ts', description: 'Asset template management' },
  { name: 'variants', file: 'variants.test.ts', description: 'Asset variant management' },
];

async function runTest(testFile: string): Promise<boolean> {
  try {
    const testPath = path.join(__dirname, testFile);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 Running: ${testFile}`);
    console.log(`${'='.repeat(60)}`);
    
    const { stdout, stderr } = await execAsync(`npx tsx "${testPath}"`, {
      cwd: path.join(__dirname, '../../..') // Go back to mcp root
    });
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    return true;
  } catch (error: any) {
    console.error(`❌ Test ${testFile} failed:`, error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const testName = args[0];

  console.log('🧪 MCP Tools Test Runner\n');

  if (testName === '--help' || testName === '-h') {
    console.log('Usage:');
    console.log('  npm run test              # Run all tests');
    console.log('  npm run test <test-name>  # Run specific test\n');
    console.log('Available tests:');
    tests.forEach(test => {
      console.log(`  ${test.name.padEnd(12)} - ${test.description}`);
    });
    return;
  }

  // Check if server is running
  console.log('🔍 Checking if MCP server is running...');
  try {
    const serverUrl = process.env.MCP_TEST_URL ?? 'http://localhost:1088/mcp';
    const response = await fetch(serverUrl);
    console.log('✅ MCP server is responsive\n');
  } catch (error) {
    console.log('❌ MCP server is not running or not accessible');
    console.log('💡 Make sure to start the MCP server first: npm start\n');
    process.exit(1);
  }

  let testsToRun = tests;
  
  // If specific test name provided, filter to that test
  if (testName) {
    const test = tests.find(t => t.name === testName);
    if (!test) {
      console.log(`❌ Test '${testName}' not found.`);
      console.log('Available tests:', tests.map(t => t.name).join(', '));
      process.exit(1);
    }
    testsToRun = [test];
  }

  let passed = 0;
  let failed = 0;

  for (const test of testsToRun) {
    const success = await runTest(test.file);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Test Results Summary`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${passed + failed}`);

  if (failed > 0) {
    console.log(`\n💡 Some tests failed. Check the logs above for details.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 All tests passed successfully!`);
  }
}

main().catch((error) => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
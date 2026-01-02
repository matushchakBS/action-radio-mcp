// Import all tool definitions
import healthTool from './health/check.js';
import listEpisodesTool from './episodes/list.js';
import createEpisodeTool from './episodes/create.js';

// Export all tools and create lookup map
export const tools = [
  healthTool,
  listEpisodesTool,
  createEpisodeTool,
];

export const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));

// Export individual tools for direct access
export { healthTool, listEpisodesTool, createEpisodeTool };

// Re-export types and factory for convenience
export type { ToolDefinition, ToolExecutor, HttpToolSpec } from './factory.js';
export { createHttpTool } from './factory.js';
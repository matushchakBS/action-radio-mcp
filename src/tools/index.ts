// Import all tool definitions
import healthTool from './health/check.js';

// Episode tools
import listEpisodesTool from './episodes/list.js';
import createEpisodeTool from './episodes/create.js';
import getEpisodeTool from './episodes/get.js';
import updateEpisodeTool from './episodes/update.js';
import deleteEpisodeTool from './episodes/delete.js';

// Track tools
import listTracksTool from './tracks/list.js';
import createTrackTool from './tracks/create.js';
import getTrackTool from './tracks/get.js';
import updateTrackTool from './tracks/update.js';
import deleteTrackTool from './tracks/delete.js';

// Placement tools
import listPlacementsTool from './placements/list.js';
import createPlacementTool from './placements/create.js';
import updatePlacementTool from './placements/update.js';
import deletePlacementTool from './placements/delete.js';

// Export all tools and create lookup map
export const tools = [
  healthTool,
  
  // Episode tools
  listEpisodesTool,
  createEpisodeTool,
  getEpisodeTool,
  updateEpisodeTool,
  deleteEpisodeTool,
  
  // Track tools
  listTracksTool,
  createTrackTool,
  getTrackTool,
  updateTrackTool,
  deleteTrackTool,
  
  // Placement tools
  listPlacementsTool,
  createPlacementTool,
  updatePlacementTool,
  deletePlacementTool,
];

export const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));

// Export individual tools for direct access
export { 
  healthTool,
  
  // Episode tools
  listEpisodesTool, 
  createEpisodeTool,
  getEpisodeTool,
  updateEpisodeTool,
  deleteEpisodeTool,
  
  // Track tools
  listTracksTool,
  createTrackTool,
  getTrackTool,
  updateTrackTool,
  deleteTrackTool,
  
  // Placement tools
  listPlacementsTool,
  createPlacementTool,
  updatePlacementTool,
  deletePlacementTool,
};

// Re-export types and factory for convenience
export type { ToolDefinition, ToolExecutor, HttpToolSpec } from './factory.js';
export { createHttpTool } from './factory.js';
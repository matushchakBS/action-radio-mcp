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

// Asset tools
import listAssetsTool from './assets/list.js';
import createAssetTool from './assets/create.js';
import getAssetTool from './assets/get.js';
import updateAssetTool from './assets/update.js';
import deleteAssetTool from './assets/delete.js';
import approveAssetTool from './assets/approve.js';

// Variant tools
import listVariantsTool from './variants/list.js';
import createVariantTool from './variants/create.js';
import updateVariantTool from './variants/update.js';
import deleteVariantTool from './variants/delete.js';
import approveVariantTool from './variants/approve.js';

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
  
  // Asset tools
  listAssetsTool,
  createAssetTool,
  getAssetTool,
  updateAssetTool,
  deleteAssetTool,
  approveAssetTool,
  
  // Variant tools
  listVariantsTool,
  createVariantTool,
  updateVariantTool,
  deleteVariantTool,
  approveVariantTool,
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
  
  // Asset tools
  listAssetsTool,
  createAssetTool,
  getAssetTool,
  updateAssetTool,
  deleteAssetTool,
  approveAssetTool,
  
  // Variant tools
  listVariantsTool,
  createVariantTool,
  updateVariantTool,
  deleteVariantTool,
  approveVariantTool,
};

// Re-export types and factory for convenience
export type { ToolDefinition, ToolExecutor, HttpToolSpec } from './factory.js';
export { createHttpTool } from './factory.js';
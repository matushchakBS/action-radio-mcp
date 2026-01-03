import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface ApproveAssetInput {
  id: number;
  approval_status: 'approved' | 'rejected';
  approval_comment?: string;
}

export interface ApproveAssetOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'approve_asset',
  description: 'Approve or reject asset template',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the asset to approve/reject',
        minimum: 1,
      },
      approval_status: {
        type: 'string',
        description: 'Approval status to set',
        enum: ['approved', 'rejected'],
      },
      approval_comment: {
        type: 'string',
        description: 'Optional comment for the approval decision',
      },
    },
    required: ['id', 'approval_status'],
    additionalProperties: false,
  },

  method: 'PATCH' as const,
  path: '/assets/{id}/approve',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: ApproveAssetInput }): ApproveAssetOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: ApproveAssetInput }): ApproveAssetOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: ApproveAssetOutput) => !output.ok,
  
  successText: 'Asset approval status updated successfully',
  errorText: 'Failed to update asset approval status',
};

export default createHttpTool<ApproveAssetInput, ApproveAssetOutput>(spec);
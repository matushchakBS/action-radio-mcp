import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface ApproveVariantInput {
  id: number;
  status: 'approved' | 'rejected';
  review_notes?: string;
}

export interface ApproveVariantOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'approve_variant',
  description: 'Approve or reject asset variant',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the variant to approve/reject',
        minimum: 1,
      },
      status: {
        type: 'string',
        description: 'Approval status to set',
        enum: ['approved', 'rejected'],
      },
      review_notes: {
        type: 'string',
        description: 'Optional review notes for the approval decision',
      },
    },
    required: ['id', 'status'],
    additionalProperties: false,
  },

  method: 'PUT' as const,
  path: '/variants/{id}/approval',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: ApproveVariantInput }): ApproveVariantOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: ApproveVariantInput }): ApproveVariantOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: ApproveVariantOutput) => !output.ok,
  
  successText: 'Variant approval status updated successfully',
  errorText: 'Failed to update variant approval status',
};

export default createHttpTool<ApproveVariantInput, ApproveVariantOutput>(spec);
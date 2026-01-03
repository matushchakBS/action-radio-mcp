import { api } from '../httpClient.js';
import { toolsByName } from '../tools/index.js';

const MCP_SERVER_URL = 'http://127.0.0.1:3001';

interface TestAsset {
  id?: number;
  format: 'audio' | 'video' | 'image' | 'text';
  kind: 'music' | 'voice' | 'video' | 'thumbnail' | 'subtitle';
  spec_text: string;
  meta_json?: Record<string, any>;
}

describe('Asset Management Tools', () => {
  let testAssetId: number | null = null;

  afterEach(async () => {
    if (testAssetId) {
      try {
        const deleteAssetTool = toolsByName.get('delete_asset');
        if (deleteAssetTool) {
          await deleteAssetTool.execute({ id: testAssetId });
        }
      } catch (error) {
        console.warn(`Failed to cleanup test asset ${testAssetId}:`, error);
      }
      testAssetId = null;
    }
  });

  describe('list_assets', () => {
    it('should list assets successfully', async () => {
      const listAssetsTool = toolsByName.get('list_assets');
      expect(listAssetsTool).toBeDefined();

      const result = await listAssetsTool!.execute({});
      expect(result.isError).toBe(false);
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const content = JSON.parse(result.content[0].text as string);
      expect(content.ok).toBe(true);
      expect(content).toHaveProperty('timestamp');
      expect(content).toHaveProperty('data');
    });

    it('should list assets with filters', async () => {
      const listAssetsTool = toolsByName.get('list_assets');
      expect(listAssetsTool).toBeDefined();

      const result = await listAssetsTool!.execute({
        format: 'audio',
        kind: 'music',
        approval_status: 'draft'
      });
      expect(result.isError).toBe(false);
      
      const content = JSON.parse(result.content[0].text as string);
      expect(content.ok).toBe(true);
    });
  });

  describe('create_asset', () => {
    it('should create asset successfully', async () => {
      const createAssetTool = toolsByName.get('create_asset');
      expect(createAssetTool).toBeDefined();

      const testAsset: TestAsset = {
        format: 'audio',
        kind: 'music',
        spec_text: 'Test music asset for MCP testing',
        meta_json: { test: true }
      };

      const result = await createAssetTool!.execute(testAsset);
      expect(result.isError).toBe(false);

      const content = JSON.parse(result.content[0].text as string);
      expect(content.ok).toBe(true);
      expect(content.data).toBeDefined();
      
      if (content.data?.asset_id) {
        testAssetId = content.data.asset_id;
      }
    });

    it('should create asset with first variant', async () => {
      const createAssetTool = toolsByName.get('create_asset');
      expect(createAssetTool).toBeDefined();

      const testAsset = {
        format: 'audio' as const,
        kind: 'music' as const,
        spec_text: 'Test music asset with variant',
        first_variant: {
          language: 'en',
          resolution: '44100Hz',
          generation_status: 'missing' as const,
          approval_status: 'draft' as const,
          meta_json: { quality: 'high' }
        }
      };

      const result = await createAssetTool!.execute(testAsset);
      expect(result.isError).toBe(false);

      const content = JSON.parse(result.content[0].text as string);
      expect(content.ok).toBe(true);
      expect(content.data).toBeDefined();
      
      if (content.data?.asset_id) {
        testAssetId = content.data.asset_id;
      }
    });

    it('should handle validation errors', async () => {
      const createAssetTool = toolsByName.get('create_asset');
      expect(createAssetTool).toBeDefined();

      const invalidAsset = {
        format: 'invalid_format',
        kind: 'music',
        spec_text: ''
      };

      const result = await createAssetTool!.execute(invalidAsset);
      expect(result.isError).toBe(true);
    });
  });

  describe('get_asset', () => {
    it('should get asset details', async () => {
      const createAssetTool = toolsByName.get('create_asset');
      const getAssetTool = toolsByName.get('get_asset');
      expect(createAssetTool).toBeDefined();
      expect(getAssetTool).toBeDefined();

      const testAsset: TestAsset = {
        format: 'video',
        kind: 'video',
        spec_text: 'Test video asset',
        meta_json: { duration: 60 }
      };

      const createResult = await createAssetTool!.execute(testAsset);
      const createContent = JSON.parse(createResult.content[0].text as string);
      testAssetId = createContent.data?.asset_id;

      expect(testAssetId).toBeDefined();

      const getResult = await getAssetTool!.execute({ id: testAssetId });
      expect(getResult.isError).toBe(false);

      const getContent = JSON.parse(getResult.content[0].text as string);
      expect(getContent.ok).toBe(true);
      expect(getContent.data).toBeDefined();
    });

    it('should handle non-existent asset', async () => {
      const getAssetTool = toolsByName.get('get_asset');
      expect(getAssetTool).toBeDefined();

      const result = await getAssetTool!.execute({ id: 999999 });
      expect(result.isError).toBe(true);
    });
  });

  describe('update_asset', () => {
    it('should update asset successfully', async () => {
      const createAssetTool = toolsByName.get('create_asset');
      const updateAssetTool = toolsByName.get('update_asset');
      expect(createAssetTool).toBeDefined();
      expect(updateAssetTool).toBeDefined();

      const testAsset: TestAsset = {
        format: 'text',
        kind: 'subtitle',
        spec_text: 'Original subtitle text'
      };

      const createResult = await createAssetTool!.execute(testAsset);
      const createContent = JSON.parse(createResult.content[0].text as string);
      testAssetId = createContent.data?.asset_id;

      const updateData = {
        id: testAssetId,
        spec_text: 'Updated subtitle text',
        approval_status: 'approved' as const,
        meta_json: { updated: true }
      };

      const updateResult = await updateAssetTool!.execute(updateData);
      expect(updateResult.isError).toBe(false);

      const updateContent = JSON.parse(updateResult.content[0].text as string);
      expect(updateContent.ok).toBe(true);
    });
  });

  describe('approve_asset', () => {
    it('should approve asset successfully', async () => {
      const createAssetTool = toolsByName.get('create_asset');
      const approveAssetTool = toolsByName.get('approve_asset');
      expect(createAssetTool).toBeDefined();
      expect(approveAssetTool).toBeDefined();

      const testAsset: TestAsset = {
        format: 'image',
        kind: 'thumbnail',
        spec_text: 'Test thumbnail asset'
      };

      const createResult = await createAssetTool!.execute(testAsset);
      const createContent = JSON.parse(createResult.content[0].text as string);
      testAssetId = createContent.data?.asset_id;

      const approveData = {
        id: testAssetId,
        approval_status: 'approved' as const,
        approval_comment: 'Looks good for production'
      };

      const approveResult = await approveAssetTool!.execute(approveData);
      expect(approveResult.isError).toBe(false);

      const approveContent = JSON.parse(approveResult.content[0].text as string);
      expect(approveContent.ok).toBe(true);
    });

    it('should reject asset with comment', async () => {
      const createAssetTool = toolsByName.get('create_asset');
      const approveAssetTool = toolsByName.get('approve_asset');
      expect(createAssetTool).toBeDefined();
      expect(approveAssetTool).toBeDefined();

      const testAsset: TestAsset = {
        format: 'audio',
        kind: 'voice',
        spec_text: 'Test voice asset'
      };

      const createResult = await createAssetTool!.execute(testAsset);
      const createContent = JSON.parse(createResult.content[0].text as string);
      testAssetId = createContent.data?.asset_id;

      const rejectData = {
        id: testAssetId,
        approval_status: 'rejected' as const,
        approval_comment: 'Quality issues detected'
      };

      const rejectResult = await approveAssetTool!.execute(rejectData);
      expect(rejectResult.isError).toBe(false);

      const rejectContent = JSON.parse(rejectResult.content[0].text as string);
      expect(rejectContent.ok).toBe(true);
    });
  });

  describe('delete_asset', () => {
    it('should delete asset successfully', async () => {
      const createAssetTool = toolsByName.get('create_asset');
      const deleteAssetTool = toolsByName.get('delete_asset');
      expect(createAssetTool).toBeDefined();
      expect(deleteAssetTool).toBeDefined();

      const testAsset: TestAsset = {
        format: 'video',
        kind: 'video',
        spec_text: 'Test asset to be deleted'
      };

      const createResult = await createAssetTool!.execute(testAsset);
      const createContent = JSON.parse(createResult.content[0].text as string);
      const assetId = createContent.data?.asset_id;

      const deleteResult = await deleteAssetTool!.execute({ id: assetId });
      expect(deleteResult.isError).toBe(false);

      const deleteContent = JSON.parse(deleteResult.content[0].text as string);
      expect(deleteContent.ok).toBe(true);

      testAssetId = null;
    });
  });
});
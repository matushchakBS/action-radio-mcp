import { api } from '../httpClient.js';
import { toolsByName } from '../tools/index.js';

const MCP_SERVER_URL = 'http://127.0.0.1:3001';

interface TestVariant {
  id?: number;
  language: string;
  resolution: string;
  url?: string;
  generation_status?: 'missing' | 'queued' | 'generating' | 'generated' | 'failed';
  approval_status?: 'draft' | 'approved' | 'rejected';
  meta_json?: Record<string, any>;
}

describe('Asset Variant Management Tools', () => {
  let testAssetId: number | null = null;
  let testVariantId: number | null = null;

  beforeEach(async () => {
    const createAssetTool = toolsByName.get('create_asset');
    expect(createAssetTool).toBeDefined();

    const testAsset = {
      format: 'audio' as const,
      kind: 'music' as const,
      spec_text: 'Test music asset for variant testing'
    };

    const result = await createAssetTool!.execute(testAsset);
    const content = JSON.parse(result.content[0].text as string);
    testAssetId = content.data?.asset_id;
    expect(testAssetId).toBeDefined();
  });

  afterEach(async () => {
    if (testVariantId) {
      try {
        const deleteVariantTool = toolsByName.get('delete_variant');
        if (deleteVariantTool) {
          await deleteVariantTool.execute({ id: testVariantId });
        }
      } catch (error) {
        console.warn(`Failed to cleanup test variant ${testVariantId}:`, error);
      }
      testVariantId = null;
    }

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

  describe('list_variants', () => {
    it('should list variants for asset', async () => {
      const listVariantsTool = toolsByName.get('list_variants');
      expect(listVariantsTool).toBeDefined();

      const result = await listVariantsTool!.execute({ id: testAssetId });
      expect(result.isError).toBe(false);
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const content = JSON.parse(result.content[0].text as string);
      expect(content.ok).toBe(true);
      expect(content).toHaveProperty('timestamp');
      expect(content).toHaveProperty('data');
    });

    it('should list variants with filters', async () => {
      const listVariantsTool = toolsByName.get('list_variants');
      expect(listVariantsTool).toBeDefined();

      const result = await listVariantsTool!.execute({
        id: testAssetId,
        language: 'en',
        generation_status: 'missing',
        approval_status: 'draft'
      });
      expect(result.isError).toBe(false);
      
      const content = JSON.parse(result.content[0].text as string);
      expect(content.ok).toBe(true);
    });

    it('should handle non-existent asset', async () => {
      const listVariantsTool = toolsByName.get('list_variants');
      expect(listVariantsTool).toBeDefined();

      const result = await listVariantsTool!.execute({ id: 999999 });
      expect(result.isError).toBe(true);
    });
  });

  describe('create_variant', () => {
    it('should create variant successfully', async () => {
      const createVariantTool = toolsByName.get('create_variant');
      expect(createVariantTool).toBeDefined();

      const testVariant: TestVariant = {
        id: testAssetId!,
        language: 'en',
        resolution: '44100Hz',
        generation_status: 'missing',
        approval_status: 'draft',
        meta_json: { test: true }
      };

      const result = await createVariantTool!.execute(testVariant);
      expect(result.isError).toBe(false);

      const content = JSON.parse(result.content[0].text as string);
      expect(content.ok).toBe(true);
      expect(content.data).toBeDefined();
      
      if (content.data?.asset_variant_id) {
        testVariantId = content.data.asset_variant_id;
      }
    });

    it('should create variant with URL', async () => {
      const createVariantTool = toolsByName.get('create_variant');
      expect(createVariantTool).toBeDefined();

      const testVariant = {
        id: testAssetId!,
        language: 'es',
        resolution: '48000Hz',
        url: 'https://example.com/spanish-audio.mp3',
        generation_status: 'generated' as const,
        approval_status: 'draft' as const
      };

      const result = await createVariantTool!.execute(testVariant);
      expect(result.isError).toBe(false);

      const content = JSON.parse(result.content[0].text as string);
      expect(content.ok).toBe(true);
      
      if (content.data?.asset_variant_id) {
        testVariantId = content.data.asset_variant_id;
      }
    });

    it('should handle validation errors', async () => {
      const createVariantTool = toolsByName.get('create_variant');
      expect(createVariantTool).toBeDefined();

      const invalidVariant = {
        id: testAssetId!,
        language: '', // Empty language should fail
        resolution: '44100Hz'
      };

      const result = await createVariantTool!.execute(invalidVariant);
      expect(result.isError).toBe(true);
    });
  });

  describe('update_variant', () => {
    it('should update variant successfully', async () => {
      const createVariantTool = toolsByName.get('create_variant');
      const updateVariantTool = toolsByName.get('update_variant');
      expect(createVariantTool).toBeDefined();
      expect(updateVariantTool).toBeDefined();

      const testVariant: TestVariant = {
        id: testAssetId!,
        language: 'en',
        resolution: '44100Hz',
        generation_status: 'missing'
      };

      const createResult = await createVariantTool!.execute(testVariant);
      const createContent = JSON.parse(createResult.content[0].text as string);
      testVariantId = createContent.data?.asset_variant_id;

      const updateData = {
        id: testVariantId,
        url: 'https://example.com/updated-audio.mp3',
        duration_seconds: 120.5,
        generation_status: 'generated' as const,
        approval_status: 'approved' as const,
        meta_json: { updated: true, quality: 'high' }
      };

      const updateResult = await updateVariantTool!.execute(updateData);
      expect(updateResult.isError).toBe(false);

      const updateContent = JSON.parse(updateResult.content[0].text as string);
      expect(updateContent.ok).toBe(true);
    });
  });

  describe('approve_variant', () => {
    it('should approve variant successfully', async () => {
      const createVariantTool = toolsByName.get('create_variant');
      const approveVariantTool = toolsByName.get('approve_variant');
      expect(createVariantTool).toBeDefined();
      expect(approveVariantTool).toBeDefined();

      const testVariant: TestVariant = {
        id: testAssetId!,
        language: 'en',
        resolution: '1920x1080',
        url: 'https://example.com/video.mp4',
        generation_status: 'generated'
      };

      const createResult = await createVariantTool!.execute(testVariant);
      const createContent = JSON.parse(createResult.content[0].text as string);
      testVariantId = createContent.data?.asset_variant_id;

      const approveData = {
        id: testVariantId,
        status: 'approved' as const,
        review_notes: 'Video quality is excellent, approved for release'
      };

      const approveResult = await approveVariantTool!.execute(approveData);
      expect(approveResult.isError).toBe(false);

      const approveContent = JSON.parse(approveResult.content[0].text as string);
      expect(approveContent.ok).toBe(true);
    });

    it('should reject variant with review notes', async () => {
      const createVariantTool = toolsByName.get('create_variant');
      const approveVariantTool = toolsByName.get('approve_variant');
      expect(createVariantTool).toBeDefined();
      expect(approveVariantTool).toBeDefined();

      const testVariant: TestVariant = {
        id: testAssetId!,
        language: 'fr',
        resolution: '720p',
        url: 'https://example.com/french-video.mp4',
        generation_status: 'generated'
      };

      const createResult = await createVariantTool!.execute(testVariant);
      const createContent = JSON.parse(createResult.content[0].text as string);
      testVariantId = createContent.data?.asset_variant_id;

      const rejectData = {
        id: testVariantId,
        status: 'rejected' as const,
        review_notes: 'Audio sync issues detected, requires regeneration'
      };

      const rejectResult = await approveVariantTool!.execute(rejectData);
      expect(rejectResult.isError).toBe(false);

      const rejectContent = JSON.parse(rejectResult.content[0].text as string);
      expect(rejectContent.ok).toBe(true);
    });
  });

  describe('delete_variant', () => {
    it('should delete variant successfully', async () => {
      const createVariantTool = toolsByName.get('create_variant');
      const deleteVariantTool = toolsByName.get('delete_variant');
      expect(createVariantTool).toBeDefined();
      expect(deleteVariantTool).toBeDefined();

      const testVariant: TestVariant = {
        id: testAssetId!,
        language: 'de',
        resolution: '1080p',
        url: 'https://example.com/german-video.mp4'
      };

      const createResult = await createVariantTool!.execute(testVariant);
      const createContent = JSON.parse(createResult.content[0].text as string);
      const variantId = createContent.data?.asset_variant_id;

      const deleteResult = await deleteVariantTool!.execute({ id: variantId });
      expect(deleteResult.isError).toBe(false);

      const deleteContent = JSON.parse(deleteResult.content[0].text as string);
      expect(deleteContent.ok).toBe(true);

      testVariantId = null;
    });

    it('should handle non-existent variant', async () => {
      const deleteVariantTool = toolsByName.get('delete_variant');
      expect(deleteVariantTool).toBeDefined();

      const result = await deleteVariantTool!.execute({ id: 999999 });
      expect(result.isError).toBe(true);
    });
  });

  describe('Complex variant workflows', () => {
    it('should handle multiple variants for one asset', async () => {
      const createVariantTool = toolsByName.get('create_variant');
      const listVariantsTool = toolsByName.get('list_variants');
      expect(createVariantTool).toBeDefined();
      expect(listVariantsTool).toBeDefined();

      const variants = [
        { language: 'en', resolution: '720p' },
        { language: 'en', resolution: '1080p' },
        { language: 'es', resolution: '720p' }
      ];

      const createdVariants = [];

      for (const variant of variants) {
        const result = await createVariantTool!.execute({
          id: testAssetId!,
          ...variant,
          generation_status: 'missing' as const
        });
        const content = JSON.parse(result.content[0].text as string);
        if (content.data?.asset_variant_id) {
          createdVariants.push(content.data.asset_variant_id);
        }
      }

      expect(createdVariants).toHaveLength(3);

      const listResult = await listVariantsTool!.execute({ id: testAssetId! });
      const listContent = JSON.parse(listResult.content[0].text as string);
      expect(listContent.ok).toBe(true);
      expect(listContent.data?.variants).toBeDefined();

      for (const variantId of createdVariants) {
        try {
          const deleteVariantTool = toolsByName.get('delete_variant');
          if (deleteVariantTool) {
            await deleteVariantTool.execute({ id: variantId });
          }
        } catch (error) {
          console.warn(`Failed to cleanup variant ${variantId}:`, error);
        }
      }
    });
  });
});
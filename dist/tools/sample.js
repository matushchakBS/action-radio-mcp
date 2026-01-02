const sampleTool = {
    name: 'sample_tool',
    description: 'A sample tool that returns stub data for testing',
    inputSchema: {
        type: 'object',
        properties: {
            count: {
                type: 'number',
                description: 'Number of sample items to return',
                minimum: 1,
                maximum: 10,
            }
        },
        additionalProperties: false,
    },
    execute: async (args) => {
        const { count = 3 } = args || {};
        const sampleData = Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            name: `Sample Item ${i + 1}`,
            type: 'example',
            status: i % 2 === 0 ? 'active' : 'inactive',
            createdAt: new Date().toISOString(),
        }));
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(sampleData, null, 2),
                },
            ],
            structuredContent: {
                ok: true,
                count: sampleData.length,
                data: sampleData,
                timestamp: new Date().toISOString(),
            },
        };
    },
};
export default sampleTool;
//# sourceMappingURL=sample.js.map
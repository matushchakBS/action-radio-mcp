import 'dotenv/config';

const normalizeBaseUrl = (value?: string) => {
  if (!value) return undefined;
  return value.endsWith('/') ? value.slice(0, -1) : value;
};

// Use EPISODE_MANAGER_API_URL if provided, otherwise fall back to host + path
export const apiBaseUrl = normalizeBaseUrl(process.env.EPISODE_MANAGER_API_URL) ?? 
  (() => {
    const apiPath = process.env.EPISODE_MANAGER_API_PATH || '/api/episode-manager';
    const apiHost = process.env.EPISODE_MANAGER_API_HOST;
    return apiHost
      ? `${apiHost.endsWith('/') ? apiHost.slice(0, -1) : apiHost}${apiPath.startsWith('/') ? apiPath : `/${apiPath}`}`
      : apiPath; // Use just the path - axios will make requests to the same origin
  })()

export const httpTimeoutMs = Number(process.env.MCP_HTTP_TIMEOUT_MS ?? '10000');

// Support both new names (MCP_HTTP_*) and legacy aliases (MCP_*)
export const serverPort = Number(
    process.env.PORT ??                    // ⬅️ Cloud Run injects this
    process.env.MCP_HTTP_PORT ??
    process.env.MCP_PORT ??
    '8080'
);
export const serverHost =
  process.env.MCP_HTTP_HOST ?? process.env.MCP_HOST ?? '0.0.0.0';
export const serverPath = process.env.MCP_HTTP_PATH ?? '/mcp';


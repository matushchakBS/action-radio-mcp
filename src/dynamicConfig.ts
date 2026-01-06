import { apiPath, apiHost } from './config.js';

// Store the detected host from the first incoming request
let detectedHost: string | null = null;

// Check for Cloud Run or other platform-specific env vars
const getCloudRunUrl = () => {
  // Cloud Run provides these
  if (process.env.K_SERVICE) {
    // On Cloud Run, construct the URL
    const service = process.env.K_SERVICE;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
    const region = process.env.CLOUD_RUN_REGION || 'us-central1';
    
    if (projectId) {
      return `https://${service}-${projectId}.${region}.run.app`;
    }
  }
  
  // Check for other common cloud platform env vars
  if (process.env.WEBSITE_HOSTNAME) {
    // Azure App Service
    return `https://${process.env.WEBSITE_HOSTNAME}`;
  }
  
  if (process.env.RENDER_EXTERNAL_URL) {
    // Render.com
    return process.env.RENDER_EXTERNAL_URL;
  }
  
  if (process.env.HEROKU_APP_NAME) {
    // Heroku
    return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
  }
  
  return null;
};

// Store the host from incoming request
export const captureHostFromRequest = (req: any) => {
  if (!detectedHost && req.headers.host) {
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    detectedHost = `${protocol}://${req.headers.host}`;
    console.log(`Detected host from request: ${detectedHost}`);
  }
};

// Get the current host URL (without path)
export const getDynamicHost = () => {
  // 1. If host is explicitly set in env, use it
  if (apiHost) {
    return apiHost.endsWith('/') ? apiHost.slice(0, -1) : apiHost;
  }
  
  // 2. Try to detect from cloud platform
  const cloudUrl = getCloudRunUrl();
  if (cloudUrl) {
    return cloudUrl;
  }
  
  // 3. Use detected host from incoming requests
  if (detectedHost) {
    return detectedHost;
  }
  
  // 4. Fallback to localhost
  return 'http://localhost:8000';
};

// Get the current API base URL
export const getDynamicApiBaseUrl = () => {
  const host = getDynamicHost();
  const path = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
  return `${host}${path}`;
};
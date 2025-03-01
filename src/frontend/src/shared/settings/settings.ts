const backendHost = import.meta.env.VITE_BACKEND_HOST ? import.meta.env.VITE_BACKEND_HOST : 'localhost';
const backendPort = import.meta.env.VITE_BACKEND_PORT ? import.meta.env.VITE_BACKEND_PORT : 7777;
const backendSchema = import.meta.env.VITE_BACKEND_SCHEMA ? import.meta.env.VITE_BACKEND_SCHEMA : 'http';
const backendProxyPrefix = import.meta.env.VITE_BACKEND_PROXY_PREFIX ? `/${import.meta.env.VITE_BACKEND_PROXY_PREFIX}` : "";

export const backendDSN = () => {
  return `${backendSchema}://${backendHost}:${backendPort}${backendProxyPrefix}`
}

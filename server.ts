import { serve } from "bun";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PORT = process.env.PORT || 3000;
const DIST_DIR = join(import.meta.dir, "dist");
const AZURE_ENDPOINT = "http://1ea6ea7c-3f41-45f9-a433-3201ac93c384.brazilsouth.azurecontainer.io";

// Función para servir archivos estáticos
function serveStatic(pathname: string) {
  const filePath = join(DIST_DIR, pathname === "/" ? "index.html" : pathname);
  
  if (existsSync(filePath)) {
    const content = readFileSync(filePath);
    const ext = pathname.split('.').pop();
    
    const mimeTypes: Record<string, string> = {
      'html': 'text/html',
      'js': 'application/javascript',
      'css': 'text/css',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon'
    };
    
    return new Response(content, {
      headers: {
        'Content-Type': mimeTypes[ext || 'html'] || 'text/plain'
      }
    });
  }
  
  return null;
}

// Servidor principal
serve({
  port: PORT,
  hostname: "0.0.0.0",
  
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    
    // Proxy para API de Azure
    if (pathname.startsWith('/api')) {
      const targetUrl = AZURE_ENDPOINT + pathname.replace('/api', '');
      
      try {
        const response = await fetch(targetUrl, {
          method: req.method,
          headers: req.headers,
          body: req.method !== 'GET' ? await req.text() : undefined
        });
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } catch (error) {
        return new Response('Proxy Error', { status: 502 });
      }
    }
    
    // Servir archivos estáticos
    const staticResponse = serveStatic(pathname);
    if (staticResponse) {
      return staticResponse;
    }
    
    // SPA fallback - servir index.html para rutas no encontradas
    const indexResponse = serveStatic('/');
    return indexResponse || new Response('Not Found', { status: 404 });
  },
  
  error(error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

console.log(`🚀 Servidor AutosAzure ejecutándose en http://0.0.0.0:${PORT}`);
console.log(`📁 Sirviendo archivos desde: ${DIST_DIR}`);
console.log(`🔗 Proxy API configurado para: ${AZURE_ENDPOINT}`);
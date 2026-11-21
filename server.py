import http.server
import socketserver
import os
import sys

PORT = 3333
DIRECTORY = os.path.join(os.path.dirname(__file__), "dist")

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

class HighPerformanceSPAHandler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Check if the requested file exists
        req_path = self.translate_path(self.path)
        if not os.path.exists(req_path) and not '.' in os.path.basename(self.path):
            # Fallback to index.html for SPA routes
            self.path = '/index.html'
        return super().do_GET()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        # Always serve fresh content
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.js') or path.endswith('.mjs'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.css'):
            return 'text/css; charset=utf-8'
        if path.endswith('.webp'):
            return 'image/webp'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        if path.endswith('.webmanifest'):
            return 'application/manifest+json'
        if path.endswith('.mp4'):
            return 'video/mp4'
        return super().guess_type(path)

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with ThreadingHTTPServer(("", PORT), HighPerformanceSPAHandler) as httpd:
        print(f"High-performance HTTP/1.1 server running at http://localhost:{PORT}")
        httpd.serve_forever()

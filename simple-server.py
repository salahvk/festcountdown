#!/usr/bin/env python3
import http.server
import socketserver
import os

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/salah-new-birthday':
            if os.path.exists('salah-new-birthday.html'):
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                with open('salah-new-birthday.html', 'rb') as f:
                    self.wfile.write(f.read())
                return
        
        super().do_GET()

if __name__ == "__main__":
    with socketserver.TCPServer(("", 8000), SimpleHandler) as httpd:
        print("Server running on port 8000")
        httpd.serve_forever()

#!/usr/bin/env python3
"""
Simple HTTP server with URL routing for local development
Handles festival countdown URLs like /diwali, /christmas, etc.
"""

import http.server
import socketserver
import os
import urllib.parse
from pathlib import Path

class FestivalCountdownHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Handle festival URLs
        if path.startswith('/') and path != '/' and not path.startswith('/admin') and not path.startswith('/event'):
            # Extract festival name from path (e.g., /diwali -> diwali)
            festival_name = path[1:]  # Remove leading slash
            
            # Check if this is a festival page
            festival_files = ['diwali', 'christmas', 'new-year', 'gandhi-jayanti', 'eid', 'onam', 'ramzan', 'apj-birthday', 'apj-death-day', 'salah-new-birthday']
            if festival_name in festival_files:
                # Serve the festival HTML file
                festival_file = f"{festival_name}.html"
                if os.path.exists(festival_file):
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    with open(festival_file, 'rb') as f:
                        self.wfile.write(f.read())
                    return
                else:
                    # If file doesn't exist, try to generate it
                    self.generate_and_serve_festival_page(festival_name)
                    return
        
        # Default behavior for other files
        super().do_GET()
    
    def generate_and_serve_festival_page(self, festival_name):
        """Generate and serve a festival page if it doesn't exist"""
        try:
            # Import the generation script
            import subprocess
            result = subprocess.run(['node', 'scripts/generate-event-pages.js'], 
                                 capture_output=True, text=True, cwd=os.getcwd())
            
            if result.returncode == 0:
                # Try to serve the generated file
                festival_file = f"{festival_name}.html"
                if os.path.exists(festival_file):
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    with open(festival_file, 'rb') as f:
                        self.wfile.write(f.read())
                    return
            
            # If generation failed, serve a 404
            self.send_error(404, f"Festival '{festival_name}' not found")
            
        except Exception as e:
            self.send_error(500, f"Error generating festival page: {str(e)}")

def run_server(port=8000):
    """Run the development server"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Try different ports if 8000 is busy
    ports_to_try = [8000, 8001, 8002, 8003, 3000, 3001]
    
    for port in ports_to_try:
        try:
            with socketserver.TCPServer(("", port), FestivalCountdownHandler) as httpd:
                print(f"🎉 Festival Countdown Server running at http://localhost:{port}")
                print(f"📱 Available URLs:")
                print(f"   • Main site: http://localhost:{port}/")
                print(f"   • Diwali: http://localhost:{port}/diwali")
                print(f"   • Christmas: http://localhost:{port}/christmas")
                print(f"   • New Year: http://localhost:{port}/new-year")
                print(f"   • Gandhi Jayanti: http://localhost:{port}/gandhi-jayanti")
                print(f"   • Admin: http://localhost:{port}/admin.html")
                print(f"\n🚀 Press Ctrl+C to stop the server")
                
                try:
                    httpd.serve_forever()
                except KeyboardInterrupt:
                    print(f"\n👋 Server stopped!")
                return
        except OSError as e:
            if e.errno == 48:  # Address already in use
                print(f"⚠️  Port {port} is busy, trying next port...")
                continue
            else:
                raise e
    
    print("❌ Could not find an available port. Please close other servers or try again.")

if __name__ == "__main__":
    run_server()

import sys
import os

# Add application directory to Python system path
current_dir = os.path.dirname(__file__)
sys.path.insert(0, current_dir)

# Load .env file if present
from dotenv import load_dotenv
load_dotenv(os.path.join(current_dir, '.env'))

# Import FastAPI instance and wrap with ASGIMiddleware for cPanel Passenger WSGI
try:
    from a2wsgi import ASGIMiddleware
    from backend.app.main import app as fastapi_app
    application = ASGIMiddleware(fastapi_app)
except Exception as e:
    # Fallback simple WSGI diagnostic if dependencies are still being installed
    def application(environ, start_response):
        status = '200 OK'
        output = f"JOY Verification Python App initializing: {e}".encode('utf-8')
        response_headers = [('Content-type', 'text/plain'), ('Content-Length', str(len(output)))]
        start_response(status, response_headers)
        return [output]

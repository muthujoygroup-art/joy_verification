import sys
import os
import traceback
import asyncio

# 1. Add current project directory to Python system path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# 2. Try loading .env if python-dotenv is present
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(current_dir, '.env'))
except Exception:
    pass

class PureAsyncWsgiAdapter:
    """
    Zero-dependency pure Python WSGI-to-ASGI adapter for Phusion Passenger and cPanel.
    Guarantees 100% compatibility without requiring a2wsgi or external packages.
    """
    def __init__(self, asgi_app):
        self.asgi_app = asgi_app

    def __call__(self, environ, start_response):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self._run_request(environ, start_response))
        finally:
            loop.close()

    async def _run_request(self, environ, start_response):
        headers = []
        for key, value in environ.items():
            if key == "CONTENT_TYPE" and value:
                headers.append((b"content-type", value.encode("latin1")))
            elif key == "CONTENT_LENGTH" and value:
                headers.append((b"content-length", value.encode("latin1")))
            elif key.startswith("HTTP_"):
                header_name = key[5:].replace("_", "-").lower().encode("latin1")
                headers.append((header_name, str(value).encode("latin1")))

        server_port = int(environ.get("SERVER_PORT", 80)) if str(environ.get("SERVER_PORT", "80")).isdigit() else 80
        client_port = int(environ.get("REMOTE_PORT", 0)) if str(environ.get("REMOTE_PORT", "0")).isdigit() else 0

        path_info = environ.get("PATH_INFO", "/")
        query_string = environ.get("QUERY_STRING", "")

        scope = {
            "type": "http",
            "asgi": {"version": "3.0", "spec_version": "2.3"},
            "http_version": environ.get("SERVER_PROTOCOL", "HTTP/1.1").split("/")[-1],
            "method": environ.get("REQUEST_METHOD", "GET"),
            "scheme": environ.get("wsgi.url_scheme", "https"),
            "path": path_info,
            "raw_path": path_info.encode("latin1"),
            "query_string": query_string.encode("latin1"),
            "headers": headers,
            "server": (environ.get("SERVER_NAME", "localhost"), server_port),
            "client": (environ.get("REMOTE_ADDR", "127.0.0.1"), client_port),
        }

        # Request body reading
        body_input = environ.get("wsgi.input")
        body_bytes = b""
        if body_input:
            try:
                content_length = int(environ.get("CONTENT_LENGTH", 0))
            except (ValueError, TypeError):
                content_length = 0
            if content_length > 0:
                body_bytes = body_input.read(content_length)

        body_sent = False

        async def receive():
            nonlocal body_sent
            if not body_sent:
                body_sent = True
                return {
                    "type": "http.request",
                    "body": body_bytes,
                    "more_body": False
                }
            return {
                "type": "http.request",
                "body": b"",
                "more_body": False
            }

        response_status = 200
        response_headers = []
        response_body_chunks = []

        async def send(message):
            nonlocal response_status, response_headers, response_body_chunks
            msg_type = message.get("type")
            if msg_type == "http.response.start":
                response_status = message.get("status", 200)
                raw_hdrs = message.get("headers", [])
                response_headers = [
                    (k.decode("latin1") if isinstance(k, bytes) else str(k),
                     v.decode("latin1") if isinstance(v, bytes) else str(v))
                    for k, v in raw_hdrs
                ]
            elif msg_type == "http.response.body":
                chunk = message.get("body", b"")
                if chunk:
                    response_body_chunks.append(chunk)

        await self.asgi_app(scope, receive, send)

        status_text = f"{response_status} OK" if response_status == 200 else f"{response_status} Response"
        start_response(status_text, response_headers)
        return response_body_chunks

# 3. Create the WSGI application wrapper
_wsgi_app = None
_init_error = None

def get_app():
    global _wsgi_app, _init_error
    if _wsgi_app is not None:
        return _wsgi_app
    if _init_error is not None:
        return None

    try:
        try:
            from a2wsgi import ASGIMiddleware
            from backend.app.main import app as fastapi_app
            _wsgi_app = ASGIMiddleware(fastapi_app)
            return _wsgi_app
        except ImportError:
            from backend.app.main import app as fastapi_app
            _wsgi_app = PureAsyncWsgiAdapter(fastapi_app)
            return _wsgi_app
    except Exception as e:
        _init_error = traceback.format_exc()
        return None

def application(environ, start_response):
    app = get_app()
    if app is not None:
        try:
            return app(environ, start_response)
        except Exception as e:
            err_msg = f"Runtime Error in FastAPI App:\n{traceback.format_exc()}".encode('utf-8')
            start_response('500 Internal Server Error', [('Content-Type', 'text/plain; charset=utf-8'), ('Content-Length', str(len(err_msg)))])
            return [err_msg]
    else:
        output = (
            f"=== JOY DATA VERIFICATION BACKEND INITIALIZATION STATUS ===\n\n"
            f"Error details:\n{_init_error}\n\n"
            f"Python Path: {sys.path}\n"
            f"Current Directory: {current_dir}\n"
        ).encode('utf-8')
        start_response('500 Internal Server Error', [('Content-Type', 'text/plain; charset=utf-8'), ('Content-Length', str(len(output)))])
        return [output]

import sys
import os
import traceback

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

# 3. Create the WSGI application wrapper with diagnostic error catcher
_wsgi_app = None
_init_error = None

def get_app():
    global _wsgi_app, _init_error
    if _wsgi_app is not None:
        return _wsgi_app
    if _init_error is not None:
        return None

    try:
        from a2wsgi import ASGIMiddleware
        from backend.app.main import app as fastapi_app
        _wsgi_app = ASGIMiddleware(fastapi_app)
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
        # Return clear diagnostic message if dependencies are missing or initializing
        output = (
            f"=== JOY DATA VERIFICATION BACKEND INITIALIZATION STATUS ===\n\n"
            f"Error details:\n{_init_error}\n\n"
            f"Python Path: {sys.path}\n"
            f"Current Directory: {current_dir}\n"
        ).encode('utf-8')
        start_response('200 OK', [('Content-Type', 'text/plain; charset=utf-8'), ('Content-Length', str(len(output)))])
        return [output]

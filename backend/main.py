"""FastAPI app — the single backend for all /api routes.

Dev: run with `uvicorn backend.main:app --reload --port 8000`; the Vite dev server
proxies /api → :8000 (see vite.config.ts). Prod: `vite build` then this app serves
the built SPA from dist/."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from . import config
from .routers import auth, chat, match, misc, profile

app = FastAPI(title="Hackathon Companion API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(misc.router)
app.include_router(chat.router)
app.include_router(profile.router)
app.include_router(match.router)
app.include_router(auth.router)

# Production: serve the built SPA. (In dev the Vite server serves the frontend.)
if config.DIST_DIR.exists():
    assets_dir = config.DIST_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def spa(full_path: str):
        return FileResponse(config.DIST_DIR / "index.html")

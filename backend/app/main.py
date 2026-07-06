from fastapi import FastAPI
from app.database import init_db
from app.routers import users

app = FastAPI(title="Task Manager API")

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(users.router)
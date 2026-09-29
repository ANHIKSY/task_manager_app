try:
    from sqlmodel import SQLModel, Field
except ImportError as exc:
    raise ImportError(
        "The 'sqlmodel' package is required. Install it with: pip install sqlmodel"
    ) from exc
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
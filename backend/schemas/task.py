from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: str
    assigned_to: int


class TaskUpdate(BaseModel):
    status: str
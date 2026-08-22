from models.activity_log import ActivityLog
from fastapi import Query
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.task import Task
from schemas.task import TaskCreate, TaskUpdate
from core.security import admin_required, verify_token




router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.post("/")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):

    new_task = Task(
        title=task.title,
        description=task.description,
        assigned_to=task.assigned_to,
        created_by=current_user["user_id"],
        status="pending"
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "message": "Task created successfully",
        "task_id": new_task.id,
        "title": new_task.title,
        "assigned_to": new_task.assigned_to,
        "created_by": new_task.created_by,
        "status": new_task.status
    }

@router.get("/my")
def get_my_tasks(
    status: str = None,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):

    query = db.query(Task).filter(
        Task.assigned_to == current_user["user_id"]
    )

    if status:
        query = query.filter(Task.status == status)

    tasks = query.all()

    return tasks


@router.put("/{task_id}")
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):

    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if task.assigned_to != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own tasks"
        )

    task.status = task_data.status

    db.commit()
    db.refresh(task)

    activity = ActivityLog(
        user_id=current_user["user_id"],
        action="TASK_UPDATE",
        details=f"Task {task.id} status changed to {task.status}"
    )

    db.add(activity)
    db.commit()

    return {
        "message": "Task updated successfully",
        "task_id": task.id,
        "status": task.status
    }
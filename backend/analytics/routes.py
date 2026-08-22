from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.task import Task
from models.activity_log import ActivityLog
from core.security import admin_required


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/")
def get_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):

    total_tasks = db.query(Task).count()

    completed_tasks = db.query(Task).filter(
        Task.status == "completed"
    ).count()

    pending_tasks = db.query(Task).filter(
        Task.status == "pending"
    ).count()

    search_logs = db.query(ActivityLog).filter(
        ActivityLog.action == "DOCUMENT_SEARCH"
    ).all()

    search_counts = {}

    for log in search_logs:

        query = log.details.replace(
            "Searched documents for: ",
            ""
        )

        if query in search_counts:
            search_counts[query] += 1
        else:
            search_counts[query] = 1

    most_searched_queries = []

    for query, count in search_counts.items():

        most_searched_queries.append({
            "query": query,
            "count": count
        })

    most_searched_queries.sort(
        key=lambda x: x["count"],
        reverse=True
    )

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "most_searched_queries": most_searched_queries
    }
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.database.connection import get_connection


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    slug: str = Field(min_length=1, max_length=180)
    project_type: str = Field(min_length=1, max_length=100)
    description: str = ""
    framework: str = ""
    backend: str = ""
    database: str = ""
    api_style: str = ""
    hugz_ai_enabled: bool = False
    guardian_enabled: bool = False


@router.post("/")
def create_project(project: ProjectCreate):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            try:
                cursor.execute(
                    """
                    INSERT INTO projects (
                        name,
                        slug,
                        project_type,
                        description,
                        framework,
                        backend,
                        database,
                        api_style,
                        hugz_ai_enabled,
                        guardian_enabled
                    )
                    VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                    )
                    RETURNING *;
                    """,
                    (
                        project.name,
                        project.slug,
                        project.project_type,
                        project.description,
                        project.framework,
                        project.backend,
                        project.database,
                        project.api_style,
                        project.hugz_ai_enabled,
                        project.guardian_enabled,
                    ),
                )

                created_project = cursor.fetchone()
                connection.commit()

                return {
                    "status": "created",
                    "project": created_project,
                }

            except Exception as error:
                connection.rollback()

                if "projects_slug_key" in str(error):
                    raise HTTPException(
                        status_code=409,
                        detail="A project with this slug already exists.",
                    )

                raise HTTPException(
                    status_code=500,
                    detail="Failed to create project.",
                )


@router.get("/")
def get_projects():
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT *
                FROM projects
                ORDER BY created_at DESC;
                """
            )

            projects = cursor.fetchall()

    return {
        "count": len(projects),
        "projects": projects,
    }


@router.get("/{project_id}")
def get_project(project_id: int):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT *
                FROM projects
                WHERE id = %s;
                """,
                (project_id,),
            )

            project = cursor.fetchone()

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return {
        "project": project,
    }


@router.delete("/{project_id}")
def delete_project(project_id: int):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM projects
                WHERE id = %s
                RETURNING id;
                """,
                (project_id,),
            )

            deleted_project = cursor.fetchone()
            connection.commit()

    if deleted_project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return {
        "status": "deleted",
        "project_id": deleted_project["id"],
    }

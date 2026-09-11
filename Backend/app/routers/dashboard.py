from fastapi import APIRouter

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)

@router.get("/")
def read_dashboard():
    return {"message": "dashboard router is working!"}
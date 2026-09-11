from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/attendance", tags=["Attendance"])

class StudentAttendanceCreate(BaseModel):
    student_id: int
    class_id: Optional[int] = None
    date: str
    status: str

class TeacherAttendanceCreate(BaseModel):
    staff_id: int
    date: str
    status: str
    time_in: Optional[str] = None
    time_out: Optional[str] = None

@router.get("/students/")
def get_student_attendance(
    date: Optional[str] = None,
    class_id: Optional[int] = None,
    student_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.StudentAttendance)
    if date:
        query = query.filter(models.StudentAttendance.date == date)
    if class_id:
        query = query.filter(models.StudentAttendance.class_id == class_id)
    if student_id:
        query = query.filter(models.StudentAttendance.student_id == student_id)
    return query.all()

@router.post("/students/")
def create_student_attendance(data: StudentAttendanceCreate, db: Session = Depends(get_db)):
    attendance = models.StudentAttendance(**data.dict())
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance

@router.get("/staff/")
def get_teacher_attendance(
    date: Optional[str] = None,
    staff_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.TeacherAttendance)
    if date:
        query = query.filter(models.TeacherAttendance.date == date)
    if staff_id:
        query = query.filter(models.TeacherAttendance.staff_id == staff_id)
    return query.all()

@router.post("/staff/")
def create_teacher_attendance(data: TeacherAttendanceCreate, db: Session = Depends(get_db)):
    attendance = models.TeacherAttendance(**data.dict())
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance
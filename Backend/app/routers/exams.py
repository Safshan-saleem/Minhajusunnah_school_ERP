from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/exams", tags=["Exams"])

class ExamCreate(BaseModel):
    exam_name: str
    exam_type: Optional[str] = None
    class_id: Optional[int] = None
    date: Optional[str] = None
    academic_year: Optional[str] = None

class MarkCreate(BaseModel):
    student_id: int
    exam_id: int
    subject: str
    marks_obtained: Optional[float] = None
    total_marks: Optional[float] = None
    grade: Optional[str] = None
    status: Optional[str] = "pass"

@router.get("/")
def get_all_exams(
    class_id: Optional[int] = None,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Exam)
    if class_id:
        query = query.filter(models.Exam.class_id == class_id)
    if academic_year:
        query = query.filter(models.Exam.academic_year == academic_year)
    return query.all()

@router.post("/")
def create_exam(exam_data: ExamCreate, db: Session = Depends(get_db)):
    exam = models.Exam(**exam_data.dict())
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam

@router.put("/{exam_id}")
def update_exam(exam_id: int, exam_data: ExamCreate, db: Session = Depends(get_db)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    for key, value in exam_data.dict(exclude_unset=True).items():
        setattr(exam, key, value)
    db.commit()
    db.refresh(exam)
    return exam

@router.delete("/{exam_id}")
def delete_exam(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    db.delete(exam)
    db.commit()
    return {"message": "Exam deleted successfully"}

@router.get("/marks/")
def get_marks(
    student_id: Optional[int] = None,
    exam_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Mark)
    if student_id:
        query = query.filter(models.Mark.student_id == student_id)
    if exam_id:
        query = query.filter(models.Mark.exam_id == exam_id)
    return query.all()

@router.post("/marks/")
def create_mark(mark_data: MarkCreate, db: Session = Depends(get_db)):
    mark = models.Mark(**mark_data.dict())
    db.add(mark)
    db.commit()
    db.refresh(mark)
    return mark
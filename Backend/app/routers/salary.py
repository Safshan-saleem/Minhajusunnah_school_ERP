from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/salary", tags=["Salary"])

class SalaryCreate(BaseModel):
    staff_id: int
    amount: float
    month: int
    year: int
    payment_date: Optional[str] = None
    status: Optional[str] = "paid"
    payment_method: Optional[str] = "bank_transfer"
    notes: Optional[str] = None

@router.get("/")
def get_all_salaries(
    staff_id: Optional[int] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.SalaryPayment)
    if staff_id:
        query = query.filter(models.SalaryPayment.staff_id == staff_id)
    if month:
        query = query.filter(models.SalaryPayment.month == month)
    if year:
        query = query.filter(models.SalaryPayment.year == year)
    return query.all()

@router.post("/")
def create_salary(salary_data: SalaryCreate, db: Session = Depends(get_db)):
    salary = models.SalaryPayment(**salary_data.dict())
    db.add(salary)
    db.commit()
    db.refresh(salary)
    return salary

@router.put("/{salary_id}")
def update_salary(salary_id: int, salary_data: SalaryCreate, db: Session = Depends(get_db)):
    salary = db.query(models.SalaryPayment).filter(models.SalaryPayment.id == salary_id).first()
    if not salary:
        raise HTTPException(status_code=404, detail="Salary record not found")
    for key, value in salary_data.dict(exclude_unset=True).items():
        setattr(salary, key, value)
    db.commit()
    db.refresh(salary)
    return salary

@router.delete("/{salary_id}")
def delete_salary(salary_id: int, db: Session = Depends(get_db)):
    salary = db.query(models.SalaryPayment).filter(models.SalaryPayment.id == salary_id).first()
    if not salary:
        raise HTTPException(status_code=404, detail="Salary record not found")
    db.delete(salary)
    db.commit()
    return {"message": "Salary record deleted"}

@router.get("/summary/")
def salary_summary(year: Optional[int] = None, month: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.SalaryPayment)
    if year:
        query = query.filter(models.SalaryPayment.year == year)
    if month:
        query = query.filter(models.SalaryPayment.month == month)
    salaries = query.all()
    total = sum(s.amount for s in salaries if s.amount)
    return {"total_paid": total, "count": len(salaries)}
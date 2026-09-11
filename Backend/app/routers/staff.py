from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/staff", tags=["Staff"])

class StaffCreate(BaseModel):
    full_name: str
    role: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    join_date: Optional[str] = None
    salary_amount: Optional[float] = None

class StaffUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    join_date: Optional[str] = None
    salary_amount: Optional[float] = None

@router.get("/")
def get_all_staff(
    role: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Staff).filter(models.Staff.is_active == True)
    if role:
        query = query.filter(models.Staff.role == role)
    if search:
        query = query.filter(models.Staff.full_name.ilike(f"%{search}%"))
    return query.all()

@router.post("/")
def create_staff(staff_data: StaffCreate, db: Session = Depends(get_db)):
    staff = models.Staff(**staff_data.dict())
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return staff

@router.get("/{staff_id}")
def get_staff(staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    return staff

@router.put("/{staff_id}")
def update_staff(staff_id: int, staff_data: StaffUpdate, db: Session = Depends(get_db)):
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    for key, value in staff_data.dict(exclude_unset=True).items():
        setattr(staff, key, value)
    db.commit()
    db.refresh(staff)
    return staff

@router.delete("/{staff_id}")
def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    staff.is_active = False
    db.commit()
    return {"message": "Staff deactivated successfully"}
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/accounts", tags=["Accounts"])

class AccountEntryCreate(BaseModel):
    type: str
    category: str
    description: Optional[str] = None
    amount: float
    date: str
    notes: Optional[str] = None
    month: Optional[int] = None
    year: Optional[int] = None

class VoucherCreate(BaseModel):
    voucher_type: str
    amount: float
    date: str
    description: Optional[str] = None

@router.get("/")
def get_all_entries(
    type: Optional[str] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.AccountEntry)
    if type:
        query = query.filter(models.AccountEntry.type == type)
    if month:
        query = query.filter(models.AccountEntry.month == month)
    if year:
        query = query.filter(models.AccountEntry.year == year)
    return query.all()

@router.post("/")
def create_entry(entry_data: AccountEntryCreate, db: Session = Depends(get_db)):
    entry = models.AccountEntry(**entry_data.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.put("/{entry_id}")
def update_entry(entry_id: int, entry_data: AccountEntryCreate, db: Session = Depends(get_db)):
    entry = db.query(models.AccountEntry).filter(models.AccountEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    for key, value in entry_data.dict(exclude_unset=True).items():
        setattr(entry, key, value)
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}")
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(models.AccountEntry).filter(models.AccountEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted"}

@router.get("/vouchers/")
def get_vouchers(db: Session = Depends(get_db)):
    return db.query(models.AccountVoucher).all()

@router.post("/vouchers/")
def create_voucher(voucher_data: VoucherCreate, db: Session = Depends(get_db)):
    voucher = models.AccountVoucher(**voucher_data.dict())
    db.add(voucher)
    db.commit()
    db.refresh(voucher)
    return voucher

@router.get("/summary/")
def get_summary(year: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.AccountEntry)
    if year:
        query = query.filter(models.AccountEntry.year == year)
    entries = query.all()
    total_income = sum(e.amount for e in entries if e.type == "income")
    total_expense = sum(e.amount for e in entries if e.type == "expense")
    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense
    }
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/donations", tags=["Donations"])

class DonationCreate(BaseModel):
    donor_name: str
    amount: float
    date: str
    notes: Optional[str] = None
    receipt_no: Optional[str] = None

@router.get("/")
def get_all_donations(
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Donation)
    if search:
        query = query.filter(models.Donation.donor_name.ilike(f"%{search}%"))
    return query.all()

@router.post("/")
def create_donation(donation_data: DonationCreate, db: Session = Depends(get_db)):
    donation = models.Donation(**donation_data.dict())
    db.add(donation)
    db.commit()
    db.refresh(donation)
    return donation

@router.get("/{donation_id}")
def get_donation(donation_id: int, db: Session = Depends(get_db)):
    donation = db.query(models.Donation).filter(models.Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    return donation

@router.put("/{donation_id}")
def update_donation(donation_id: int, donation_data: DonationCreate, db: Session = Depends(get_db)):
    donation = db.query(models.Donation).filter(models.Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    for key, value in donation_data.dict(exclude_unset=True).items():
        setattr(donation, key, value)
    db.commit()
    db.refresh(donation)
    return donation

@router.delete("/{donation_id}")
def delete_donation(donation_id: int, db: Session = Depends(get_db)):
    donation = db.query(models.Donation).filter(models.Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    db.delete(donation)
    db.commit()
    return {"message": "Donation deleted"}

@router.get("/summary/")
def donation_summary(db: Session = Depends(get_db)):
    donations = db.query(models.Donation).all()
    total = sum(d.amount for d in donations if d.amount)
    return {"total_donations": total, "count": len(donations)}
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.pdf_utils import build_header, make_info_table, generate_pdf_response, make_amount_box
from reportlab.platypus import Spacer
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/fees", tags=["Fees"])

class FeeCreate(BaseModel):
    student_id: int
    fee_type: str
    amount: float
    due_date: Optional[str] = None
    status: Optional[str] = "pending"
    academic_year: Optional[str] = None

class PaymentCreate(BaseModel):
    student_id: int
    amount: float
    payment_date: Optional[str] = None
    payment_type: Optional[str] = None
    notes: Optional[str] = None

@router.get("/")
def get_all_fees(
    student_id: Optional[int] = None,
    status: Optional[str] = None,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.StudentFee)
    if student_id:
        query = query.filter(models.StudentFee.student_id == student_id)
    if status:
        query = query.filter(models.StudentFee.status == status)
    if academic_year:
        query = query.filter(models.StudentFee.academic_year == academic_year)
    return query.all()

@router.post("/")
def create_fee(fee_data: FeeCreate, db: Session = Depends(get_db)):
    fee = models.StudentFee(**fee_data.dict())
    db.add(fee)
    db.commit()
    db.refresh(fee)
    return fee

@router.put("/{fee_id}")
def update_fee(fee_id: int, fee_data: FeeCreate, db: Session = Depends(get_db)):
    fee = db.query(models.StudentFee).filter(models.StudentFee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee not found")
    for key, value in fee_data.dict(exclude_unset=True).items():
        setattr(fee, key, value)
    db.commit()
    db.refresh(fee)
    return fee

@router.get("/payments/")
def get_all_payments(student_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Payment)
    if student_id:
        query = query.filter(models.Payment.student_id == student_id)
    return query.all()

@router.post("/payments/")
def create_payment(payment_data: PaymentCreate, db: Session = Depends(get_db)):
    payment = models.Payment(**payment_data.dict())
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment
@router.get("/payments/{payment_id}/receipt-pdf")
def get_payment_receipt_pdf(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    student = db.query(models.Student).filter(models.Student.id == payment.student_id).first()

    def build(elements, styles):
        build_header(elements, styles, "FEE PAYMENT RECEIPT")
        data = [
            ["Receipt No:", f"RCT-{payment.id:05d}"],
            ["Student Name:", student.full_name if student else "N/A"],
            ["Admission No:", student.admission_no if student else "N/A"],
            ["Payment Date:", payment.payment_date or "N/A"],
            ["Payment Type:", payment.payment_type or "N/A"],
            ["Notes:", payment.notes or "-"],
        ]
        elements.append(make_info_table(data))
        elements.append(Spacer(1, 16))
        elements.append(make_amount_box("TOTAL AMOUNT PAID", f"Rs. {payment.amount:,.2f}"))

    buffer = generate_pdf_response(build, "receipt")
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename=receipt_{payment_id}.pdf"}
    )
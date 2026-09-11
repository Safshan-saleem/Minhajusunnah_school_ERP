from sqlalchemy import Column, Integer, String, Date, Boolean, Numeric, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String(50), nullable=False)
    academic_year = Column(String(20), nullable=False)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    admission_no = Column(String(20), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    date_of_birth = Column(String(20), nullable=True)
    gender = Column(String(10), nullable=True)
    class_id = Column(Integer, nullable=True)
    parent_name = Column(String(100), nullable=True)
    father_profession = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    admission_date = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)

class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    role = Column(String(30), nullable=False)
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    join_date = Column(String(20), nullable=True)
    salary_amount = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_name = Column(String(50), nullable=True)
    vehicle_number = Column(String(20), nullable=True)
    driver_id = Column(Integer, nullable=True)

class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    route_name = Column(String(100), nullable=True)
    vehicle_id = Column(Integer, nullable=True)
    stops = Column(Text, nullable=True)

class StudentFee(Base):
    __tablename__ = "student_fees"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=True)
    fee_type = Column(String(50), nullable=True)
    amount = Column(Float, nullable=True)
    due_date = Column(String(20), nullable=True)
    status = Column(String(20), default="pending")
    academic_year = Column(String(20), nullable=True)

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=True)
    amount = Column(Float, nullable=True)
    payment_date = Column(String(20), nullable=True)
    payment_type = Column(String(30), nullable=True)
    notes = Column(Text, nullable=True)

class StudentAttendance(Base):
    __tablename__ = "student_attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=True)
    class_id = Column(Integer, nullable=True)
    date = Column(String(20), nullable=True)
    status = Column(String(20), nullable=True)

class TeacherAttendance(Base):
    __tablename__ = "teacher_attendance"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, nullable=True)
    date = Column(String(20), nullable=True)
    status = Column(String(20), nullable=True)
    time_in = Column(String(10), nullable=True)
    time_out = Column(String(10), nullable=True)

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    exam_name = Column(String(100), nullable=True)
    exam_type = Column(String(30), nullable=True)
    class_id = Column(Integer, nullable=True)
    date = Column(String(20), nullable=True)
    academic_year = Column(String(20), nullable=True)

class Mark(Base):
    __tablename__ = "marks"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=True)
    exam_id = Column(Integer, nullable=True)
    subject = Column(String(50), nullable=True)
    marks_obtained = Column(Float, nullable=True)
    total_marks = Column(Float, nullable=True)
    grade = Column(String(5), nullable=True)
    status = Column(String(20), default="pass")

class AccountEntry(Base):
    __tablename__ = "account_entries"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(20), nullable=True)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    amount = Column(Float, nullable=True)
    date = Column(String(20), nullable=True)
    notes = Column(Text, nullable=True)
    month = Column(Integer, nullable=True)
    year = Column(Integer, nullable=True)

class AccountVoucher(Base):
    __tablename__ = "account_vouchers"
    id = Column(Integer, primary_key=True, index=True)
    voucher_type = Column(String(20), nullable=True)
    amount = Column(Float, nullable=True)
    date = Column(String(20), nullable=True)
    description = Column(Text, nullable=True)

class SalaryPayment(Base):
    __tablename__ = "salary_payments"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, nullable=True)
    amount = Column(Float, nullable=True)
    month = Column(Integer, nullable=True)
    year = Column(Integer, nullable=True)
    payment_date = Column(String(20), nullable=True)
    status = Column(String(20), default="paid")
    payment_method = Column(String(30), default="bank_transfer")
    notes = Column(Text, nullable=True)

class Donation(Base):
    __tablename__ = "donations"
    id = Column(Integer, primary_key=True, index=True)
    donor_name = Column(String(100), nullable=True)
    amount = Column(Float, nullable=True)
    date = Column(String(20), nullable=True)
    notes = Column(Text, nullable=True)
    receipt_no = Column(String(20), nullable=True)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import students, staff, vehicles, fees, attendance, exams, accounts, salary, donations

app = FastAPI(
    title="Minhajusunnah School ERP",
    description="School Management System API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)
app.include_router(staff.router)
app.include_router(vehicles.router)
app.include_router(fees.router)
app.include_router(attendance.router)
app.include_router(exams.router)
app.include_router(accounts.router)
app.include_router(salary.router)
app.include_router(donations.router)

@app.get("/")
def root():
    return {"message": "Minhajusunnah School ERP API is running!"}

@app.get("/health")
def health():
    return {"status": "OK"}
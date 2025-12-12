"""
CHE·NU™ — B15-4: TIME TRACKING + PAYROLL
- Time entries
- Timesheets
- CCQ payroll calculations
- DAS deductions
- Overtime rules
- Mobile clock in/out
- GPS verification
"""

from typing import Any, Dict, List, Optional
from datetime import datetime, date, timedelta, time
from enum import Enum
from dataclasses import dataclass
from decimal import Decimal
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/time", tags=["Time & Payroll"])

class EntryType(str, Enum):
    REGULAR = "regular"
    OVERTIME = "overtime"
    DOUBLE_TIME = "double_time"
    TRAVEL = "travel"
    BREAK = "break"

class TimesheetStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    PROCESSED = "processed"

class PayrollStatus(str, Enum):
    PENDING = "pending"
    CALCULATED = "calculated"
    APPROVED = "approved"
    PAID = "paid"

# CCQ Deductions 2024 (approximations)
CCQ_DEDUCTIONS = {
    "regime_retraite": Decimal("0.0725"),  # 7.25% pension
    "assurance_collective": Decimal("0.0285"),  # 2.85% group insurance
    "formation": Decimal("0.0020"),  # 0.20% training fund
    "vacances": Decimal("0.13"),  # 13% vacation pay (built into rate)
    "conges_feries": Decimal("0.055"),  # 5.5% holidays
}

# Government deductions
GOV_DEDUCTIONS = {
    "rqap": Decimal("0.00494"),  # QPIP
    "rrq": Decimal("0.064"),  # QPP
    "ae": Decimal("0.0132"),  # EI (reduced for Quebec)
    "fss": Decimal("0.01"),  # Health Services Fund
}

@dataclass
class TimeEntry:
    id: str
    employee_id: str
    project_id: str
    task_id: Optional[str]
    date: date
    start_time: time
    end_time: Optional[time]
    break_minutes: int
    entry_type: EntryType
    hours: Decimal
    notes: str
    gps_location: Optional[Dict]
    created_at: datetime

@dataclass
class Timesheet:
    id: str
    employee_id: str
    employee_name: str
    week_start: date
    week_end: date
    entries: List[TimeEntry]
    total_regular: Decimal
    total_overtime: Decimal
    total_double: Decimal
    total_hours: Decimal
    status: TimesheetStatus
    submitted_at: Optional[datetime]
    approved_by: Optional[str]
    approved_at: Optional[datetime]

@dataclass 
class PayrollRecord:
    id: str
    employee_id: str
    employee_name: str
    trade: str
    pay_period_start: date
    pay_period_end: date
    
    # Hours
    regular_hours: Decimal
    overtime_hours: Decimal
    double_time_hours: Decimal
    
    # Rates (CCQ)
    hourly_rate: Decimal
    overtime_rate: Decimal
    double_time_rate: Decimal
    
    # Earnings
    gross_regular: Decimal
    gross_overtime: Decimal
    gross_double: Decimal
    gross_total: Decimal
    
    # CCQ deductions
    ccq_pension: Decimal
    ccq_insurance: Decimal
    ccq_training: Decimal
    ccq_total: Decimal
    
    # Government deductions
    income_tax_fed: Decimal
    income_tax_qc: Decimal
    rrq: Decimal
    rqap: Decimal
    ei: Decimal
    gov_total: Decimal
    
    # Net
    total_deductions: Decimal
    net_pay: Decimal
    
    status: PayrollStatus
    pay_date: Optional[date]

class TimeTracker:
    """Time entry management."""
    
    _entries: List[TimeEntry] = []
    _active_clocks: Dict[str, TimeEntry] = {}  # employee_id -> active entry
    
    @classmethod
    async def clock_in(cls, employee_id: str, project_id: str, task_id: Optional[str], 
                       gps: Optional[Dict] = None) -> TimeEntry:
        """Clock in employee."""
        
        if employee_id in cls._active_clocks:
            raise HTTPException(400, "Already clocked in")
        
        now = datetime.utcnow()
        entry = TimeEntry(
            id=f"te_{uuid.uuid4().hex[:8]}",
            employee_id=employee_id,
            project_id=project_id,
            task_id=task_id,
            date=now.date(),
            start_time=now.time(),
            end_time=None,
            break_minutes=0,
            entry_type=EntryType.REGULAR,
            hours=Decimal("0"),
            notes="",
            gps_location=gps,
            created_at=now,
        )
        
        cls._active_clocks[employee_id] = entry
        return entry
    
    @classmethod
    async def clock_out(cls, employee_id: str, break_minutes: int = 0, notes: str = "") -> TimeEntry:
        """Clock out employee."""
        
        entry = cls._active_clocks.get(employee_id)
        if not entry:
            raise HTTPException(400, "Not clocked in")
        
        now = datetime.utcnow()
        entry.end_time = now.time()
        entry.break_minutes = break_minutes
        entry.notes = notes
        
        # Calculate hours
        start = datetime.combine(entry.date, entry.start_time)
        end = datetime.combine(entry.date, entry.end_time)
        total_minutes = (end - start).total_seconds() / 60 - break_minutes
        entry.hours = Decimal(str(round(total_minutes / 60, 2)))
        
        # Determine entry type based on hours
        if entry.hours > 10:
            entry.entry_type = EntryType.DOUBLE_TIME
        elif entry.hours > 8:
            entry.entry_type = EntryType.OVERTIME
        
        cls._entries.append(entry)
        del cls._active_clocks[employee_id]
        
        return entry
    
    @classmethod
    async def add_manual_entry(cls, employee_id: str, project_id: str, entry_date: date,
                               start: str, end: str, break_min: int, notes: str) -> TimeEntry:
        """Add manual time entry."""
        
        start_time = time.fromisoformat(start)
        end_time = time.fromisoformat(end)
        
        start_dt = datetime.combine(entry_date, start_time)
        end_dt = datetime.combine(entry_date, end_time)
        total_minutes = (end_dt - start_dt).total_seconds() / 60 - break_min
        hours = Decimal(str(round(total_minutes / 60, 2)))
        
        entry = TimeEntry(
            id=f"te_{uuid.uuid4().hex[:8]}",
            employee_id=employee_id,
            project_id=project_id,
            task_id=None,
            date=entry_date,
            start_time=start_time,
            end_time=end_time,
            break_minutes=break_min,
            entry_type=EntryType.REGULAR,
            hours=hours,
            notes=notes,
            gps_location=None,
            created_at=datetime.utcnow(),
        )
        
        cls._entries.append(entry)
        return entry
    
    @classmethod
    async def get_entries(cls, employee_id: str, start_date: date, end_date: date) -> List[TimeEntry]:
        """Get entries for date range."""
        return [e for e in cls._entries 
                if e.employee_id == employee_id and start_date <= e.date <= end_date]

class TimesheetManager:
    """Timesheet management."""
    
    _timesheets: Dict[str, Timesheet] = {}
    
    @classmethod
    async def generate_timesheet(cls, employee_id: str, employee_name: str, week_start: date) -> Timesheet:
        """Generate timesheet for a week."""
        
        week_end = week_start + timedelta(days=6)
        entries = await TimeTracker.get_entries(employee_id, week_start, week_end)
        
        total_regular = Decimal("0")
        total_overtime = Decimal("0")
        total_double = Decimal("0")
        
        for entry in entries:
            if entry.hours <= 8:
                total_regular += entry.hours
            elif entry.hours <= 10:
                total_regular += Decimal("8")
                total_overtime += entry.hours - Decimal("8")
            else:
                total_regular += Decimal("8")
                total_overtime += Decimal("2")
                total_double += entry.hours - Decimal("10")
        
        timesheet = Timesheet(
            id=f"ts_{uuid.uuid4().hex[:8]}",
            employee_id=employee_id,
            employee_name=employee_name,
            week_start=week_start,
            week_end=week_end,
            entries=entries,
            total_regular=total_regular,
            total_overtime=total_overtime,
            total_double=total_double,
            total_hours=total_regular + total_overtime + total_double,
            status=TimesheetStatus.DRAFT,
            submitted_at=None,
            approved_by=None,
            approved_at=None,
        )
        
        cls._timesheets[timesheet.id] = timesheet
        return timesheet
    
    @classmethod
    async def submit(cls, timesheet_id: str) -> Timesheet:
        """Submit timesheet for approval."""
        ts = cls._timesheets.get(timesheet_id)
        if not ts:
            raise HTTPException(404, "Timesheet not found")
        
        ts.status = TimesheetStatus.SUBMITTED
        ts.submitted_at = datetime.utcnow()
        return ts
    
    @classmethod
    async def approve(cls, timesheet_id: str, approver_id: str) -> Timesheet:
        """Approve timesheet."""
        ts = cls._timesheets.get(timesheet_id)
        if not ts:
            raise HTTPException(404, "Timesheet not found")
        
        ts.status = TimesheetStatus.APPROVED
        ts.approved_by = approver_id
        ts.approved_at = datetime.utcnow()
        return ts

class PayrollCalculator:
    """CCQ payroll calculations."""
    
    # CCQ rates by trade (2024 approximations)
    CCQ_RATES = {
        "charpentier_menuisier": Decimal("42.50"),
        "electricien": Decimal("45.00"),
        "plombier": Decimal("44.00"),
        "manoeuvre": Decimal("32.00"),
        "operateur": Decimal("44.50"),
        "peintre": Decimal("38.00"),
    }
    
    _payroll: Dict[str, PayrollRecord] = {}
    
    @classmethod
    async def calculate(cls, timesheet: Timesheet, trade: str) -> PayrollRecord:
        """Calculate payroll from timesheet."""
        
        rate = cls.CCQ_RATES.get(trade, Decimal("35.00"))
        overtime_rate = rate * Decimal("1.5")
        double_rate = rate * Decimal("2.0")
        
        # Earnings
        gross_regular = timesheet.total_regular * rate
        gross_overtime = timesheet.total_overtime * overtime_rate
        gross_double = timesheet.total_double * double_rate
        gross_total = gross_regular + gross_overtime + gross_double
        
        # CCQ deductions
        ccq_pension = gross_total * CCQ_DEDUCTIONS["regime_retraite"]
        ccq_insurance = gross_total * CCQ_DEDUCTIONS["assurance_collective"]
        ccq_training = gross_total * CCQ_DEDUCTIONS["formation"]
        ccq_total = ccq_pension + ccq_insurance + ccq_training
        
        # Government deductions (simplified)
        annual_gross = gross_total * Decimal("52")  # Approximate annual
        
        # Federal tax (simplified brackets)
        if annual_gross < 53359:
            fed_rate = Decimal("0.15")
        elif annual_gross < 106717:
            fed_rate = Decimal("0.205")
        else:
            fed_rate = Decimal("0.26")
        income_tax_fed = gross_total * fed_rate * Decimal("0.8")  # Approximate
        
        # Quebec tax (simplified)
        if annual_gross < 49275:
            qc_rate = Decimal("0.14")
        elif annual_gross < 98540:
            qc_rate = Decimal("0.19")
        else:
            qc_rate = Decimal("0.24")
        income_tax_qc = gross_total * qc_rate * Decimal("0.8")
        
        rrq = gross_total * GOV_DEDUCTIONS["rrq"]
        rqap = gross_total * GOV_DEDUCTIONS["rqap"]
        ei = gross_total * GOV_DEDUCTIONS["ae"]
        
        gov_total = income_tax_fed + income_tax_qc + rrq + rqap + ei
        
        total_deductions = ccq_total + gov_total
        net_pay = gross_total - total_deductions
        
        record = PayrollRecord(
            id=f"pay_{uuid.uuid4().hex[:8]}",
            employee_id=timesheet.employee_id,
            employee_name=timesheet.employee_name,
            trade=trade,
            pay_period_start=timesheet.week_start,
            pay_period_end=timesheet.week_end,
            regular_hours=timesheet.total_regular,
            overtime_hours=timesheet.total_overtime,
            double_time_hours=timesheet.total_double,
            hourly_rate=rate,
            overtime_rate=overtime_rate,
            double_time_rate=double_rate,
            gross_regular=gross_regular,
            gross_overtime=gross_overtime,
            gross_double=gross_double,
            gross_total=gross_total,
            ccq_pension=ccq_pension,
            ccq_insurance=ccq_insurance,
            ccq_training=ccq_training,
            ccq_total=ccq_total,
            income_tax_fed=income_tax_fed,
            income_tax_qc=income_tax_qc,
            rrq=rrq,
            rqap=rqap,
            ei=ei,
            gov_total=gov_total,
            total_deductions=total_deductions,
            net_pay=net_pay,
            status=PayrollStatus.CALCULATED,
            pay_date=None,
        )
        
        cls._payroll[record.id] = record
        return record
    
    @classmethod
    async def get_pay_stub(cls, payroll_id: str) -> Dict:
        """Get formatted pay stub."""
        record = cls._payroll.get(payroll_id)
        if not record:
            raise HTTPException(404, "Payroll record not found")
        
        return {
            "employee": record.employee_name,
            "period": f"{record.pay_period_start} - {record.pay_period_end}",
            "trade": record.trade,
            "hours": {
                "regular": float(record.regular_hours),
                "overtime": float(record.overtime_hours),
                "double": float(record.double_time_hours),
                "total": float(record.regular_hours + record.overtime_hours + record.double_time_hours),
            },
            "earnings": {
                "regular": float(record.gross_regular),
                "overtime": float(record.gross_overtime),
                "double_time": float(record.gross_double),
                "gross": float(record.gross_total),
            },
            "deductions": {
                "ccq": {
                    "pension": float(record.ccq_pension),
                    "insurance": float(record.ccq_insurance),
                    "training": float(record.ccq_training),
                    "total": float(record.ccq_total),
                },
                "government": {
                    "federal_tax": float(record.income_tax_fed),
                    "quebec_tax": float(record.income_tax_qc),
                    "rrq": float(record.rrq),
                    "rqap": float(record.rqap),
                    "ei": float(record.ei),
                    "total": float(record.gov_total),
                },
                "total": float(record.total_deductions),
            },
            "net_pay": float(record.net_pay),
        }

# API Endpoints
@router.post("/clock-in")
async def clock_in(employee_id: str, project_id: str, task_id: Optional[str] = None,
                   lat: Optional[float] = None, lng: Optional[float] = None):
    """Clock in."""
    gps = {"lat": lat, "lng": lng} if lat and lng else None
    entry = await TimeTracker.clock_in(employee_id, project_id, task_id, gps)
    return {"id": entry.id, "start": entry.start_time.isoformat()}

@router.post("/clock-out")
async def clock_out(employee_id: str, break_minutes: int = 0, notes: str = ""):
    """Clock out."""
    entry = await TimeTracker.clock_out(employee_id, break_minutes, notes)
    return {"id": entry.id, "hours": float(entry.hours)}

@router.post("/entries")
async def add_entry(employee_id: str, project_id: str, entry_date: str,
                   start: str, end: str, break_min: int = 0, notes: str = ""):
    """Add manual entry."""
    entry = await TimeTracker.add_manual_entry(
        employee_id, project_id, date.fromisoformat(entry_date),
        start, end, break_min, notes
    )
    return {"id": entry.id, "hours": float(entry.hours)}

@router.get("/entries/{employee_id}")
async def get_entries(employee_id: str, start: str, end: str):
    """Get entries."""
    entries = await TimeTracker.get_entries(
        employee_id, date.fromisoformat(start), date.fromisoformat(end)
    )
    return {"entries": [{"id": e.id, "date": e.date.isoformat(), "hours": float(e.hours)} for e in entries]}

@router.post("/timesheets")
async def create_timesheet(employee_id: str, employee_name: str, week_start: str):
    """Generate timesheet."""
    ts = await TimesheetManager.generate_timesheet(employee_id, employee_name, date.fromisoformat(week_start))
    return {"id": ts.id, "total_hours": float(ts.total_hours), "status": ts.status.value}

@router.post("/timesheets/{ts_id}/submit")
async def submit_timesheet(ts_id: str):
    """Submit timesheet."""
    ts = await TimesheetManager.submit(ts_id)
    return {"id": ts.id, "status": ts.status.value}

@router.post("/timesheets/{ts_id}/approve")
async def approve_timesheet(ts_id: str, approver_id: str):
    """Approve timesheet."""
    ts = await TimesheetManager.approve(ts_id, approver_id)
    return {"id": ts.id, "status": ts.status.value}

@router.post("/payroll/calculate")
async def calculate_payroll(timesheet_id: str, trade: str):
    """Calculate payroll."""
    ts = TimesheetManager._timesheets.get(timesheet_id)
    if not ts:
        raise HTTPException(404, "Timesheet not found")
    record = await PayrollCalculator.calculate(ts, trade)
    return {"id": record.id, "gross": float(record.gross_total), "net": float(record.net_pay)}

@router.get("/payroll/{payroll_id}/stub")
async def get_pay_stub(payroll_id: str):
    """Get pay stub."""
    return await PayrollCalculator.get_pay_stub(payroll_id)

@router.get("/ccq/rates")
async def get_ccq_rates():
    """Get CCQ rates."""
    return {"rates": {k: float(v) for k, v in PayrollCalculator.CCQ_RATES.items()}}

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from io import BytesIO

SCHOOL_NAME = "MINHAJUSUNNAH ISLAMIC EDUCATION"
SCHOOL_SUBTITLE = "School ERP System"
SCHOOL_ADDRESS = "Kerala, India"
PRIMARY_COLOR = colors.HexColor("#0d4f3c")
ACCENT_COLOR = colors.HexColor("#c9a227")


def build_header(elements, styles, title):
    title_style = ParagraphStyle(
        "SchoolTitle",
        parent=styles["Title"],
        fontSize=20,
        textColor=PRIMARY_COLOR,
        alignment=TA_CENTER,
        fontName="Helvetica-Bold",
    )
    sub_style = ParagraphStyle(
        "SchoolSub",
        parent=styles["Normal"],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER,
    )
    doc_title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading2"],
        fontSize=13,
        alignment=TA_CENTER,
        spaceAfter=4,
        spaceBefore=10,
        textColor=colors.white,
        backColor=PRIMARY_COLOR,
        borderPadding=8,
        fontName="Helvetica-Bold",
    )
    elements.append(Paragraph(SCHOOL_NAME, title_style))
    elements.append(Paragraph(SCHOOL_SUBTITLE + " - " + SCHOOL_ADDRESS, sub_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=2, color=ACCENT_COLOR, spaceAfter=10))
    elements.append(Paragraph(title, doc_title_style))
    elements.append(Spacer(1, 14))


def make_info_table(data_pairs):
    table = Table(data_pairs, colWidths=[160, 300])
    table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 10.5),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("TEXTCOLOR", (0, 0), (0, -1), PRIMARY_COLOR),
                ("LINEBELOW", (0, 0), (-1, -2), 0.5, colors.HexColor("#dddddd")),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return table


def make_amount_box(label, amount):
    label_style = ParagraphStyle(
        "AmountLabel", fontSize=10, alignment=TA_CENTER, textColor=colors.white
    )
    amount_style = ParagraphStyle(
        "Amount",
        fontSize=16,
        alignment=TA_CENTER,
        textColor=colors.white,
        fontName="Helvetica-Bold",
    )
    table = Table(
        [[Paragraph(label, label_style)], [Paragraph(amount, amount_style)]],
        colWidths=[460],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PRIMARY_COLOR),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def build_footer(elements, styles):
    elements.append(Spacer(1, 30))
    elements.append(HRFlowable(width="100%", thickness=0.7, color=colors.HexColor("#cccccc")))
    elements.append(Spacer(1, 20))

    sig_table = Table(
        [
            ["_______________________", "_______________________"],
            ["Received By", "Authorized Signatory"],
        ],
        colWidths=[230, 230],
    )
    sig_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("TOPPADDING", (0, 1), (-1, 1), 4),
                ("TEXTCOLOR", (0, 1), (-1, 1), colors.grey),
            ]
        )
    )
    elements.append(sig_table)
    elements.append(Spacer(1, 16))

    thanks_style = ParagraphStyle(
        "Thanks", fontSize=9, alignment=TA_CENTER, textColor=colors.grey
    )
    elements.append(
        Paragraph(
            "This is a system-generated document from Minhajusunnah School ERP. "
            "Thank you for your continued trust and support.",
            thanks_style,
        )
    )


def generate_pdf_response(build_func, filename, add_footer=True):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=40,
        bottomMargin=40,
        leftMargin=40,
        rightMargin=40,
    )
    styles = getSampleStyleSheet()
    elements = []
    build_func(elements, styles)
    if add_footer:
        build_footer(elements, styles)
    doc.build(elements)
    buffer.seek(0)
    return buffer
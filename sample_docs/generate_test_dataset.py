import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def create_pdf(filename, title, metadata_items, table_data, total_text, notes=None):
    filepath = os.path.join(OUTPUT_DIR, filename)
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    elements = []
    styles = getSampleStyleSheet()

    # Title
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=14
    )
    elements.append(Paragraph(title, title_style))
    elements.append(Spacer(1, 10))

    # Metadata Header
    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155')
    )
    meta_table_data = []
    for k, v in metadata_items:
        meta_table_data.append([
            Paragraph(f"<b>{k}:</b>", meta_style),
            Paragraph(str(v), meta_style)
        ])
    meta_table = Table(meta_table_data, colWidths=[140, 380])
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 18))

    # Items Table
    t = Table(table_data, colWidths=[200, 70, 110, 140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0EA5E9')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 14))

    # Total Box
    total_style = ParagraphStyle(
        'TotalStyle',
        parent=styles['Normal'],
        fontSize=12,
        leading=16,
        alignment=2, # Right align
        textColor=colors.HexColor('#0F172A')
    )
    elements.append(Paragraph(f"<b>{total_text}</b>", total_style))

    if notes:
        elements.append(Spacer(1, 20))
        note_style = ParagraphStyle(
            'NoteStyle',
            parent=styles['Italic'],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#64748B')
        )
        elements.append(Paragraph(f"Note: {notes}", note_style))

    doc.build(elements)
    print(f"Created {filename}")

def build_all():
    # 1. Clean Invoice (Matches clean PO)
    create_pdf(
        filename="clean_invoice.pdf",
        title="COMMERCIAL TAX INVOICE",
        metadata_items=[
            ("Supplier Name", "ABC Traders Pvt Ltd"),
            ("Invoice Number", "INV-1042"),
            ("Invoice Date", "2024-10-10"),
            ("Purchase Order Ref", "PO-8801"),
            ("GSTIN", "27AABCU9603R1ZM")
        ],
        table_data=[
            ["Item Description", "Qty", "Unit Price (INR)", "Total (INR)"],
            ["Industrial Grade Bearings A1", "50", "5,000", "250,000"],
            ["Heavy Duty Drive Belts B2", "20", "7,500", "150,000"]
        ],
        total_text="Subtotal: INR 400,000 | Tax (18%): INR 72,000 | Grand Total: INR 472,000",
        notes="Standard 30-day payment terms. Verified supplier account."
    )

    # 2. Clean PO (Matches clean invoice)
    create_pdf(
        filename="clean_po.pdf",
        title="PURCHASE ORDER",
        metadata_items=[
            ("Supplier Name", "ABC Traders Pvt Ltd"),
            ("PO Number", "PO-8801"),
            ("PO Date", "2024-10-02"),
            ("Delivery Destination", "Central Warehouse Hub 4"),
            ("Buyer Contact", "Procurement Dept")
        ],
        table_data=[
            ["Item Description", "Qty", "Unit Price (INR)", "Total (INR)"],
            ["Industrial Grade Bearings A1", "50", "5,000", "250,000"],
            ["Heavy Duty Drive Belts B2", "20", "7,500", "150,000"]
        ],
        total_text="Approved Total: INR 472,000 (Incl. 18% Tax)",
        notes="Authorized purchase order matching vendor quote."
    )

    # 3. Clean Delivery Receipt (Goods Receipt Note)
    create_pdf(
        filename="clean_delivery.pdf",
        title="GOODS DELIVERY RECEIPT",
        metadata_items=[
            ("Supplier Name", "ABC Traders Pvt Ltd"),
            ("Delivery Receipt #", "DR-5521"),
            ("Purchase Order Ref", "PO-8801"),
            ("Received Date", "2024-10-08"),
            ("Receiving Officer", "R. Sharma (Inspection Passed)")
        ],
        table_data=[
            ["Item Description", "Qty Ordered", "Qty Delivered", "Condition"],
            ["Industrial Grade Bearings A1", "50", "50", "Verified Good"],
            ["Heavy Duty Drive Belts B2", "20", "20", "Verified Good"]
        ],
        total_text="All items received in full quantity and verified specification.",
        notes="Signed and stamped by warehouse quality control."
    )

    # 4. Altered Invoice (Price Mismatch / Inflated)
    create_pdf(
        filename="altered_invoice.pdf",
        title="COMMERCIAL TAX INVOICE",
        metadata_items=[
            ("Supplier Name", "ABC Traders Pvt Ltd"),
            ("Invoice Number", "INV-1043"),
            ("Invoice Date", "2024-10-12"),
            ("Purchase Order Ref", "PO-8801"),
            ("GSTIN", "27AABCU9603R1ZM")
        ],
        table_data=[
            ["Item Description", "Qty", "Unit Price (INR)", "Total (INR)"],
            ["Industrial Grade Bearings A1", "50", "8,000", "400,000"],  # Altered: 8,000 instead of 5,000
            ["Heavy Duty Drive Belts B2", "20", "7,500", "150,000"]
        ],
        total_text="Subtotal: INR 550,000 | Tax (18%): INR 99,000 | Grand Total: INR 649,000",
        notes="Price inflated on line item 1 (INR 8,000 vs approved PO rate of INR 5,000)."
    )

    # 5. Duplicate Invoice (Exact copy of INV-1042 for duplicate fraud test)
    create_pdf(
        filename="duplicate_invoice.pdf",
        title="COMMERCIAL TAX INVOICE",
        metadata_items=[
            ("Supplier Name", "ABC Traders Pvt Ltd"),
            ("Invoice Number", "INV-1042"), # Same ID
            ("Invoice Date", "2024-10-10"),
            ("Purchase Order Ref", "PO-8801"),
            ("GSTIN", "27AABCU9603R1ZM")
        ],
        table_data=[
            ["Item Description", "Qty", "Unit Price (INR)", "Total (INR)"],
            ["Industrial Grade Bearings A1", "50", "5,000", "250,000"],
            ["Heavy Duty Drive Belts B2", "20", "7,500", "150,000"]
        ],
        total_text="Subtotal: INR 400,000 | Tax (18%): INR 72,000 | Grand Total: INR 472,000",
        notes="Duplicate submission intended to test duplicate invoice fraud detection."
    )

if __name__ == "__main__":
    build_all()

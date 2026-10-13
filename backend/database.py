import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "invoicetrust.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Invoices and extracted metadata table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id TEXT UNIQUE,
            supplier TEXT,
            total_amount REAL,
            risk_score INTEGER,
            risk_level TEXT,
            status TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Document Hashes Table (Level 1 Duplicate Detection)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS document_hashes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id TEXT,
            file_type TEXT,
            sha256_hash TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Audit Trail Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audit_trail (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id TEXT,
            event_type TEXT,
            details TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize DB on import
init_db()

def save_invoice(invoice_id: str, supplier: str, total_amount: float, risk_score: int, risk_level: str, status: str = "VERIFIED"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT OR REPLACE INTO invoices (invoice_id, supplier, total_amount, risk_score, risk_level, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (invoice_id, supplier, total_amount, risk_score, risk_level, status))
    conn.commit()
    conn.close()

def save_document_hash(invoice_id: str, file_type: str, sha256_hash: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT OR IGNORE INTO document_hashes (invoice_id, file_type, sha256_hash)
        VALUES (?, ?, ?)
    ''', (invoice_id, file_type, sha256_hash))
    conn.commit()
    conn.close()
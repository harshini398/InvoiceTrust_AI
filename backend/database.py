import sqlite3

DB_FILE = "invoicetrust.db"

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id TEXT UNIQUE,
            supplier TEXT,
            total_amount REAL,
            risk_score INTEGER,
            risk_level TEXT,
            payment_status TEXT DEFAULT 'UNPAID',
            status TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Auto-migrate payment_status column if upgrading existing database
    cursor.execute("PRAGMA table_info(invoices)")
    existing_cols = [row[1] for row in cursor.fetchall()]
    if "payment_status" not in existing_cols:
        cursor.execute("ALTER TABLE invoices ADD COLUMN payment_status TEXT DEFAULT 'UNPAID'")
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS document_hashes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id TEXT,
            file_type TEXT,
            sha256_hash TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
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

init_db()
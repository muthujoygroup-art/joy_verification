import psycopg2

conn = psycopg2.connect("postgresql://postgres:Muthu%40123@127.0.0.1:5432/joy_verification")
cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;")
tables = [row[0] for row in cur.fetchall()]
print(f"Total PostgreSQL Tables Created: {len(tables)}")
for t in tables:
    cur.execute(f'SELECT count(*) FROM "{t}";')
    cnt = cur.fetchone()[0]
    print(f"  [OK] {t} ({cnt} records)")
cur.close()
conn.close()

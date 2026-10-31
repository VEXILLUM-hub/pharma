"""Single-user local SQLite history. Do not publish this DB without authentication."""
from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / 'local_data' / 'interviews.sqlite3'


def connect():
    DB_PATH.parent.mkdir(parents=True,exist_ok=True)
    cx=sqlite3.connect(DB_PATH,timeout=15)
    cx.execute('PRAGMA busy_timeout=15000')
    cx.execute('CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, role TEXT NOT NULL, specialty TEXT NOT NULL, mode TEXT NOT NULL, data TEXT NOT NULL)')
    cx.execute('CREATE TABLE IF NOT EXISTS seen (role TEXT NOT NULL, question TEXT NOT NULL, seen_at TEXT NOT NULL, PRIMARY KEY (role,question))')
    cx.commit()
    return cx


def save_session(record:dict) -> int:
    with connect() as cx:
        cur=cx.execute('INSERT INTO sessions (created_at,role,specialty,mode,data) VALUES (?,?,?,?,?)',
                       (record['created_at'],record['role'],record['specialty'],record['mode'],json.dumps(record,ensure_ascii=False)))
        for a in record['answers']:
            if a['question'].get('kind') == '꼬리질문':
                continue
            cx.execute('INSERT INTO seen(role,question,seen_at) VALUES (?,?,?) ON CONFLICT(role,question) DO UPDATE SET seen_at=excluded.seen_at',
                       (record['role_id'],a['question']['text'],record['created_at']))
        return cur.lastrowid


def read_history(limit:int=100)->list[dict]:
    with connect() as cx:
        return [dict(id=row[0],**json.loads(row[1])) for row in cx.execute('SELECT id,data FROM sessions ORDER BY id DESC LIMIT ?', (limit,))]


def read_seen(role_id:str)->set[str]:
    with connect() as cx:
        return {row[0] for row in cx.execute('SELECT question FROM seen WHERE role=?',(role_id,))}


def clear_history()->None:
    with connect() as cx:
        cx.execute('DELETE FROM sessions')
        cx.execute('DELETE FROM seen')

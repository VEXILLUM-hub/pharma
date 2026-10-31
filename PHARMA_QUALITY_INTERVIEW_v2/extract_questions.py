"""Extract only the textual data from user-provided browser-side JS assets.

No JavaScript is executed by this script.
"""
import ast
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'assets' / 'original_source'


def extract():
    question_source = (SOURCE / 'questions.js').read_text(encoding='utf-8-sig')
    blocks = re.findall(r'\b([A-Za-z][A-Za-z0-9]*):`(.*?)`\.split\(\'\|\'\)', question_source, re.S)
    if len(blocks) != 17:
        raise ValueError(f'Expected 17 question categories (15 role categories and 2 HR), found {len(blocks)}')
    questions = {key: block.split('|') for key, block in blocks}
    if sum(map(len, questions.values())) != 315:
        raise ValueError('Unexpected original question count')
    js = (SOURCE / 'app.js').read_text(encoding='utf-8-sig')
    start = js.index('const jobs=[')+len('const jobs=[')
    end = js.index('].map(([id,name,group,subs,icon,q1,q2,q3,keys])',start)
    job_body = js[start:end]
    jobs = []
    for line in job_body.splitlines():
        s = line.strip().rstrip(',')
        if not s.startswith('['):
            continue
        parts = ast.literal_eval(s)
        if len(parts) != 9:
            raise ValueError(f'Invalid role row: {parts}')
        id_, name, group, subs, icon, q1, q2, q3, keys = parts
        jobs.append(dict(id=id_, name=name, group=group, specialties=subs.split(','), symbol=icon, starter_questions=[q1,q2,q3], keywords=keys.split(',')))
    if len(jobs) != 15:
        raise ValueError(f'Expected 15 roles, found {len(jobs)}')
    out = dict(source='User-supplied questions.js and app.js; questions retain original wording', questions=questions, jobs=jobs, total_questions=sum(map(len,questions.values())))
    (ROOT / 'data' / 'question_bank.json').write_text(json.dumps(out, ensure_ascii=False, indent=2),encoding='utf-8')
    return out


if __name__ == '__main__':
    bank=extract()
    print(f"Extracted {bank['total_questions']} questions and {len(bank['jobs'])} roles")

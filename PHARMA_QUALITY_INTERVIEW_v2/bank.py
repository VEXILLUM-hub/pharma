"""15-role, 315-original-question library and interview session builder."""
from __future__ import annotations

import json
import random
from pathlib import Path

DATA = Path(__file__).resolve().parent / 'data' / 'question_bank.json'


def load_bank() -> dict:
    bank = json.loads(DATA.read_text(encoding='utf-8'))
    ext = json.loads((DATA.parent / 'di_extension.json').read_text(encoding='utf-8'))
    bank['jobs'].append({k:v for k,v in ext.items() if k!='questions'})
    bank['questions'][ext['id']]=ext['questions']
    bank['extended_question_count']=len(ext['questions'])
    bank['specialty_questions']=json.loads((DATA.parent / 'specialty_questions.json').read_text(encoding='utf-8'))
    return bank


def get_role(bank: dict, role_id: str) -> dict:
    return next(j for j in bank['jobs'] if j['id'] == role_id)


PERSONAS = ['인사팀장', '인사팀원', '실무팀장', '실무실장']
FIXED = [
    ('1분 자기소개를 해 주세요.', 0),
    ('본인의 성격의 장점과 단점을 말씀해 주세요.', 1),
    ('우리에게 하고 싶은 질문이 있습니까?', 0),
    ('마지막으로 하고 싶은 말씀을 해 주세요.', 3),
]


def make_session_questions(bank: dict, role_id: str, type_: str = '통합', count: int = 8, seen: set[str] | None = None, seed: int | None = None, specialty: str = '') -> list[dict]:
    if count not in (8, 12):
        raise ValueError('count must be 8 or 12')
    if type_ not in ('통합', '인성', '직무'):
        raise ValueError('type_ must be 통합, 인성, or 직무')
    role = get_role(bank,role_id)
    rng = random.Random(seed)
    seen = seen or set()
    bank_human = bank['questions']['hrLead'] + bank['questions']['hrMember']
    bank_tech = bank['questions'][role_id]
    others = {text for text, _ in FIXED}
    human = [x for x in bank_human if x not in others]
    tech = list(dict.fromkeys(role['starter_questions'] + bank_tech))
    sp=bank.get('specialty_questions',{}).get(specialty)
    if sp and role_id not in ('di',):
        tech.insert(0,sp['question'])

    def sample(pool: list[str], num: int) -> list[str]:
        fresh = [q for q in pool if q not in seen]
        old = [q for q in pool if q in seen]
        rng.shuffle(fresh)
        rng.shuffle(old)
        return (fresh + old)[:num]

    def pick_tech(n: int) -> list[str]:
        # Prioritize the selected specialty's directly related original question.
        priority = [sp['question']] if sp and n > 0 else []
        remaining = [q for q in tech if q not in priority]
        return priority + sample(remaining, n - len(priority))

    change = count - len(FIXED)
    if type_ == '인성':
        selected = [('인성', q) for q in sample(human,change)]
    elif type_ == '직무':
        selected = [('직무', q) for q in pick_tech(change)]
    else:
        n_human = change // 2
        selected = [('인성',q) for q in sample(human,n_human)] + [('직무',q) for q in pick_tech(change-n_human)]
    rng.shuffle(selected)
    items = [dict(text=FIXED[0][0], persona=0, kind='공통', keywords=[], fixed=True), dict(text=FIXED[1][0], persona=1, kind='공통', keywords=[], fixed=True)]
    tech_index = 0
    hr_index = 0
    for kind,q in selected:
        if kind == '인성':
            persona = hr_index % 2
            hr_index += 1
        else:
            persona = 2 + tech_index % 2
            tech_index += 1
        keywords=(sp['keywords'] if kind == '직무' and sp and q==sp['question'] else role['keywords'] if kind == '직무' else ['경험','행동','결과'])
        items.append(dict(text=q,persona=persona,kind=kind,keywords=keywords,fixed=False))
    items += [dict(text=FIXED[2][0], persona=0, kind='공통', keywords=[], fixed=True),dict(text=FIXED[3][0],persona=3,kind='공통',keywords=[],fixed=True)]
    for i, item in enumerate(items, 1):
        item['number'] = i
    return items


def fallback_followup(question: dict, answer: str, seed: int | None = None) -> dict:
    rng = random.Random(seed)
    if answer.strip() == '[답변 보류]':
        pool = ['어려웠던 부분을 한 가지 골라 설명해 주세요.', '답변하기 전에 어떤 정보를 먼저 확인해야 합니까?']
    elif question['persona'] < 2:
        pool = ['그 경험에서 본인이 직접 맡은 행동을 구체적으로 구분해 주세요.', '그 결과를 어떤 근거로 확인했나요?', '다시 같은 상황을 겪는다면 어떻게 다르게 행동하시겠습니까?']
    else:
        pool = ['방금 설명한 대응의 우선순위와 판단 근거를 말해 주세요.', '필요한 승인과 기록을 구체적으로 설명해 주세요.', '해당 대응으로도 해결되지 않는다면 다음 단계는 무엇입니까?']
    return dict(text=rng.choice(pool),persona=question['persona'],kind='꼬리질문',keywords=question.get('keywords',[]),fixed=False,number=question.get('number',0))

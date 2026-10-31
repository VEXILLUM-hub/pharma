from pathlib import Path
import json
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from bank import PERSONAS, load_bank, make_session_questions, fallback_followup
from evaluator import RUBRIC, offline_check, _normalize_review


def test_original_bank_preserved():
    bank=load_bank()
    assert bank['total_questions']==315
    assert bank['extended_question_count']==20
    assert len(bank['jobs'])==16
    assert len(bank['questions']['chem'])==20
    assert len(bank['questions']['qa'])==20
    assert len(bank['questions']['di'])==20
    assert len(PERSONAS)==4


def test_session_types_and_sizes():
    bank=load_bank()
    for job in ['chem','qa','micro','di']:
        for category in ['통합','직무','인성']:
            for count in [8,12]:
                qs=make_session_questions(bank,job,category,count,seed=100)
                assert len(qs)==count
                assert qs[0]['text'].startswith('1분 자기소개')
                assert qs[-1]['text'].startswith('마지막으로')
                assert len({q['text'] for q in qs}) == count
                assert all(q['persona'] in range(4) for q in qs)


def test_seen_questions_deprioritized():
    bank=load_bank()
    seen=set(bank['questions']['chem'][:10])
    qs=make_session_questions(bank,'chem','직무',8,seen=seen,seed=1)
    assert not seen.intersection(x['text'] for x in qs)


def test_offline_does_not_claim_ai_score():
    q={'text':'OOS?', 'keywords':['OOS','원인','보고']}
    out=offline_check(q,'원인을 확인하고 먼저 보고하겠습니다.')
    assert out['mode']=='offline'
    assert 'total' not in out and 'scores' not in out


def test_llm_score_cap_and_fields():
    bogus={'scores':{k:999 for k in RUBRIC}, 'strengths':['good'], 'follow_up':'추가 설명해 주세요.'}
    out=_normalize_review(bogus)
    assert out['total']==100
    assert out['mode']=='llm'
    assert out['follow_up']=='추가 설명해 주세요.'


def test_followup_preserves_persona():
    q={'persona':2,'kind':'직무','text':'QC OOS 대응?', 'number':3,'keywords':['OOS']}
    extra=fallback_followup(q,'원자료를 확인하겠습니다.',seed=0)
    assert extra['persona']==2 and extra['kind']=='꼬리질문'


def test_selected_specialty_question_is_prioritized():
    bank=load_bank()
    qs=make_session_questions(bank,'qa','직무',8,seed=11,specialty='일탈·CAPA')
    assert any(q['text']=='CAPA의 조치 완료와 효과 확인은 어떻게 다릅니까?' for q in qs)
    selected=next(q for q in qs if q['text'].startswith('CAPA의 조치 완료'))
    assert '효과' in selected['keywords']

def test_rubric_sums_to_hundred():
    assert sum(RUBRIC.values()) == 100

"""PHARMA QUALITY INTERVIEW — Streamlit practice studio.

Original user-supplied browser assets are preserved in assets/original_source.
The functional Streamlit implementation is independently written in Python.
"""
from __future__ import annotations

import html
import json
import os
from datetime import datetime
from pathlib import Path

import streamlit as st

from bank import PERSONAS, fallback_followup, get_role, load_bank, make_session_questions
from evaluator import RUBRIC, llm_check, offline_check, transcribe_audio
from storage import clear_history, read_history, read_seen, save_session

ROOT = Path(__file__).resolve().parent
st.set_page_config(page_title='PHARMA QUALITY INTERVIEW', page_icon='🧪',layout='wide',initial_sidebar_state='expanded')
st.markdown((ROOT/'assets'/'app_theme.css').read_text(encoding='utf-8'),unsafe_allow_html=True)
bank=load_bank()

DEFAULT_BACKGROUND = (
    '대학원 인턴(4개월): GC-MS를 이용한 EO 잔류 분석 조건 검토, 검출 가능 수준 ILOD 0.003 mg/kg 확보. '
    '학부연구생(1년): 16S rRNA PCR, Colony PCR, 무균조작 및 반복 실패 실험 개선. '
    'QbD 제조품질 프로젝트: 1,005개 배치, 196개 변수, 전처리·변경 이력·의사결정 근거 문서화. '
    '제약 GMP 교육: 문서관리, OOS, 일탈, CAPA, 변경관리, Data Integrity를 학습. '
    '이 내용은 지원자가 제공한 경험 요약이므로 새로운 수치·성과를 창작하지 않습니다.'
)


def setup():
    defaults = dict(page='면접실', api_key='', model='gpt-4.1-mini', background=DEFAULT_BACKGROUND,
                    role_id='chem', specialty='원료', company='', job_posting='', career='신입', qtype='통합', mode='연습',
                    qcount=8, include_followup=True, interview=None, current_feedback=None,
                    draft='', report=None)
    for k,v in defaults.items():
        if k not in st.session_state: st.session_state[k]=v
setup()


def safe(value):
    return html.escape(str(value),quote=True)


def get_api_key():
    key=st.session_state.get('api_key','').strip()
    if key: return key
    if os.getenv('OPENAI_API_KEY'): return os.environ['OPENAI_API_KEY']
    try: return str(st.secrets.get('OPENAI_API_KEY',''))
    except Exception: return ''


def get_model():
    return st.session_state.get('model','gpt-4.1-mini').strip() or 'gpt-4.1-mini'


def header():
    st.markdown('<div class="studio-brand"><div class="studio-logo">P<span>+</span></div><div>PHARMA QUALITY INTERVIEW <small>제약 QA · QC · DI 모의면접 스튜디오</small></div></div>',unsafe_allow_html=True)


def show_report(review):
    if not review: return
    if review.get('mode')!='llm':
        st.info('오프라인 점검: AI 의미 분석이나 점수 산정이 아닙니다.')
        c1,c2,c3=st.columns(3)
        c1.metric('답변 글자 수', f"{review.get('length',0)}자")
        c2.metric('연관 표현', f"{len(review.get('keywords',[]))}개")
        c3.metric('설명 순서 표현', '발견' if review.get('order') else '미발견')
        if review.get('keywords'): st.write('확인된 연관 표현:', ' · '.join(review['keywords']))
        for item in review.get('improvements',[]): st.write('•',item)
        st.caption(review.get('note',''))
        return
    st.metric('AI 종합 평가',f"{review.get('total',0)} / 100",help='학습용 참고 점수이며 실제 채용 점수가 아닙니다.')
    for k,limit in RUBRIC.items():
        score=review.get('scores',{}).get(k,0)
        st.write(f'**{k}** · {score}/{limit}')
        st.progress(min(1,score/limit))
    if review.get('one_line'): st.markdown(f"**총평:** {review['one_line']}")
    left,right=st.columns(2)
    with left:
        st.markdown('#### 잘한 점')
        for t in review.get('strengths',[]): st.write('•', t)
    with right:
        st.markdown('#### 보완할 점')
        for t in review.get('improvements',[]): st.write('•',t)
    if review.get('risk_flags'):
        st.warning('품질·기록 관련 주의: '+ ' / '.join(review['risk_flags']))
    if review.get('uncertainty'): st.caption('확인 필요: '+review['uncertainty'])
    with st.expander('개선된 답변 예시',expanded=False):
        st.write(review.get('better_answer') or '생성된 예시가 없습니다.')
    st.caption(review.get('note',''))


def start_interview():
    role_id=st.session_state.role_id
    role=get_role(bank,role_id)
    if st.session_state.specialty not in role['specialties']:
        st.session_state.specialty=role['specialties'][0]
    queue=make_session_questions(bank,role_id,st.session_state.qtype,st.session_state.qcount,read_seen(role_id),specialty=st.session_state.specialty)
    st.session_state.interview=dict(role_id=role_id,role=role['name'],specialty=st.session_state.specialty,
                                    career=st.session_state.career,company=st.session_state.company.strip(),job_posting=st.session_state.job_posting.strip(),mode=st.session_state.mode,
                                    question_type=st.session_state.qtype,started_at=datetime.now().isoformat(timespec='seconds'),
                                    queue=queue,index=0,answers=[],followups_created=0,include_followup=st.session_state.include_followup)
    st.session_state.draft=''
    st.session_state.pop('recorded_audio',None)
    st.session_state.current_feedback=None
    st.session_state.report=None
    st.rerun()


def finalize():
    session=st.session_state.interview
    record=dict(created_at=datetime.now().isoformat(timespec='seconds'),started_at=session['started_at'],
                role=session['role'],role_id=session['role_id'],specialty=session['specialty'],career=session['career'],
                mode=session['mode'],company=session.get('company',''),question_type=session['question_type'], answers=session['answers'])
    record['id']=save_session(record)
    st.session_state.report=record
    st.session_state.interview=None
    st.session_state.current_feedback=None
    st.session_state.draft=''
    st.session_state.pop('recorded_audio',None)
    st.rerun()


def advance():
    session=st.session_state.interview
    session['index']+=1
    st.session_state.draft=''
    st.session_state.pop('recorded_audio',None)
    st.session_state.current_feedback=None
    if session['index']>=len(session['queue']):
        finalize()
    else:
        st.rerun()


def submit_answer(skip:bool=False):
    session=st.session_state.interview
    q=session['queue'][session['index']]
    ans='[답변 보류]' if skip else st.session_state.draft.strip()
    if not ans: st.warning('답변을 입력하거나 답변 보류를 선택하세요.');return
    key=get_api_key()
    if key and not skip:
        try:
            with st.spinner('LLM이 답변을 분석하고 있습니다...'):
                feedback=llm_check(q,ans,session['role'],session['specialty'],st.session_state.background,key,get_model(),company=session.get('company',''),job_posting=session.get('job_posting',''))
        except Exception as ex:
            # Never echo API credentials, response payloads or raw provider errors.
            st.warning(f'LLM 평가에 실패하여 오프라인 점검으로 전환합니다. 연결 상태와 모델명을 확인하세요. ({type(ex).__name__})')
            feedback=offline_check(q,ans)
    else:
        feedback=offline_check(q,ans)

    session['answers'].append(dict(question=q,answer=ans,evaluation=feedback))
    if session['include_followup'] and not q.get('fixed') and q.get('kind') == '직무' and session['followups_created']<2:
        follow_text=feedback.get('follow_up','').strip() if feedback.get('mode')=='llm' else ''
        if follow_text and follow_text != q['text']:
            new_q=dict(text=follow_text,persona=q['persona'],kind='꼬리질문',keywords=q.get('keywords',[]),fixed=False,number=q['number'])
        else:
            new_q=fallback_followup(q,ans)
        session['queue'].insert(session['index']+1,new_q)
        session['followups_created']+=1
    st.session_state.current_feedback=feedback
    if session['mode']=='실전':
        advance()
    else:
        st.rerun()


def transcribe_current():
    recorded=st.session_state.get('recorded_audio')
    if recorded is None: st.warning('먼저 녹음하세요.'); return
    api_key=get_api_key()
    if not api_key: st.warning('음성 받아쓰기는 OpenAI API 키가 필요합니다.');return
    try:
        transcription=transcribe_audio(api_key,recorded.getvalue())
        st.session_state.draft=(st.session_state.get('draft','')+' '+transcription).strip()[:12000]
        st.session_state['recorded_audio']=None
        st.toast('음성 인식 결과를 답변에 추가했습니다.')
    except Exception as ex:
        st.error('음성 변환에 실패했습니다. API 연결과 마이크 권한을 확인하세요. ('+type(ex).__name__+')')


def interview_setup():
    st.markdown('<div class="eyebrow">YOUR NEXT CAREER STARTS HERE</div><h1 class="headline">첫 질문 앞에서도,<br><span>내 경험으로 답할 수 있게.</span></h1><p class="lead">원본 315문항 + DI 확장 20문항 · 4명의 면접관 · 선택형 LLM 평가</p>',unsafe_allow_html=True)
    st.markdown('### 01 · 지원 직무 선택')
    groups=['품질','생산','연구·허가','설비·운영']
    selected_group=st.segmented_control('직무 범주',options=['전체']+groups,default='품질',key='group_filter') or '전체'
    roles=[j for j in bank['jobs'] if selected_group=='전체' or j['group']==selected_group]
    role_ids=[j['id'] for j in roles]
    if st.session_state.role_id not in role_ids:
        st.session_state.role_id=role_ids[0]
    st.radio('직무',role_ids,format_func=lambda x:get_role(bank,x)['name'],horizontal=True,key='role_id')
    role=get_role(bank,st.session_state.role_id)
    st.caption(' · '.join(role['specialties']))
    st.markdown('### 02 · 면접 조건')
    with st.expander('지원 기업 및 채용공고 반영 (선택)',expanded=False):
        st.text_input('지원 기업명',key='company',placeholder='예: 지원 예정인 제약회사')
        st.text_area('채용공고의 직무 설명 또는 요구 역량',key='job_posting',height=110,max_chars=6000,placeholder='실제 채용공고에 적힌 주요 업무와 요구사항을 붙여 넣으세요.')
        st.caption('입력 내용은 AI 평가 요청에만 참고하며 회사의 공식 정보로 검증되지는 않습니다.')
    c1,c2,c3=st.columns(3)
    with c1:
        if st.session_state.specialty not in role['specialties']:
            st.session_state.specialty=role['specialties'][0]
        st.selectbox('세부 업무',role['specialties'],key='specialty')
    with c2:
        st.radio('지원 구분',['신입','경력'],horizontal=True,key='career')
        st.radio('질문 유형',['통합','인성','직무'],horizontal=True,key='qtype')
    with c3:
        st.radio('진행 방식',['연습','실전'],horizontal=True,key='mode')
        st.selectbox('기본 질문 수',[8,12],key='qcount')
    st.toggle('직무 질문에 꼬리질문 추가 (최대 2개)',key='include_followup')
    st.info('연습 모드는 답변 후 즉시 피드백을 보여줍니다. 실전 모드는 종료 시 한 번에 피드백을 확인합니다.')
    st.button('면접 시작하기 →',type='primary',use_container_width=True,on_click=start_interview)
    st.caption('원본 업로드 질문과 구성을 참고한 별도의 Streamlit 구현입니다. 실제 회사의 기출문제나 합격 가능성 예측이 아닙니다.')


def interview_run():
    session=st.session_state.interview
    q=session['queue'][session['index']]
    n=session['index']
    st.markdown(f"<div class='eyebrow'>INTERVIEW SESSION · {safe(session['role'])} · {safe(session['specialty'])}</div>",unsafe_allow_html=True)
    st.progress(n/len(session['queue']),text=f"{n+1} / {len(session['queue'])}문항 · {session['mode']} 모드")
    persona=PERSONAS[q['persona']]
    cols=st.columns(4)
    for i,col in enumerate(cols):
        with col:
            status='질문 중' if i==q['persona'] else '대기'
            st.markdown(f"<div class='interviewer {'active' if i==q['persona'] else ''}'><div class='person-icon'>👤</div><b>{PERSONAS[i]}</b><small>{status}</small></div>",unsafe_allow_html=True)
    st.markdown(f"<div class='question-panel'><div class='eyebrow'>{safe(q['kind'])} · {safe(persona)}</div><h2>{safe(q['text'])}</h2></div>",unsafe_allow_html=True)
    already_submitted=st.session_state.current_feedback is not None
    if not already_submitted:
        st.text_area('나의 답변',height=210,placeholder='본인의 경험 → 행동 → 판단 근거 → 결과 순서로 답변하세요.',key='draft',max_chars=12000)
        with st.expander('마이크로 답변하기 (API 키 필요)'):
            if hasattr(st,'audio_input'):
                st.audio_input('녹음',key='recorded_audio')
                st.button('녹음 내용을 텍스트로 변환',on_click=transcribe_current,disabled=not bool(get_api_key()))
            else: st.info('현재 Streamlit 버전은 st.audio_input을 지원하지 않습니다.')
        a,b,c=st.columns([2,1,1])
        with a: st.button('답변 제출 · 평가받기',type='primary',use_container_width=True,on_click=submit_answer)
        with b: st.button('답변 보류',use_container_width=True,on_click=submit_answer,args=(True,))
        with c: st.button('현재까지 종료·저장',use_container_width=True,on_click=finalize)
    else:
        with st.container(border=True):
            st.markdown('### 답변 피드백')
            show_report(st.session_state.current_feedback)
        a,b=st.columns([1,1])
        with a: st.button('다음 질문 →',type='primary',use_container_width=True,on_click=advance)
        with b: st.button('현재까지 종료·저장',use_container_width=True,on_click=finalize)
    with st.expander('면접 진행 현황'):
        for i,item in enumerate(session['queue']):
            st.write(('●' if i==n else '✓' if i<n else '○'),f"{item['kind']} · {PERSONAS[item['persona']]}",'-',item['text'])


def formatted_export(record:dict)->str:
    lines=[f"# {record['role']} 모의면접 기록",f"일시: {record['created_at']}",f"세부 직무: {record['specialty']}",f"방식: {record['mode']}",'']
    for i,a in enumerate(record['answers'],1):
        evaluation=a.get('evaluation',{})
        lines.extend([f"## {i}. {a['question']['text']}",f"면접관: {PERSONAS[a['question']['persona']]}",f"답변: {a['answer']}",''])
        if evaluation.get('mode')=='llm':
            lines.extend([f"AI 점수(연습용): {evaluation.get('total',0)}/100",f"총평: {evaluation.get('one_line','')}",f"개선안: {'; '.join(evaluation.get('improvements',[]))}",f"개선 답변 예시: {evaluation.get('better_answer','')}",''])
        else: lines.extend(['점검: 오프라인 표현 기준(점수 없음)',f"개선안: {'; '.join(evaluation.get('improvements',[]))}",''])
    return '\n'.join(lines)


def report_view(record:dict):
    st.markdown('<div class="eyebrow">INTERVIEW REVIEW</div><h1 class="headline">오늘의 답변이,<br><span>다음 면접의 준비가 됩니다.</span></h1>',unsafe_allow_html=True)
    st.write(f"**{record['role']}** · {record['specialty']} · {record['created_at']}")
    if record.get('company'): st.caption('지원 기업(사용자 입력): '+ record['company'])
    answers=record['answers']
    ai_scores=[a['evaluation'].get('total') for a in answers if a['evaluation'].get('mode')=='llm']
    a,b,c=st.columns(3)
    a.metric('답변 수',len(answers))
    b.metric('LLM 평가 수',len(ai_scores))
    c.metric('LLM 평가 평균',f'{round(sum(ai_scores)/len(ai_scores),1)}점' if ai_scores else '없음')
    st.download_button('전체 면접 기록 다운로드 (.md)',formatted_export(record),file_name=f"pharma_interview_{record['created_at'][:10]}.md",mime='text/markdown')
    for i,entry in enumerate(answers,1):
        with st.expander(f"{i}. {entry['question']['text']}",expanded=i==1):
            st.caption(PERSONAS[entry['question']['persona']])
            st.markdown('**나의 답변**')
            st.write(entry['answer'])
            show_report(entry['evaluation'])
    st.button('새 면접 시작하기',type='primary',on_click=lambda:setattr(st.session_state,'report',None))


def bank_view():
    st.markdown('## 질문은행')
    st.caption('원본 questions.js의 315문항(15개 직무 × 20 + 인성 15)과 별도 작성한 DI 20문항을 제공합니다. 선택 업무 질문은 원본 app.js에서도 일부 추출했습니다.')
    roles=bank['jobs']
    label_map={'hrLead':'인사팀장 · 공통','hrMember':'인사팀원 · 공통',**{j['id']:j['name'] for j in roles}}
    a,b=st.columns([1,2])
    with a: category=st.selectbox('질문 범주',list(bank['questions']),format_func=lambda x:label_map.get(x,x))
    with b: query=st.text_input('질문 검색',placeholder='예: OOS, CAPA, HPLC, 변경관리')
    qs=bank['questions'][category]
    for i,q in enumerate(qs,1):
        if query and query.lower() not in q.lower(): continue
        st.markdown(f'<div class="bank-q"><span>{i:02d}</span> {safe(q)}</div>',unsafe_allow_html=True)


def history_view():
    st.markdown('## 지난 면접 기록')
    st.caption('이력은 이 컴퓨터의 로컬 SQLite 파일에 저장됩니다. 인증 없는 공개 배포에는 적합하지 않습니다.')
    records=read_history()
    if not records:
        st.info('아직 저장된 면접이 없습니다.')
    else:
        options=list(range(len(records)))
        idx=st.selectbox('면접 선택',options,format_func=lambda i:f"{records[i]['created_at']} · {records[i]['role']} · {len(records[i]['answers'])}문항")
        record=records[idx]
        with st.expander('면접 전체 평가 및 문항별 답변',expanded=True):
            report_view(record)
    with st.expander('기록 관리 / 전체 삭제'):
        st.warning('삭제 시 모든 면접 이력과 출제 이력이 삭제됩니다. 복구할 수 없습니다.')
        if st.checkbox('삭제할 내용을 확인했습니다',key='confirm_delete'):
            if st.button('모든 기록 삭제',type='secondary'):
                clear_history();st.success('삭제했습니다.');st.rerun()


def sidebar():
    with st.sidebar:
        st.markdown('### 학습 메뉴')
        st.radio('이동',['면접실','질문은행','지난 연습','AI 설정'],key='page',label_visibility='collapsed')
        st.divider()
        st.markdown('### AI 연결')
        st.text_input('OpenAI API 키',type='password',key='api_key',placeholder='sk-...')
        st.text_input('LLM 모델명',key='model')
        key=get_api_key()
        st.markdown('<div class="mode-chip">'+('● LLM 평가 활성화' if key else '○ 오프라인 연습 모드')+'</div>',unsafe_allow_html=True)
        st.caption('API 키가 없어도 335문항 질문은행과 규칙 기반 표현 점검을 사용할 수 있습니다.')
        st.divider()
        st.markdown('**실행 안내**')
        st.caption('원본 JS/HTML/CSS는 assets/original_source에 보존되어 있습니다. AI 채점은 연습용이며 GMP 공식 판정을 대신하지 않습니다.')


def settings_view():
    st.markdown('## AI 설정 · 개인 경험 자료')
    st.write('OpenAI API 키를 입력하면 문맥 기반 평가, 개선 답변, AI 꼬리질문이 활성화됩니다. 키는 프로젝트 파일이나 DB에 저장하지 않습니다.')
    st.info('왼쪽 사이드바에서 API 키와 모델명을 입력하세요. 이 입력란은 다른 메뉴로 이동해도 유지됩니다.')
    st.caption('API 호출에는 사용량에 따른 별도 비용이 발생합니다. ChatGPT 구독과 API 요금은 별개입니다.')
    st.markdown('### 내 연구·프로젝트 경험')
    if '_background_edit' not in st.session_state:
        st.session_state['_background_edit']=st.session_state.background
    def save_background():
        st.session_state.background=st.session_state['_background_edit']
    st.text_area('LLM이 답변의 진위와 맞춤형 피드백을 판단할 때 참고할 이력',key='_background_edit',height=180,on_change=save_background,
                 help='이 문장은 현재 브라우저 세션에 보관되며 API 평가 시 외부 모델로 전송됩니다. 민감한 정보는 입력하지 마세요.')
    st.info('사용자 제공 경력 요약을 초깃값으로 입력했습니다. 실제 이력과 다른 내용이 있다면 수정하세요. 개인 경험은 모델의 근거 자료일 뿐 자동으로 사실 검증되지는 않습니다.')
    with st.expander('질문은행 및 소스 사용 정보'):
        st.write(f"원본 질문은행 {bank['total_questions']}개 + 신규 DI {bank['extended_question_count']}개, 직무 {len(bank['jobs'])}개")
        st.write('원본 자료: questions.js, app.js, style.css, (index)')
        st.write('원본 파일은 참조용으로 함께 제공되며, Python 프로그램은 독립 구현입니다. 원본의 배포·재사용 권한은 별도로 확인해야 합니다.')


header()
sidebar()
page=st.session_state.page
if page=='면접실':
    if st.session_state.report is not None:
        report_view(st.session_state.report)
    elif st.session_state.interview is None:
        interview_setup()
    else: interview_run()
elif page=='질문은행':bank_view()
elif page=='지난 연습':history_view()
else:settings_view()

st.divider()
st.caption('PHARMA QUALITY INTERVIEW · 개인 학습용 · 원본 질문 데이터는 사용자가 제공 · API 기반 피드백은 학습 참고자료')

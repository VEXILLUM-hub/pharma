'use strict';
const $=s=>document.querySelector(s), app=$('#app');
const jobs=[
['solid','고형제 생산팀','생산','칭량,혼합,과립,타정,코팅,캡슐충전,포장','▧','작업 시작 전 제조지시서와 원자재를 어떤 순서로 확인하겠습니까?','공정 중 품질 이상을 발견했는데 생산 일정이 촉박하다면 어떻게 대응하겠습니까?','이전 제품이 남아 있는 상황에서 다음 제품 작업을 시작하라는 요청을 받으면 어떻게 하겠습니까?','제조지시서,식별,수량,라인클리어런스,기록,보고,격리'],
['chem','고형제 이화학 QC','품질','원료,완제품,안정성시험','⌁','시험 시작 전 표준품·검체·장비에서 확인해야 할 사항을 설명해 주세요.','시험 결과가 규격을 벗어났을 때 첫 대응과 조사 순서를 설명해 주세요.','출하 일정 때문에 이상 결과를 제외하고 재시험하자는 요청을 받으면 어떻게 하겠습니까?','표준품,유효기간,교정,적합성,원자료,조사,보고'],
['micro','고형제 미생물 QC','품질','미생물한도,제조용수,환경모니터링','⊙','미생물 시험에서 시료 채취부터 배양까지 오염을 예방하는 방법을 설명해 주세요.','제조용수 미생물 결과가 평소보다 높게 나왔다면 무엇을 확인하겠습니까?','양성 결과를 작업자 오염으로 단정하고 다시 시험하자는 의견에 어떻게 대응하겠습니까?','무균조작,배지,대조,채취,배양,추세,조사,기록'],
['bio','바이오 생산팀','생산','배양,정제,완제의약품','◉','선택한 공정의 주요 단계와 관리해야 할 공정변수를 설명해 주세요.','공정변수가 설정 범위를 벗어났을 때 확인 및 보고 순서를 설명해 주세요.','공정 지연을 막기 위해 승인 없이 조건을 바꾸자는 제안을 받으면 어떻게 하겠습니까?','공정변수,모니터링,기록,보고,일탈,품질영향,승인'],
['bioqc','바이오 QC','품질','이화학,생화학,미생물','⌬','바이오의약품의 확인·순도·역가가 각각 무엇을 확인하는지 설명해 주세요.','시험 결과의 변동이 커졌다면 검체·시약·장비 중 무엇부터 확인하겠습니까?','역가 결과가 이전 추세와 다르지만 규격 이내라면 어떻게 판단하겠습니까?','확인,순도,역가,표준품,적합성,변동,추세,조사'],
['ra','RA · 인허가','연구·허가','국내허가,해외허가','▤','CTD의 구성과 품질 자료가 포함되는 부분을 설명해 주세요.','보완 요청에 필요한 자료가 기한 내 준비되지 않을 때 어떻게 조율하겠습니까?','허가된 사항과 현장 운영이 다른 것을 알게 되면 어떤 내용을 확인하겠습니까?','CTD,품질,근거,변경,일정,협의,검토,허가'],
['analysis','분석연구실','연구·허가','시험법 개발,밸리데이션,안정성,동등성','⌁','시험법을 개발할 때 분석 목적과 시료 특성을 어떻게 반영하겠습니까?','분리도가 부족하거나 피크 모양이 좋지 않을 때 어떤 순서로 조건을 검토하겠습니까?','허가 일정이 촉박한 상황에서 시험법의 문제가 확인되면 어떻게 조율하겠습니까?','특이성,분리도,이동상,컬럼,검증,근거,기록,일정'],
['form','제제연구실','연구·허가','경구고형제,바이오 제형','⬡','제형과 첨가제를 선정할 때 원료의 어떤 특성을 확인하겠습니까?','실험실 규모에서 확보한 품질이 생산 규모에서 달라지면 무엇을 확인하겠습니까?','용출이나 안정성이 목표에 미치지 못하는 상황에서 개발 일정을 어떻게 관리하겠습니까?','용해도,안정성,첨가제,공정변수,스케일,용출,근거,협업'],
['qa','품질보증실','품질','기록 검토,일탈·CAPA,변경관리,밸리데이션,감사','✓','일탈·변경관리·CAPA의 차이와 연결 관계를 설명해 주세요.','제조기록 검토 중 실제 작업과 기록이 다른 것을 발견하면 어떻게 하겠습니까?','출하 일정이 촉박한데 해결되지 않은 품질 문제가 있다면 어떻게 판단하겠습니까?','일탈,원인,영향평가,CAPA,승인,기록,검토,효과확인'],
['inject','주사제 생산팀','생산','조제,무균충전,동결건조,검사,포장','◫','무균 작업 전 작업자·설비·환경에서 확인해야 할 사항을 설명해 주세요.','충전 중 환경모니터링 이상이 확인되면 어떻게 대응하겠습니까?','충전 작업 중 무균조작 위반 가능성을 발견하면 어떤 조치를 하겠습니까?','무균,가운,환경,개입,기록,보고,격리,영향평가'],
['api','원료의약품 생산팀','생산','합성,추출,정제,건조','⬢','원료 투입 전 물질의 식별과 반응 안전을 어떻게 확인하겠습니까?','반응 온도가 예상보다 빠르게 상승한다면 어떻게 대응하겠습니까?','수율을 높이기 위해 승인된 공정조건을 바꾸자는 제안에 어떻게 대응하겠습니까?','식별,투입,온도,압력,안전,절차,보고,변경'],
['facility','공무·설비팀','설비·운영','생산설비,유틸리티,공조,제조용수','⚙','예방보전과 고장보전의 차이와 작업 전 확인사항을 설명해 주세요.','제조용수나 공조 설비에서 경보가 발생하면 어떤 순서로 확인하겠습니까?','생산 재개 요청을 받았지만 설비 상태가 충분히 확인되지 않았다면 어떻게 하겠습니까?','예방보전,안전,에너지차단,경보,원인,기록,품질영향,보고'],
['validation','밸리데이션팀','품질','설비 적격성평가,공정,세척,컴퓨터시스템','☑','적격성평가와 밸리데이션의 차이를 예를 들어 설명해 주세요.','수행 결과가 사전 승인된 허용기준을 충족하지 못하면 어떻게 처리하겠습니까?','평가가 끝난 뒤 결과에 맞춰 허용기준을 바꾸자는 요청에 어떻게 대응하겠습니까?','계획서,위험평가,허용기준,일탈,근거,승인,보고서'],
['logistics','물류·자재팀','설비·운영','원자재 입고,보관,불출,완제품 출하','▣','원자재 입고부터 불출까지 상태와 이력을 어떻게 관리하겠습니까?','보관 온도 이탈을 발견했다면 어떤 정보와 조치가 필요하겠습니까?','출하 일정 때문에 승인되지 않은 제품을 먼저 보내자는 요청을 받으면 어떻게 하겠습니까?','식별,격리,상태,온도,이력,선입선출,승인,보고'],
['planning','생산관리팀','설비·운영','생산계획,일정,재고,납기 관리','▦','생산계획을 세울 때 자재·설비·인력·품질 일정은 어떻게 확인하겠습니까?','자재 입고 지연으로 생산계획이 틀어지면 어떤 순서로 조정하겠습니까?','납기와 품질 검토 일정이 충돌하면 관련 부서와 어떻게 협의하겠습니까?','자재,설비,인력,우선순위,품질,납기,협의,일정']
].map(([id,name,group,subs,icon,q1,q2,q3,keys])=>({id,name,group,subs:subs.split(','),icon,qs:[q1,q2,q3],keys:keys.split(',')}));
const specialties={
'타정':['타정 중 정제의 질량 편차가 커졌다면 어떤 항목을 확인하겠습니까?','질량,유동성,충전,속도,기록,보고'],
'과립':['과립 공정에서 입도와 수분이 다음 공정에 미치는 영향을 설명해 주세요.','입도,수분,유동성,압축,건조,조건'],
'혼합':['혼합 균일성에 영향을 주는 요인과 과도한 혼합의 위험을 설명해 주세요.','균일성,시간,속도,충전율,분리,검증'],
'코팅':['코팅 중 정제가 서로 붙는 현상이 나타나면 무엇을 확인하겠습니까?','분무,온도,건조,속도,점도,기록'],
'칭량':['칭량 시 원료 혼동과 교차오염을 예방하는 절차를 설명해 주세요.','식별,저울,교정,청소,확인,기록'],
'캡슐충전':['캡슐 충전량이 불안정할 때 어떤 원인을 확인하겠습니까?','분말,유동성,충전,속도,질량,기록'],
'포장':['포장 라인에서 다른 제품의 인쇄자재를 발견하면 어떻게 하겠습니까?','중지,격리,보고,라인클리어런스,대조,기록'],
'배양':['배양 중 pH와 DO가 목표 범위를 벗어나면 어떤 항목을 확인하겠습니까?','센서,교정,가스,교반,세포,보고,기록'],
'정제':['정제 공정에서 컬럼 압력이 상승하고 회수율이 낮아지면 무엇을 확인하겠습니까?','압력,유속,완충액,필터,컬럼,시료,기록'],
'완제의약품':['무균충전 공정에서 작업자의 개입을 관리해야 하는 이유를 설명해 주세요.','무균,개입,오염,절차,기록,평가'],
'안정성시험':['안정성시험에서 규격 이내이지만 분해산물이 증가하는 추세라면 어떻게 검토하겠습니까?','추세,보관,분해산물,시험법,원자료,조사'],
'제조용수':['제조용수의 미생물 결과를 해석할 때 채취와 계통에서 무엇을 확인하겠습니까?','채취,소독,정체,온도,추세,조사'],
'일탈·CAPA':['CAPA의 조치 완료와 효과 확인은 어떻게 다릅니까?','원인,조치,재발,기간,지표,효과']
};
const people=[['인사팀장','지원동기 · 직업관'],['인사팀원','경험 · 협업'],['실무팀장','기본기 · 실무'],['실무실장','판단 · 문제 대응']];
let state={job:'solid',sub:'칭량',group:'전체',career:'신입',type:'통합',mode:'연습',count:8},session=null,history=[],timer=null,recognition=null;
try{history=JSON.parse(localStorage.getItem('pharma-history')||'[]');if(!Array.isArray(history))history=[]}catch{}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',2600)}
function avatar(i){return `<div class="avatar a${i}" aria-hidden="true"><span class="head"></span><span class="torso"></span></div>`}
function historyCount(){$('#historyCount').textContent=history.length}historyCount();
function seg(key,vals){return `<div class="seg">${vals.map(v=>`<button class="${state[key]===v?'on':''}" data-key="${key}" data-value="${v}">${v}</button>`).join('')}</div>`}
function home(){stopVoice();clearInterval(timer);session=null;const j=jobs.find(j=>j.id===state.job);app.innerHTML=`<section class="hero"><div><div class="eyebrow"><span class="dot"></span> YOUR NEXT CAREER STARTS HERE</div><h1>첫 질문 앞에서도,<br><em>내 경험으로 답할 수 있게.</em></h1><p class="lead">제약·바이오 취업을 준비하는 당신의 면접 연습실.<br>직무를 고르고, 네 명의 면접관을 만나보세요.</p><div class="hero-meta"><span><b>15</b>개 직무</span><span><b>4</b>명의 면접관</span><span><b>인성 + 직무</b>맞춤 연습</span></div></div><div class="room-art"><div class="art-top"><span>INTERVIEW ROOM 01</span><span class="live">● READY</span></div><div class="art-people">${people.map((_,i)=>avatar(i)).join('')}</div><div class="desk"></div><span class="art-label">인사팀장 · 인사팀원 · 실무팀장 · 실무실장</span></div></section><div class="section-top"><div><h2>어떤 직무를 준비하고 있나요?</h2><p>팀을 선택한 뒤, 오른쪽에서 면접 조건을 설정하세요.</p></div><span class="step">01 SELECT YOUR ROLE</span></div><div class="workspace"><section><div class="tabs">${['전체','생산','품질','연구·허가','설비·운영'].map(g=>`<button class="tab ${g===state.group?'active':''}" data-group="${g}">${g}</button>`).join('')}</div><div class="job-grid">${jobs.filter(j=>state.group==='전체'||j.group===state.group).map(j=>`<button class="job ${j.id===state.job?'selected':''}" data-job="${j.id}" aria-pressed="${j.id===state.job}">${j.id===state.job?'<span class="check">✓</span>':''}<span class="job-icon">${j.icon}</span><strong>${j.name}</strong><small>${j.subs.join(' · ')}</small></button>`).join('')}</div><p class="footer-note">실제 기업의 기출문제가 아닌 직무별 연습 질문입니다. 회사별 업무 범위와 절차는 다를 수 있습니다.</p></section><aside class="panel"><h3>나의 면접 설정</h3><div class="selected-label">✓ ${j.name}</div><label class="label" for="sub">세부 업무</label><select id="sub">${j.subs.map(s=>`<option ${s===state.sub?'selected':''}>${s}</option>`).join('')}</select><span class="label">지원 구분</span>${seg('career',['신입','경력'])}<span class="label">질문 유형</span>${seg('type',['통합','인성','직무'])}<span class="label">진행 방식</span>${seg('mode',['연습','실전'])}<span class="label">전체 질문 수</span>${seg('count',[8,12])}<p class="note">${state.mode==='연습'?'답변마다 점검 기준과 보완 방향을 확인합니다.':'면접이 끝난 뒤 답변 점검 결과를 한꺼번에 확인합니다.'}<br>공통 4문항은 고정, 나머지는 매회 새로 선정합니다.<br>제공된 질문 315문항을 면접관별로 반영했습니다.<br>최근 질문을 우선 피하며, 질문은행을 모두 연습하면 다시 순환합니다.<br>직무·인성 선택은 변동 질문에 적용됩니다.</p><button class="start" id="start">면접 시작하기 <span>↗</span></button><p class="note">답변은 이 기기의 브라우저에 저장됩니다.<br>텍스트 입력 · 지원 브라우저에서 음성 입력</p></aside></div>`;
app.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>{state.group=b.dataset.group;home()});app.querySelectorAll('[data-job]').forEach(b=>b.onclick=()=>{state.job=b.dataset.job;state.sub=jobs.find(j=>j.id===state.job).subs[0];home()});app.querySelectorAll('[data-key]').forEach(b=>b.onclick=()=>{state[b.dataset.key]=b.dataset.key==='count'?Number(b.dataset.value):b.dataset.value;home()});$('#sub').onchange=e=>state.sub=e.target.value;$('#start').onclick=start;
}
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const k=Math.floor(Math.random()*(i+1));[a[i],a[k]]=[a[k],a[i]]}return a}
let questionSeen={};try{questionSeen=JSON.parse(localStorage.getItem('pharma-question-seen-v2')||'{}');if(!questionSeen||Array.isArray(questionSeen)||typeof questionSeen!=='object')questionSeen={}}catch{}
function drawQuestions(pool,n){const unique=[...new Map(pool.map(q=>[q.text,q])).values()];const fresh=shuffle(unique.filter(q=>!questionSeen[q.text]));const previous=shuffle(unique.filter(q=>questionSeen[q.text])).sort((a,b)=>questionSeen[a.text]-questionSeen[b.text]);const selected=[...fresh,...previous].slice(0,n);let stamp=Math.max(Date.now(),...Object.values(questionSeen).filter(Number.isFinite))+1;for(const q of selected)questionSeen[q.text]=stamp++;try{localStorage.setItem('pharma-question-seen-v2',JSON.stringify(questionSeen))}catch{}return selected}
function makeQuestions(){const j=jobs.find(j=>j.id===state.job), exp=state.career==='경력';const h=[
{p:0,text:`${exp?'이전 업무에서 맡은 역할과 성과를 중심으로':'지원 직무를 준비한 과정을 중심으로'} 1분 자기소개를 해 주세요.`,keys:['업무','역할','경험','결과','준비'],guide:'지원 직무와 관련된 경험 하나를 골라 역할 → 행동 → 결과 → 직무 연결 순서로 말해 보세요.'},
{p:1,text:'동료와 업무 방식에 대한 의견이 달랐던 경험과 해결 과정을 말씀해 주세요.',keys:['의견','이유','확인','대화','합의','결과'],guide:'의견이 갈린 이유, 상대에게 확인한 내용, 합의한 기준과 결과를 구체적으로 설명해 보세요.'},
{p:0,text:exp?'이직을 결정한 이유와 다음 회사에서 맡고 싶은 업무를 말씀해 주세요.':`${j.name}의 ${state.sub} 업무를 선택한 이유와 준비한 내용을 말씀해 주세요.`,keys:['업무','이유','준비','목표','경험'],guide:'선택 이유를 실제 준비 행동으로 뒷받침하고, 희망 업무와 연결해 보세요.'},
{p:1,text:'본인의 실수나 누락을 발견했던 경험과 그 이후 바꾼 행동을 말씀해 주세요.',keys:['실수','보고','수정','원인','확인','재발'],guide:'상황 → 발견 → 공유 및 수정 → 재발 방지 순서로, 본인이 한 행동을 구분해 말해 보세요.'},
{p:0,text:'반복되는 업무나 교대근무에서 집중력과 컨디션을 어떻게 관리하겠습니까?',keys:['수면','인수인계','확인','기록','관리','습관'],guide:'실제로 실행할 수 있는 생활 습관과 업무 확인 방법을 제시해 보세요.'},
{p:1,text:'협업하는 부서에 필요한 자료를 받지 못해 일정이 지연된다면 어떻게 하겠습니까?',keys:['확인','기한','우선','협의','공유','대안'],guide:'필요 자료와 기한을 명확히 하고, 지연 영향·대안·협의 방법을 설명해 보세요.'},
{p:0,text:'입사 후 처음 배우는 업무가 예상보다 어렵다면 어떻게 적응하겠습니까?',keys:['절차','질문','기록','확인','교육','학습'],guide:'교육과 승인된 절차를 확인하고, 모르는 부분을 질문한 뒤 숙련도를 확인하는 방법을 말해 보세요.'},
{p:1,text:'업무를 인수인계할 때 반드시 전달할 내용을 예를 들어 설명해 주세요.',keys:['진행','이상','기록','일정','확인','주의'],guide:'현재 진행 상태, 이상 상황, 다음 작업, 주의사항과 상대의 이해 확인까지 설명해 보세요.'}
];const sp=specialties[state.sub];const tech=[...j.qs.map((q,i)=>({p:i===2?3:2,text:q,keys:j.keys,guide:`선택 업무(${state.sub})에 맞춰 확인 항목 → 판단 근거 → 조치 → 보고·기록을 연결해 보세요. 핵심 검토어: ${j.keys.join(', ')}.`})),{p:3,text:sp?sp[0]:`${state.sub} 업무에서 가장 중요하게 관리할 위험 한 가지와 관리 방법을 설명해 주세요.`,keys:sp?sp[1].split(','):j.keys,guide:'발생 가능한 문제와 확인할 근거를 구분하고, 임의 조치 전에 필요한 절차를 설명해 보세요.'},
{p:2,text:`${state.sub} 업무를 시작하기 전에 SOP와 작업 기록에서 무엇을 확인하겠습니까?`,keys:['절차','버전','교육','기록','승인','확인'],guide:'최신 승인본, 교육 상태, 작업 조건, 기록 양식과 확인 항목을 업무 예시로 설명해 보세요.'},
{p:3,text:'기록을 실제 작업 시점에 작성하지 못한 것을 발견했다면 어떻게 하겠습니까?',keys:['보고','사실','절차','기록','추적','원자료'],guide:'사실과 원자료를 보존하고, 승인된 절차에 따라 보고·정정하는 흐름을 설명해 보세요. 소급 작성으로 사실을 꾸미지 않습니다.'},
{p:2,text:exp?`${state.sub}와 관련해 직접 해결한 문제 한 가지와 본인의 판단 근거를 설명해 주세요.`:`${state.sub} 업무를 처음 배울 때 먼저 익혀야 할 항목 세 가지는 무엇입니까?`,keys:exp?['문제','원인','확인','조치','결과']:['절차','교육','안전','품질','기록'],guide:exp?'본인이 수행한 범위와 다른 사람의 역할을 구분하고, 판단을 뒷받침한 기록이나 데이터를 설명해 보세요.':'업무 절차, 품질·안전상 위험, 기록과 보고를 구체적인 예로 설명해 보세요.'},
{p:3,text:`${state.sub} 업무에서 반복되는 문제의 재발을 줄이려면 어떤 정보를 모으겠습니까?`,keys:['추세','원인','기록','조건','효과','재발'],guide:'조건별 발생 기록을 모으고 원인을 검토한 뒤 조치의 효과를 확인하는 방법을 말해 보세요.'}];
const mk=(text,p,keys,guide)=>({text,p,keys,guide});
const humanExtra=[
'선배가 지적한 내용에 동의하기 어려웠던 경험과 대응을 말씀해 주세요.',
'팀의 성과보다 개인의 성과가 더 잘 드러나는 일을 맡고 싶었던 적이 있습니까?',
'처음 만난 동료와 함께 일을 시작할 때 어떻게 관계를 만들어 가나요?',
'급한 업무 두 가지를 동시에 요청받았다면 우선순위를 어떻게 정하겠습니까?',
'본인의 의견이 채택되지 않았을 때 어떻게 행동했는지 말씀해 주세요.',
'맡은 일이 예상보다 오래 걸릴 때 언제, 어떤 내용으로 상황을 공유하겠습니까?',
'다른 사람의 실수를 발견했을 때 어떻게 전달했는지 말씀해 주세요.',
'업무를 배우면서 받은 피드백 중 실제 행동을 바꾼 사례가 있습니까?',
'단조로운 일을 반복하면서도 기준을 유지했던 경험을 말씀해 주세요.',
'모르는 업무를 아는 것처럼 답하고 싶어지는 상황에서 어떻게 하겠습니까?',
'혼자 해결할 일과 도움을 요청할 일을 어떤 기준으로 구분하나요?',
'본인이 세운 계획을 지키지 못했던 경험과 이후 바꾼 점을 말씀해 주세요.',
'협업 상대의 응답이 늦고 감정까지 상한 상황이라면 어떻게 대화하겠습니까?',
'업무 속도와 정확성 사이에서 선택이 필요했던 경험을 말씀해 주세요.',
'상사의 지시를 정확히 이해하지 못했다면 어떻게 확인하겠습니까?',
'팀에 새로 온 동료에게 업무를 설명해야 한다면 어떤 방식으로 가르치겠습니까?',
'마감 직전에 동료가 도움을 요청하면 본인의 업무와 어떻게 조율하겠습니까?',
'다른 지원자와 구분되는 본인의 준비 행동 한 가지를 말씀해 주세요.',
'실패한 뒤 같은 일을 다시 시도했던 경험과 바꾼 접근을 말씀해 주세요.',
'공유해야 할 실수와 혼자 바로잡아도 되는 실수는 어떻게 구분하겠습니까?',
'직장에서 지켜야 할 약속 중 가장 중요하게 생각하는 것은 무엇인가요?',
'최근 스스로 부족하다고 느껴 학습한 내용과 확인 방법을 말씀해 주세요.',
'예상하지 못한 업무 변경에 적응했던 경험을 말씀해 주세요.',
'본인이 받은 도움을 팀에 다시 나눈 경험을 말씀해 주세요.'
].map((t,i)=>mk(t,i%2,['상황','역할','확인','행동','협의','결과'],'상황과 본인의 역할을 짧게 설명하고, 직접 한 행동과 결과를 구분해 말해 보세요.'));
const technicalExtra=[
`${state.sub} 업무에서 작업 전·작업 중·작업 후 확인할 항목을 구분해 주세요.`,
`${state.sub}의 결과를 다음 부서에 전달할 때 반드시 포함할 정보는 무엇입니까?`,
`${state.sub}에서 교차오염이나 혼동이 발생할 수 있는 지점을 예로 들어 주세요.`,
`${state.sub}에 사용하는 장비의 점검 기한이 지난 것을 발견했다면 어떻게 하겠습니까?`,
`${state.sub}에서 평소와 다른 추세가 보이지만 기준 이내라면 무엇을 확인하겠습니까?`,
`${state.sub} 업무 중 정전이나 설비 정지가 발생하면 무엇을 우선 확인하겠습니까?`,
`${state.sub}에 사용하는 자재나 시약의 유효기간을 확인할 수 없다면 어떻게 하겠습니까?`,
`${state.sub}의 기록을 다른 사람이 검토하기 쉽게 작성하려면 무엇이 필요합니까?`,
`${state.sub} 업무를 인수받았는데 이전 작업의 진행 상태가 불명확하다면 어떻게 하겠습니까?`,
`${state.sub}의 작업 조건을 개선하고 싶다면 어떤 근거와 승인 과정이 필요합니까?`,
`${state.sub}에서 이상 원인을 조사할 때 가설과 확인된 사실을 어떻게 구분하겠습니까?`,
`${state.sub} 업무의 교육을 받았지만 혼자 수행할 자신이 없다면 어떻게 하겠습니까?`,
`${state.sub}에 필요한 문서의 버전이 서로 다르면 어떤 순서로 확인하겠습니까?`,
`${state.sub} 업무에서 데이터 추적성을 확보한다는 것을 예로 설명해 주세요.`,
`${state.sub}에 영향을 줄 수 있는 다른 부서의 변경을 어떻게 확인하겠습니까?`,
`${state.sub}의 처리 시간을 줄이면서 품질을 유지하려면 무엇을 먼저 검토하겠습니까?`
].map((t,i)=>mk(t,2+i%2,j.keys,'선택 업무에 해당하는지 먼저 설명하고, 확인 대상·판단 근거·보고와 기록 순서로 답변해 보세요.'));
const roleExtra={
solid:['타정에서 캡핑과 라미네이션을 구분하고 확인할 원인을 말씀해 주세요.','혼합물의 유동성이 떨어지면 다음 공정에 어떤 영향이 있습니까?','과립의 건조 종료를 판단할 때 어떤 근거가 필요합니까?','코팅의 분무 조건과 건조 조건은 어떻게 연결됩니까?','라인클리어런스에서 제품과 인쇄자재를 함께 확인하는 이유는 무엇입니까?','제조 수율과 수량 수지를 검토하는 목적을 설명해 주세요.','체나 금속검출기 등 공정 관리 장치에 이상이 있으면 어떻게 하겠습니까?','정제 질량이 기준에 가까워지는 추세라면 무엇을 확인하겠습니까?'],
chem:['HPLC에서 시스템적합성시험을 수행하는 목적은 무엇입니까?','HPLC 압력이 갑자기 상승하면 어떤 순서로 원인을 확인하겠습니까?','표준액과 검액의 희석배수를 계산할 때 어떤 실수를 주의해야 합니까?','OOS와 OOT의 차이를 설명해 주세요.','시험법 밸리데이션과 베리피케이션을 구분해 주세요.','용출시험에서 온도·회전수·샘플링 시간이 중요한 이유는 무엇입니까?','표준품의 순도와 수분 보정을 적용할 때 무엇을 확인하겠습니까?','크로마토그램 적분을 수정해야 한다면 어떤 근거와 기록이 필요합니까?'],
micro:['음성대조에서 증식이 확인되면 어떤 순서로 조사하겠습니까?','배지성능시험이 필요한 이유를 설명해 주세요.','미생물 시험법 적합성을 확인하는 목적은 무엇입니까?','미생물한도시험과 무균시험의 목적을 구분해 주세요.','채취한 검체의 보관 조건과 시험 시작 시간이 중요한 이유는 무엇입니까?','집락 수가 평소와 다른 양상으로 나타나면 무엇을 확인하겠습니까?','제조용수 채취 지점별 결과를 추세로 보는 이유는 무엇입니까?','소독제의 종류와 접촉시간을 관리하는 이유는 무엇입니까?'],
bio:['배양에서 pH·DO·온도를 함께 보는 이유는 무엇입니까?','배양 중 세포 생존율이 감소하면 무엇을 확인하겠습니까?','정제에서 수율과 순도를 함께 검토하는 이유는 무엇입니까?','크로마토그래피의 결합·세척·용출 단계를 설명해 주세요.','UF/DF 공정의 목적과 관리 항목을 말씀해 주세요.','배양이나 정제 중 보관시간이 길어지면 무엇을 검토하겠습니까?','완제의약품 공정에서 필터 무결성을 확인하는 이유는 무엇입니까?','공정 중 검체를 채취할 때 대표성과 오염 예방을 어떻게 확보하겠습니까?'],
bioqc:['단백질의 응집과 분해를 확인하는 시험의 목적을 설명해 주세요.','역가시험에서 표준품과 대조군이 필요한 이유는 무엇입니까?','ELISA에서 세척 조건이 결과에 미치는 영향을 설명해 주세요.','SEC 분석으로 확인하려는 품질 특성은 무엇입니까?','엔도톡신시험의 간섭을 확인해야 하는 이유는 무엇입니까?','세포 기반 시험의 변동을 줄이려면 무엇을 관리해야 합니까?','검체의 동결·해동 이력이 시험 결과에 영향을 줄 수 있는 이유는 무엇입니까?','바이오의약품에서 한 가지 시험으로 품질을 모두 판단하기 어려운 이유는 무엇입니까?'],
ra:['허가 변경 시 품질 부서와 어떤 자료를 먼저 확인하겠습니까?','규제기관의 보완 요구를 내부 부서에 어떻게 전달하겠습니까?','허가 자료와 근거 시험자료의 수치가 다르면 어떻게 하겠습니까?','국내와 해외 제출자료를 관리할 때 어떤 차이를 확인해야 합니까?','원료 공급처 변경이 허가에 미치는 영향을 어떻게 검토하겠습니까?','표시기재 사항과 허가사항을 대조할 때 무엇을 확인하겠습니까?','허가 자료의 버전과 제출 이력을 관리하는 방법을 설명해 주세요.','규제 요구의 해석이 부서마다 다르면 어떤 근거로 조율하겠습니까?'],
analysis:['특이성을 확보했다는 것을 어떤 자료로 설명하겠습니까?','검량선의 결정계수가 높다는 이유만으로 직선성이 충분하다고 할 수 있습니까?','검출한계와 정량한계의 차이를 설명해 주세요.','HPLC에서 UPLC로 시험법을 전환할 때 무엇을 확인하겠습니까?','가혹시험과 안정성시험의 목적을 구분해 주세요.','용출 조건을 설정할 때 변별력을 어떻게 검토하겠습니까?','유연물질시험에서 미지 피크가 나타나면 무엇을 확인하겠습니까?','분석법 이전 시 보내는 부서와 받는 부서가 합의할 항목은 무엇입니까?'],
form:['원료 입도가 제제의 용출과 제조성에 미치는 영향을 설명해 주세요.','직타와 습식과립의 선택에 영향을 주는 특성은 무엇입니까?','첨가제 배합적합성을 검토하는 목적을 설명해 주세요.','처방 변경과 공정 변경의 영향을 어떻게 구분하겠습니까?','스케일업에서 혼합 시간만 동일하게 적용하기 어려운 이유는 무엇입니까?','용출은 개선됐지만 안정성이 나빠졌다면 어떻게 접근하겠습니까?','바이오 제형에서 응집을 줄이기 위해 검토할 요소는 무엇입니까?','개발 처방을 생산 부서로 이전할 때 어떤 자료가 필요합니까?'],
qa:['일탈의 근본원인과 직접원인을 어떻게 구분하겠습니까?','변경관리에서 영향평가에 참여할 부서를 어떻게 정하겠습니까?','CAPA 효과 확인이 부족하다고 판단하는 경우는 언제입니까?','출하 전 제조기록과 시험기록에서 무엇을 확인하겠습니까?','문서 개정 시 기존 문서와 교육을 어떻게 관리하겠습니까?','감사 지적의 시정과 예방조치를 구분해 주세요.','반복 일탈을 개별 사건으로만 처리하면 어떤 문제가 있습니까?','데이터 완전성을 검토할 때 원자료와 감사추적에서 무엇을 확인하겠습니까?'],
inject:['무균조작과 최종멸균의 차이를 설명해 주세요.','무균공정모의시험의 목적은 무엇입니까?','동결건조에서 제품 온도와 챔버 압력을 관리하는 이유는 무엇입니까?','충전량이 목표값에서 벗어나는 추세를 보이면 무엇을 확인하겠습니까?','용기밀봉무결성이 제품 품질에 중요한 이유는 무엇입니까?','조제 후 충전까지의 보관시간을 관리하는 이유는 무엇입니까?','멸균과 제열의 목적을 구분해 주세요.','주사제 외관검사에서 결함을 분류하고 기록하는 이유는 무엇입니까?'],
api:['반응에 사용하는 용매의 위험성을 작업 전에 어떻게 확인하겠습니까?','반응 종료를 판단할 때 시간 외에 어떤 근거가 필요합니까?','결정화 조건이 품질에 미치는 영향을 설명해 주세요.','건조 중 잔류용매와 열 영향을 함께 검토하는 이유는 무엇입니까?','원료 투입 순서가 중요한 이유를 예로 설명해 주세요.','반응기 내 잔류물과 세척 상태를 확인하는 이유는 무엇입니까?','공정 중 불순물이 증가했다면 어떤 정보를 모으겠습니까?','압력 상승이나 누출 가능성을 발견하면 어떤 절차를 우선하겠습니까?'],
facility:['공조 차압이 평소와 달라졌을 때 무엇을 확인하겠습니까?','제조용수 계통의 정체 구간이 위험한 이유는 무엇입니까?','설비 수리 후 생산 재개 전에 무엇을 확인해야 합니까?','교정과 일상점검의 차이를 설명해 주세요.','같은 설비 고장이 반복되면 어떤 자료로 원인을 찾겠습니까?','설비 부품을 다른 사양으로 교체할 때 무엇을 검토하겠습니까?','작업 전 에너지 차단과 잔류에너지 확인이 필요한 이유는 무엇입니까?','온도 센서의 표시값과 실제 값이 다르다고 의심되면 어떻게 확인하겠습니까?'],
validation:['IQ·OQ·PQ의 목적을 구분해 주세요.','세척밸리데이션에서 최악조건을 선정하는 이유는 무엇입니까?','사용자 요구사항이 적격성평가에 어떻게 연결됩니까?','재밸리데이션 필요성을 판단할 때 무엇을 확인하겠습니까?','검증 수행 중 계획서에서 벗어난 절차를 발견하면 어떻게 하겠습니까?','컴퓨터시스템에서 접근권한과 감사추적을 검증하는 이유는 무엇입니까?','공정밸리데이션과 지속적 공정검증의 관계를 설명해 주세요.','세척 후 잔류량 평가에서 검체 채취 방법이 중요한 이유는 무엇입니까?'],
logistics:['선입선출과 유효기간 우선출고를 구분해 주세요.','입고 수량과 납품서 수량이 다르면 어떻게 처리하겠습니까?','반품된 제품을 정상 재고와 구분해야 하는 이유는 무엇입니까?','콜드체인 운송 기록에 공백이 있으면 무엇을 확인하겠습니까?','자재 라벨이 손상돼 식별할 수 없다면 어떻게 하겠습니까?','재고 실사 결과와 전산 재고가 다르면 어떤 순서로 확인하겠습니까?','출하 제품의 로트와 수량을 어떤 방식으로 대조하겠습니까?','검수 대기·적합·부적합 상태를 구분해 보관하는 이유는 무엇입니까?'],
planning:['병목 공정을 파악할 때 어떤 데이터를 확인하겠습니까?','긴급 주문이 들어오면 기존 생산계획을 어떤 기준으로 조정하겠습니까?','품목 전환에 필요한 세척시간을 생산계획에 어떻게 반영하겠습니까?','시험과 출하승인 소요기간을 계획에 반영하는 이유는 무엇입니까?','자재 소요량을 계산할 때 수율과 재고를 어떻게 고려하겠습니까?','설비 고장으로 생산량이 감소하면 관련 부서에 무엇을 공유하겠습니까?','생산계획 대비 실적 차이를 분석할 때 어떤 항목을 보겠습니까?','납기 준수율을 높이기 위해 어떤 지연 원인을 먼저 분석하겠습니까?']
}[j.id].map((t,i)=>mk(t,2+i%2,j.keys,'업무 원리를 설명한 뒤 실제 확인할 항목과 판단에 필요한 기록을 제시해 보세요.'));
const fixed=[
{p:0,text:'1분 자기소개를 해 주세요.',keys:['역할','경험','업무','준비','결과'],guide:'지원 직무와 연결되는 경험을 중심으로 역할 → 행동 → 결과를 1분 안에 정리해 보세요.',fixed:true},
{p:1,text:'본인의 성격의 장점과 단점을 말씀해 주세요.',keys:['장점','단점','행동','개선','경험'],guide:'장점이 드러난 사례와 단점이 업무에 미칠 영향, 실제 개선 행동을 함께 설명해 보세요.',fixed:true},
{p:0,text:'우리에게 하고 싶은 질문이 있습니까?',keys:['업무','교육','역할','기준','협업'],guide:'담당 업무와 입사 후 적응에 필요한 내용을 중심으로, 공개자료에서 이미 확인할 수 있는 정보와 구분해 질문해 보세요.',fixed:true},
{p:3,text:'마지막으로 하고 싶은 말씀을 해 주세요.',keys:['직무','준비','경험','업무','강점'],guide:'앞선 답변에서 충분히 전달하지 못한 직무 관련 강점과 준비를 짧게 정리해 보세요.',fixed:true}
];
const suppliedHuman=[...suppliedQuestionBank.hrLead.map((text,i)=>({text,p:0,index:i})),...suppliedQuestionBank.hrMember.map((text,i)=>({text,p:1,index:i}))].filter(q=>!(q.p===0&&[0,3].includes(q.index))&&!(q.p===1&&q.index===6)).filter(q=>!(state.career==='신입'&&q.p===0&&q.index===2)).map(q=>({...q,keys:['경험','역할','이유','확인','행동','결과'],guide:'질문에 먼저 답한 뒤, 본인의 행동과 근거를 실제 사례로 설명해 보세요. 경험이 없다면 준비한 내용과 판단 기준을 말해 보세요.'}));
const suppliedTech=suppliedQuestionBank[j.id].map((text,i)=>({text,p:i<14?2:3,keys:j.keys,guide:'원리와 확인 대상을 먼저 설명하고, 해당하는 절차·판단 근거·보고 및 기록으로 연결하세요. 수치나 주기는 적용 제품·공정과 승인된 기준에 따라 설명하세요.'}));
const hp=[...h.slice(1),...humanExtra,...suppliedHuman],tp=[...tech,...roleExtra,...technicalExtra,...suppliedTech],n=state.count-4;
const balanced=(pool,n)=>{const first=Math.ceil(n/2);return shuffle([...drawQuestions(pool.filter(q=>q.p%2===0),first),...drawQuestions(pool.filter(q=>q.p%2===1),n-first)])};
let variable;
if(state.type==='인성')variable=balanced(hp,n);
else if(state.type==='직무')variable=balanced(tp,n);
else variable=shuffle([...balanced(hp,n/2),...balanced(tp,n/2)]);
return [fixed[0],fixed[1],...variable,fixed[2],fixed[3]].map((q,i)=>({...q,base:i+1,follow:false}));} 
function start(){session={settings:{...state},job:jobs.find(j=>j.id===state.job).name,queue:makeQuestions(),idx:0,answers:[],started:Date.now(),draft:'',review:false};renderSession();window.scrollTo({top:0,behavior:'smooth'})}
function current(){return session.queue[session.idx]}
function analyze(q,a){const terms=q.keys.filter(k=>a.toLowerCase().includes(k.toLowerCase()));const concrete=/(\d|당시|직접|담당|실제|확인했|보고했|수정했|진행했|측정했|기록했|협의했)/.test(a);const structure=/(먼저|다음|이후|마지막|원인|결과|따라|때문|순서)/.test(a);return{terms,concrete,structure,len:a.replace(/\s/g,'').length};}
function feedback(q,a){const f=analyze(q,a);return `<div class="feedback"><h4>답변 점검</h4><p><b>문장에서 확인된 내용</b><br>${f.terms.length?'관련 표현: '+f.terms.map(esc).join(' · '):'설정된 핵심 표현이 직접 등장하지 않았습니다. 의미상 옳은 답변도 표현에 따라 누락될 수 있습니다.'}</p><p><b>보완해 볼 부분</b><br>${!f.concrete?'본인이 한 행동이나 실제 사례를 한 가지 더해 보세요. ':''}${!f.structure?'확인 순서와 판단 이유가 드러나게 연결해 보세요. ':''}${f.len<80?'답변이 짧습니다. 확인 대상과 후속 조치를 더 설명해 보세요. ':''}${f.concrete&&f.structure&&f.len>=80?'행동과 설명의 흐름을 담았습니다. 각 판단을 뒷받침할 근거가 있는지 확인해 보세요.':''}</p><p><b>답변 구성 가이드</b><br>${esc(q.guide)}</p><small>핵심 표현과 문장 형식을 이용한 자동 점검입니다. 답변의 사실성·직무 정답 여부를 판정하는 AI 평가는 아닙니다.</small></div>`}
function renderSession(){clearInterval(timer);const q=current(),s=session;app.innerHTML=`<div class="session-top"><button class="quiet" id="exit">← 면접 나가기</button><span class="badge">${esc(s.job)} / ${esc(s.settings.sub)}</span><span id="clock">00:00</span></div><div class="interviewers">${people.map((p,i)=>`<div class="person ${q.p===i?'active':''}">${avatar(i)}<b>${p[0]}</b><small>${q.p===i?'● 질문 중':p[1]}</small></div>`).join('')}</div><div class="session-grid"><section class="question-box"><div class="question-head"><span class="badge">${q.follow?'꼬리질문':(q.fixed?'공통 질문 ':'변동 질문 ')+q.base+' / '+s.settings.count}</span><b>${people[q.p][0]}</b><button class="quiet" id="speak" style="margin-left:auto">질문 듣기</button></div><h2 class="question">${esc(q.text)}</h2><label for="answer" class="label">나의 답변</label><textarea id="answer" class="answer" placeholder="실제로 면접관에게 말하듯 답변해 보세요. 본인의 역할과 판단 근거를 함께 설명하면 좋습니다." maxlength="6000" ${s.review?'readonly':''}>${esc(s.draft)}</textarea><div class="answer-tools"><span id="charCount">${s.draft.length} / 6,000자</span><button id="voice" class="quiet" ${s.review?'disabled':''}>마이크로 답변</button></div><div id="feedbackArea">${s.review?feedback(q,s.draft):''}</div><div class="actions"><button class="quiet" id="skip" ${s.review?'disabled':''}>잘 모르겠어요</button><button class="primary" id="submit" ${!s.review&&!s.draft.trim()?'disabled':''}>${s.review?'다음 질문 →':s.settings.mode==='연습'?'답변 제출 · 점검하기':'답변 제출 →'}</button></div></section><aside><div class="side-card"><h3>${s.settings.mode==='연습'?'연습 모드':'실전 모드'} · ${s.settings.career}</h3><p>공통 4개 + 변동 ${s.settings.count-4}개 + 꼬리질문<br>지금까지 답변 ${s.answers.length}개</p><div class="progress"><i style="width:${Math.min(100,(q.base-1)/s.settings.count*100)}%"></i></div></div><div class="side-card"><h3>면접 진행 순서</h3><ul class="q-list">${s.queue.filter(x=>!x.follow).map(x=>`<li class="${x.base===q.base?'current':''}">${x.base<q.base?'✓':x.base===q.base?'●':'○'} ${x.base}. ${people[x.p][0]}</li>`).join('')}</ul></div><div class="side-card"><h3>답변의 기준</h3><p>무엇을 했는지 → 왜 그렇게 판단했는지 → 결과는 어땠는지<br><br>경험이 없다면 아는 범위를 먼저 밝히고 확인할 절차를 설명하세요.</p></div></aside></div>`;
$('#answer').oninput=e=>{s.draft=e.target.value;$('#charCount').textContent=s.draft.length+' / 6,000자';$('#submit').disabled=!s.draft.trim()};$('#submit').onclick=()=>s.review?next():submit();$('#skip').onclick=()=>{s.draft='[답변 보류]';submit(true)};$('#exit').onclick=()=>{if(confirm('현재 면접을 종료할까요? 완료하지 않은 답변은 저장되지 않습니다.'))home()};$('#speak').onclick=()=>{if(!window.speechSynthesis){toast('이 브라우저에서는 질문 읽기를 지원하지 않습니다.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(q.text);u.lang='ko-KR';u.rate=.95;speechSynthesis.speak(u)};$('#voice').onclick=voice;const tick=()=>{const sec=Math.floor((Date.now()-s.started)/1000);$('#clock').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')};tick();timer=setInterval(tick,1000);}
function followup(q,a){let pool;if(a==='[답변 보류]')pool=['어떤 부분이 어려웠나요? 이 상황에서 먼저 확인할 정보 한 가지만 말씀해 주세요.','지금 알고 있는 범위에서 가능한 대응 한 가지를 말해 주세요.','이 문제를 해결하려면 누구에게 무엇을 질문하겠습니까?','답변하기 전에 확인하고 싶은 조건은 무엇입니까?'];else if(q.p<2)pool=['말씀하신 내용에서 본인이 직접 한 행동과 팀이 함께 한 행동을 구분해 설명해 주세요.','그 상황에서 다른 방법도 고려했나요? 해당 방법을 택한 이유를 설명해 주세요.','같은 상황이 다시 생기면 바꾸고 싶은 행동은 무엇입니까?','그 경험의 결과를 어떤 근거로 확인했나요?','상대방은 본인의 행동을 어떻게 받아들였나요?','그 행동을 실제로 했다는 것을 보여줄 사례를 조금 더 구체적으로 설명해 주세요.'];else if(/(무시|숨기|삭제|맞춰.*기록|보고.*않|임의)/.test(a))pool=['그 조치가 품질과 데이터 신뢰성에 미칠 영향은 무엇이며, 실행 전에 어떤 승인과 보고가 필요합니까?','제안한 조치를 승인된 절차와 비교하면 어떤 확인이 더 필요합니까?','해당 대응으로 다른 공정이나 시험에 어떤 영향이 생길 수 있습니까?','원자료와 현재 상태를 보존하려면 어떤 조치가 필요합니까?'];else pool=['말씀하신 조치 이후, 업무 재개 여부를 판단하려면 어떤 근거와 확인이 필요합니까?','제시한 대응의 우선순위와 보고할 내용을 구체적으로 설명해 주세요.','처음 의심한 원인이 아니라면 다음에는 무엇을 확인하겠습니까?','조치가 효과가 있었는지 어떤 기록이나 데이터로 확인하겠습니까?','그 판단을 혼자 할 수 있는 범위와 승인이 필요한 범위로 나누어 주세요.','다른 부서와 공유해야 할 영향과 정보를 설명해 주세요.','재발을 막기 위해 작업 방식이나 교육에서 무엇을 점검하겠습니까?'];const picked=drawQuestions(pool.map(text=>({text})),1)[0];return{...q,text:picked.text,fixed:false,follow:true,guide:'앞선 답변을 반복하기보다 구체적인 행동·판단 근거·확인 대상을 보충해 보세요.'}}

function submit(skip=false){stopVoice();const q=current(),a=session.draft.trim();if(!a)return;if(!q.fixed&&!q.follow&&(q.base%2===0)&&!session.queue[session.idx+1]?.follow)session.queue.splice(session.idx+1,0,followup(q,a));session.answers.push({q:{...q},answer:a,...analyze(q,a),skipped:skip});if(session.settings.mode==='연습'){session.review=true;renderSession()}else next()}
function next(){stopVoice();session.idx++;session.draft='';session.review=false;if(session.idx>=session.queue.length)finish();else{renderSession();window.scrollTo({top:0,behavior:'smooth'})}}
function stopVoice(){if(recognition){recognition.stop();recognition=null}if(window.speechSynthesis)speechSynthesis.cancel()}
function voice(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('음성 입력을 지원하지 않는 브라우저입니다. 키보드로 입력해 주세요.');return}if(recognition){stopVoice();$('#voice').textContent='마이크로 답변';return}recognition=new SR();recognition.lang='ko-KR';recognition.continuous=true;recognition.interimResults=false;recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)session.draft=(session.draft+' '+e.results[i][0].transcript).trim().slice(0,6000);$('#answer').value=session.draft;$('#answer').dispatchEvent(new Event('input'))};recognition.onerror=e=>{toast(e.error==='not-allowed'?'마이크 권한이 필요합니다. 텍스트 입력도 가능합니다.':'음성 입력이 중단되었습니다. 다시 시도해 주세요.')};recognition.onend=()=>{recognition=null;if($('#voice'))$('#voice').textContent='마이크로 답변'};try{recognition.start();$('#voice').textContent='● 음성 입력 중 · 중지'}catch{toast('마이크를 시작할 수 없습니다.')}}
function finish(){clearInterval(timer);stopVoice();const r={id:Date.now(),date:new Date().toLocaleString('ko-KR'),job:session.job,settings:session.settings,answers:session.answers,duration:Math.floor((Date.now()-session.started)/1000)};history.unshift(r);history=history.slice(0,12);try{localStorage.setItem('pharma-history',JSON.stringify(history))}catch{toast('저장 공간이 부족해 연습 기록을 저장하지 못했습니다.')}historyCount();session=null;report(r);window.scrollTo({top:0,behavior:'smooth'})}
function report(r){const completed=r.answers.filter(a=>!a.skipped),concrete=completed.filter(a=>a.concrete).length,structure=completed.filter(a=>a.structure).length;app.innerHTML=`<section class="report-head"><div class="eyebrow">INTERVIEW REVIEW</div><h1>오늘의 답변이,<br>다음 면접의 준비가 됩니다.</h1><p class="lead">${esc(r.job)} · ${esc(r.settings.sub)} · ${esc(r.settings.career)}<br>${esc(r.date)}</p></section><div class="report-grid"><div class="metric"><b>${completed.length} / ${r.answers.length}</b><small>답변 완료</small></div><div class="metric"><b>${Math.floor(r.duration/60)}분 ${r.duration%60}초</b><small>전체 연습 시간</small></div><div class="metric"><b>${concrete}개</b><small>행동·사례 표현 포함</small></div><div class="metric"><b>${structure}개</b><small>순서·이유 표현 포함</small></div></div><div class="side-card"><h3>다음 연습에서는 이렇게 해 보세요</h3><p>답변을 소리 내어 읽고, 본인이 실제로 한 행동과 판단 근거가 있는지 확인하세요. 직무 답변은 최신 승인 절차와 공식 교육자료를 통해 별도로 검토하세요.</p><p>이 결과는 핵심 표현과 문장 형식에 따른 연습용 점검입니다. 전문 지식의 정확성, 인성, 합격 가능성을 평가하지 않습니다.</p></div><div class="actions"><button id="again" class="primary">다시 면접 연습하기 ↗</button><button id="export" class="quiet">답변 기록 내려받기</button></div><h3 style="margin-top:32px">질문별 답변 돌아보기</h3>${r.answers.map((a,i)=>`<details><summary>${i+1}. ${a.q.follow?'[꼬리질문] ':''}${esc(a.q.text)}</summary><p class="note">${people[a.q.p][0]}</p><div class="transcript">${esc(a.answer)}</div>${feedback(a.q,a.answer)}</details>`).join('')}`;$('#again').onclick=home;$('#export').onclick=()=>{const text=`제약·바이오 모의면접 기록\n${r.date}\n${r.job} / ${r.settings.sub} / ${r.settings.career}\n\n`+r.answers.map((a,i)=>`${i+1}. [${people[a.q.p][0]}] ${a.q.text}\n\n답변: ${a.answer}\n\n답변 가이드: ${a.q.guide}`).join('\n\n────────────\n\n');const u=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=u;link.download='면접연습_답변기록.txt';link.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}}
$('#historyBtn').onclick=()=>{if(session&&!confirm('진행 중인 면접을 나가고 지난 연습을 볼까요?'))return;clearInterval(timer);stopVoice();session=null;app.innerHTML=`<div class="section-top" style="margin:30px 0"><h2>지난 면접 연습</h2><button class="quiet" id="backHome">← 직무 선택</button></div><p class="note">이 브라우저에서 완료한 최근 12회 기록입니다.</p>${history.length?history.map((r,i)=>`<div class="history-row"><div><b>${esc(r.job)} · ${esc(r.settings.sub)}</b><small>${esc(r.date)} · ${r.answers.length}개 답변</small></div><button class="quiet" data-report="${i}">결과 보기</button></div>`).join('')+'<button id="deleteAll" class="quiet" style="margin-top:25px">연습 기록 모두 삭제</button>':'<div class="empty">아직 완료한 면접이 없습니다.<br>직무를 고르고 첫 연습을 시작해 보세요.</div>'}`;$('#backHome').onclick=home;app.querySelectorAll('[data-report]').forEach(b=>b.onclick=()=>report(history[Number(b.dataset.report)]));if($('#deleteAll'))$('#deleteAll').onclick=()=>{if(confirm('이 브라우저의 완료된 연습 기록을 모두 삭제할까요?')){history=[];localStorage.removeItem('pharma-history');historyCount();$('#historyBtn').click()}};window.scrollTo({top:0})};home();

const $=s=>document.querySelector(s);
const nf=n=>n==null?'—':Math.round(n).toLocaleString('he-IL');
const sh=n=>n==null?'—':'₪'+nf(n);
const M=n=>'₪'+(n/1e6).toFixed(2)+' מ׳';
const rooms=a=>{const m=a.type.match(/(\d(?:\.5)?) חדרים/);return m?+m[1]:0};
const kind=a=>a.type.startsWith('גן')?'גן':a.type.startsWith('מיני')?'מיני פנטהאוז':a.type.startsWith('פנטהאוז')?'פנטהאוז':'רגילה';
const AV=APTS.filter(a=>!a.sold),SOLD=APTS.filter(a=>a.sold);
const sum=(arr,k)=>arr.reduce((s,a)=>s+a[k],0);
const ppm=a=>a.post/a.area;
const PLAN={37:'img/plan-B37.jpg',42:'img/plan-A42.jpg'};

/* ---------- tabs ---------- */
const TABS=[['sum','סיכום'],['ask','שאל שאלה'],['price','מחירון'],['props','נכסים ותמונות'],['spec','מפרט'],['mkt','שוק ומגרשים']];
$('#nav').innerHTML=TABS.map(([k,t])=>`<button data-t="${k}">${t}</button>`).join('');
function go(k){document.querySelectorAll('section').forEach(s=>s.classList.toggle('on',s.id==='t-'+k));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===k));scrollTo(0,0)}
$('#nav').onclick=e=>{if(e.target.dataset.t)go(e.target.dataset.t)};
go('sum');

/* ---------- summary ---------- */
const tl=sum(AV,'list'),tp=sum(AV,'pre'),tq=sum(AV,'post');
const avgppm=AV.reduce((s,a)=>s+ppm(a),0)/AV.length;
$('#t-sum').innerHTML=`
<img class="hero" src="img/aerial.jpg" alt="הדמיה">
<div class="card" style="margin-top:12px"><h2>במשפט אחד</h2>
פרויקט בוטיק של 2 בניינים (A ו-B) בשכונת הראשונים בערד, מגרש 109 (יזם: עידו מאיר). 42 דירות, 10 נמכרו (מחיר מטרה), <b>32 פנויות</b> בשיווק חופשי. טווח מחירים נוכחי: <b>${sh(Math.min(...AV.map(a=>a.post)))} – ${sh(Math.max(...AV.map(a=>a.post)))}</b>.</div>
<div class="grid">
<div class="card kpi"><b>42</b><span>דירות סה״כ</span></div>
<div class="card kpi"><b>32</b><span>פנויות</span></div>
<div class="card kpi"><b>10</b><span>נמכרו (מחיר מטרה)</span></div>
<div class="card kpi"><b>${M(tq)}</b><span>שווי פנויות אחרי ישיבה 19.10</span></div>
<div class="card kpi"><b>${nf(avgppm)}</b><span>₪ למ״ר ממוצע (שטח פלדלת)</span></div>
<div class="card kpi"><b>${(100-100*tq/tl).toFixed(1)}%</b><span>הנחה מול מחירון</span></div>
</div>
<div class="card"><h2>3 מחירונים באותו קובץ</h2>
<table><tr><th>מחירון</th><th>סה״כ 32 דירות (כולל מע״מ)</th><th>מול שיווק</th></tr>
<tr><td>שיווק (מחירון)</td><td>${sh(tl)}</td><td>—</td></tr>
<tr><td>פרה-סייל (טרום שיווק)</td><td>${sh(tp)}</td><td>−${(100-100*tp/tl).toFixed(1)}%</td></tr>
<tr><td><b>אחרי ישיבה 19.10.26 (בלי נדר, לסגירה)</b></td><td><b>${sh(tq)}</b></td><td>−${(100-100*tq/tl).toFixed(1)}%</td></tr></table>
<small>כל המחירים כולל מע״מ (הגיליון מחשב 18%: ${sh(tq/1.18)} ללא מע״מ).</small></div>

<div class="card"><h2>הדירות לפי סוג (פנויות)</h2>
<table><tr><th>סוג</th><th>כמות</th><th>שטח</th><th>מחיר מ׳</th><th>מחיר עד</th></tr>
${[...new Set(AV.map(a=>a.type))].map(t=>{const s=AV.filter(a=>a.type===t);const ar=s.map(a=>a.area),p=s.map(a=>a.post);return `<tr><td>${t}</td><td>${s.length}</td><td>${Math.min(...ar)}${Math.min(...ar)!==Math.max(...ar)?'–'+Math.max(...ar):''}</td><td>${sh(Math.min(...p))}</td><td>${sh(Math.max(...p))}</td></tr>`}).join('')}</table></div>

<div class="card"><h2>המבנה</h2><ul>
<li>קרקע: 4 דירות גן · קומות 1–3: 8 לקומה · קומה 4: 8 (4 מיני פנטהאוז + 4 רגילות) · קומה 5: 6 פנטהאוזים</li>
<li>5 קומות + גג, גובה ~23.65 מ׳, מעלית אחת בכל בניין, עד 4 דירות לקומה בכל בניין</li>
<li>חזית: טיח משולב אבן, מעקות זכוכית · חניה עילית, מחסן לכל דירה</li>
<li>סטטוס תב״ע/היתר: 35 דירות לפי תב״ע, 42 לפי היתר (תוספת 20%) · "אחרי החלטת ועדה"</li>
<li>סוג מכרז: דיור מופחת · לא מסומן כ"יצא לשיווק" בגיליון המגרשים · תנאי תשלום: לא מצוין</li>
</ul></div>

<div class="card warn"><h2>🚩 סתירות וחוסרים – לברר בפגישה</h2><ul>
<li><b>בניין A/B של הפנטהאוזים:</b> החוברת אומרת פנטהאוז 42 = בניין A ו-37 = בניין B. הגיליון (לפי העמודה "מבנה") מציב את 37 ב-A ואת 42 ב-B. הפוך!</li>
<li><b>חיבור חשמל:</b> המפרט (docx) – דירות רגילות 3×25 אמפר; חוברת 3 חדרים – 3×40; פנטהאוז/גן – 3×40.</li>
<li><b>דירת 3 חדרים:</b> חוברת – מרפסת 12 מ״ר ומחסן 6 מ״ר. מחירון – מרפסת 14.3–15 ומחסן 3–3.8 מ״ר.</li>
<li><b>אינטרפוץ:</b> חוברת 3 חדרים – 4 דרך; המפרט – 3 דרך.</li>
<li><b>חניה:</b> מפרט – חניה אחת לכל דירה; חוברת פנטהאוז – 2 חניות לדירה.</li>
<li><b>מחיר פנטהאוז 5 חדרים (37, 42):</b> אחרי הישיבה ₪2,250,000 – <i>גבוה</i> מהפרה-סייל (₪2,216,250) ושווה למחירון. בכל שאר הדירות המחיר ירד. מכוון?</li>
<li><b>דירות 39 ו-40</b> (פנטהאוז 3 חדרים) מסומנות ב-X בעמודה ללא כותרת. מה זה אומר (שמורות? הסרה?).</li>
<li>3 שורות באחוזים בתחתית הגיליון (1.2% / 0.4% / 0.8%) ללא כותרת – נראה כעמלות/היטלים. לוודא.</li>
<li>"מחיר למשתכן" (חומר שיווקי / גיליון מגרשים) מול "מחיר מטרה" (מחירון) – אותו דבר?</li>
<li>חסר: תנאי תשלום, מועד מסירה, עמלת תיווך, הצמדות חניה, מי המוכר, והטבות מס (המסמך השיווקי מציין "טרם אושר").</li>
</ul></div>

<div class="card q"><h2>❓ שאלות מומלצות לפגישה</h2><ul>
<li>תנאי תשלום וצמדות (הגיליון שלהם מראה 20/80 ללא הצמדה במגרשים אחרים בשכונה – כאן ריק)</li>
<li>מה בדיוק "בלי נדר, לסגירה" ועד מתי המחיר תקף?</li>
<li>מועד מסירה והערכת בנייה / אבני דרך</li>
<li>מה כלול במחיר: חניה (1 או 2), מחסן, גינה, מיזוג (הכנה למיני מרכזי בלבד), מטבח</li>
<li>ים המלח / נוף – לאילו דירות מאושר?</li>
<li>האם "פלדלת" זה שטח כולל קירות? (בחוברות: "בנוי")</li>
<li>מה קורה עם הדירות המסומנות X?</li>
</ul></div>
<div class="card"><h2>📎 הקבצים שנסרקו</h2><ul>
<li>מחירון (xlsx) – 42 דירות, 3 עמודות מחיר · גיליון מגרשים (xlsx) – 9 מגרשים בשכונה</li>
<li>מפרט (docx) – רגיל ופנטהאוז/גן · חומר שיווקי לאישור יזם (docx, 5.10.26)</li>
<li>חוברות: 3 חדרים, פנטהאוז A42, פנטהאוז B37 (PDF) + תכניות דירה מקור/מראה</li>
<li>DWFX – גיליון Revit: 2 חתכים + 4 חזיתות של שני הבניינים (ראה "נכסים ותמונות"); לא ניתן לקרוא ממנו נתוני תכנון טקסטואליים</li></ul></div>`;

/* ---------- price table ---------- */
[...new Set(APTS.map(a=>a.type))].forEach(t=>$('#fType').insertAdjacentHTML('beforeend',`<option>${t}</option>`));
let sortK='n',sortD=1;
const COLS=[['n','דירה'],['b','בניין'],['floor','קומה'],['type','טיפוס'],['dir','כיוון'],['area','פלדלת מ״ר'],['bal','מרפסת/גינה'],['stor','מחסן'],['list','שיווק'],['pre','פרה-סייל'],['post','אחרי ישיבה'],['ppm','₪/מ״ר']];
function renderPrice(){
  const col=$('#fCol').value,mx=+$('#fMax').value||Infinity;
  let rows=APTS.filter(a=>($('#fSold').checked||!a.sold)&&(!$('#fType').value||a.type===$('#fType').value)&&(!$('#fRooms').value||rooms(a)==$('#fRooms').value)&&(!$('#fFloor').value||String(a.floor)===$('#fFloor').value)&&(a.sold||a[col]<=mx));
  const val=(a,k)=>k==='ppm'?(a.sold?null:ppm(a)):a[k];
  rows.sort((x,y)=>{let p=val(x,sortK),q=val(y,sortK);if(p==null)return 1;if(q==null)return -1;return (p>q?1:p<q?-1:0)*sortD});
  $('#tbl').innerHTML='<tr>'+COLS.map(([k,t])=>`<th data-k="${k}">${t}${sortK===k?(sortD>0?' ▲':' ▼'):''}</th>`).join('')+'</tr>'+rows.map(a=>`<tr class="apt ${a.sold?'sold':''}" data-n="${a.n}"><td>${a.n}${a.sold?'<span class="tag s">נמכר</span>':''}${a.matara?'<span class="tag m">מטרה</span>':''}${a.x?'<span class="tag x">X</span>':''}</td><td>${a.b}</td><td>${a.floor}</td><td>${a.type}</td><td>${a.dir}</td><td>${a.area}</td><td>${a.bal}</td><td>${a.stor??'—'}</td><td>${sh(a.list)}</td><td>${sh(a.pre)}</td><td><b>${sh(a.post)}</b></td><td>${a.sold?'—':nf(ppm(a))}</td></tr>`).join('');
  const av=rows.filter(a=>!a.sold);
  $('#totals').innerHTML=av.length?`<b>${av.length}</b> דירות מוצגות · סה״כ (${$('#fCol').selectedOptions[0].text}): <b>${sh(sum(av,col))}</b> · ממוצע <b>${sh(sum(av,col)/av.length)}</b> · הזול ${sh(Math.min(...av.map(a=>a[col])))} · היקר ${sh(Math.max(...av.map(a=>a[col])))}`:'אין דירות מתאימות';
}
$('#t-price').addEventListener('input',renderPrice);
$('#tbl').onclick=e=>{const th=e.target.closest('th');if(th){const k=th.dataset.k;sortD=sortK===k?-sortD:1;sortK=k;return renderPrice()}const tr=e.target.closest('tr.apt');if(tr)showApt(+tr.dataset.n)};
renderPrice();

function showApt(n){
  const a=APTS.find(x=>x.n===n);
  $('#dt').textContent=`דירה ${a.n} – ${a.type} · בניין ${a.b} · קומה ${a.floor}`;
  let h='<div class="dh">';
  h+=`שטח פלדלת ${a.area} מ״ר · מרפסת/גינה ${a.bal} מ״ר · מחסן ${a.stor??'אין'} · כיוונים ${a.dir}<br>`;
  h+=a.sold?'<b style="color:var(--red)">נמכרה</b>':`מחירון <b>${sh(a.list)}</b> · פרה-סייל <b>${sh(a.pre)}</b> · אחרי ישיבה <b>${sh(a.post)}</b> (${nf(ppm(a))} ₪/מ״ר)`;
  if(a.x)h+='<br>⚠ מסומנת X בגיליון – לברר.';
  if(n===37||n===42)h+='<br>⚠ החוברת והגיליון חלוקים באיזה בניין (A/B) הדירה.';
  h+='</div>';
  const img=PLAN[n]||(rooms(a)===3?'img/plan-3r.jpg':null);
  h+=img?`<img src="${img}">`:'<div class="dh" style="color:var(--mut)">אין תכנית דירה זו במסמכים שהועלו.</div>';
  $('#db').innerHTML=h;$('#dlg').showModal();
}

/* ---------- properties ---------- */
const CARDS=[
['הדמיית הפרויקט','img/aerial.jpg','בניין B, פנטהאוז 5 חדרים – מחוברת מהחוברת','img/aerial.jpg'],
['חתכים וחזיתות (Revit)','img/elevations.jpg','2 חתכים + 4 חזיתות של שני הבניינים','img/elevations.jpg'],
['דירת 3 חדרים · 81 מ״ר','img/plan-3r.jpg','מרפסת 12 · מחסן 6 (לפי חוברת) · תכנית + מפרט','img/plan-3r.jpg'],
['פנטהאוז 5 חדרים · דירה 42','img/plan-A42.jpg','139 מ״ר · מרפסת 84 · '+sh(2250000),'img/plan-A42.jpg'],
['פנטהאוז 5 חדרים · דירה 37','img/plan-B37.jpg','135 מ״ר · מרפסת 78 · '+sh(2250000),'img/plan-B37.jpg'],
['חוברת פנטהאוז A42','img/page-A42.jpg','עמוד 2 המלא עם מפרט','img/page-A42.jpg'],
['חוברת פנטהאוז B37','img/page-B37.jpg','עמוד 2 המלא עם מפרט','img/page-B37.jpg']];
$('#cards').innerHTML=CARDS.map((c,i)=>`<div class="card" data-i="${i}"><img src="${c[1]}" loading="lazy"><div class="in"><b>${c[0]}</b><br><small>${c[2]}</small></div></div>`).join('')+
[...new Set(APTS.map(a=>a.type))].map(t=>{const all=APTS.filter(a=>a.type===t),av=all.filter(a=>!a.sold);return `<div class="card" data-t="${t}"><div class="in"><b>${t}</b><br><small>${av.length} פנויות מתוך ${all.length}<br>${av.length?sh(Math.min(...av.map(a=>a.post)))+' – '+sh(Math.max(...av.map(a=>a.post))):'נמכרו'}</small><div class="bar" style="margin-top:6px"><i style="width:${100*(all.length-av.length)/all.length}%"></i></div><small>נמכר ${all.length-av.length}</small></div></div>`}).join('');
$('#cards').onclick=e=>{const c=e.target.closest('.card');if(!c)return;if(c.dataset.i){const x=CARDS[c.dataset.i];$('#dt').textContent=x[0];$('#db').innerHTML=`<img src="${x[3]}">`;$('#dlg').showModal()}else if(c.dataset.t){const l=APTS.filter(a=>a.type===c.dataset.t);$('#dt').textContent=c.dataset.t;$('#db').innerHTML='<div class="dh">'+l.map(a=>`<div>דירה ${a.n} · ב׳${a.b} · קומה ${a.floor} · ${a.area} מ״ר · ${a.dir} · ${a.sold?'<b>נמכר</b>':sh(a.post)}</div>`).join('')+'</div>';$('#dlg').showModal()}};

/* ---------- spec ---------- */
const SPEC={
'בניין (כולם)':['לובי כניסה מעוצב, פיתוח סביבתי מוקפד','חניון עילי – חניה פרטית לכל דירה + הכנה לעמדת טעינה חשמלית (חוברת פנטהאוז: 2 חניות)','מעלית חדשה'],
'דירה (כולם)':['דלת כניסה מבית רשפים','דלתות פנים פנדור או ש״ע','ריצוף גרניט פורצלן 100×100 לבחירה','ריצוף מרפסות 30×30 או 15×60','תריסים בכל הדירה כולל הזזה בממ״ד','תריס חשמלי + מנואלה בסלון','רשתות בכל החלונות'],
'חדרי רחצה':['אסלות תלויות עם הדחה סמויה','ריצוף אנטי-סליפ','חיפוי קרמיקה עד התקרה','אמבטיה אקרילית','אינטרפוץ 3 דרך במקלחת (חוברת 3 חדרים: 4 דרך)','ארון אמבטיה עם כיור אינטגרלי ומראה'],
'חשמל וטכני':['רגילות: תלת-פאזי 3×25 (חוברת 3 חדרים: 3×40)','גן / מיני פנטהאוז / פנטהאוז: 3×40','נקודות תקשורת בחדרי שינה ובסלון','הכנה למיזוג מיני מרכזי (חוברת 3 חדרים: מערכת מיזוג דירתית דירוג A + הנמכת גבס – לא עקבי)','דוד שמש משולב חשמל 150 ליטר','אינטרקום עם מסך צבעוני','פנטהאוז/גן: נקודות מים, חשמל וגז במרפסות'],
'מטבח':['ארונות איכותיים עם טריקה שקטה','כיור אקרילי/נירוסטה','ברז עם ראש נשלף','משטח אבן קיסר','הכנה למדיח','חיפוי קרמיקה'],
'חוברת 3 חדרים בלבד':['ויטרינה רחבה ליציאה למרפסת','חלונות אלומיניום זיגוג כפול/טריפלקס/בידודית','מסך מגע באינטרקום','יחידת BI וקלפה במטבח','הכנה למייבש ומכונת כביסה','הכנה לחימום מים דירתי בגז','נק׳ מים למקרר, נק׳ גז במטבח ובמרפסת']};
$('#t-spec').innerHTML=Object.entries(SPEC).map(([k,v])=>`<div class="card"><h2>${k}</h2><ul>${v.map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')+'<small>המפרט בחוברות הוא להמחשה בלבד; מחייב רק הסכם המכר.</small>';

/* ---------- market ---------- */
$('#t-mkt').innerHTML=`<div class="card"><h2>9 מגרשים בשכונה (גיליון מתחרים)</h2><div class="wrap"><table><tr><th>יזם</th><th>מגרש</th><th>סטטוס</th><th>דירות היתר</th><th>שוק חופשי</th><th>קומות</th><th>חניה</th><th>מעליות</th><th>חיפוי</th><th>שווק</th><th>תנאי תשלום</th></tr>
${PLOTS.map(p=>`<tr ${p['מס\' מגרש:']==109?'style="background:#f3f7de;font-weight:700"':''}><td>${p['שם יזם:']}</td><td>${p['מס\' מגרש:']}</td><td>${p['סטטוס:']}</td><td>${p['דירות לפי היתר:']}</td><td>${p['דירות שוק חופשי:']}</td><td>${p['קומות מקסימלי למבנה:']}</td><td>${p['חניות:']}</td><td>${p['מעליות:']}</td><td>${p['חיפוי חוץ:']}</td><td>${p['יצא לשיווק:']}</td><td>${p['תנאי תשלום:']}</td></tr>`).join('')}</table></div></div>
<div class="card"><h2>מה זה אומר</h2><ul><li>רק מגרשים 112, 101א, 101ב כבר בבנייה/מאוכלסים ויש להם תנאי תשלום 20/80 ללא הצמדה – בנקודת ייחוס לשאלה על תנאי התשלום של 109.</li><li>109 (מסומן) קטן-בינוני: 42 דירות, 32 שוק חופשי, בלי מסחר, חניה עילית בלבד, מעלית אחת לבניין.</li><li>110 ו-102 נמכרים כ"מחיר מטרה"/דיור מופחת. 108 ו-111 מיועדים לקהל חרדי (סוכה).</li></ul></div>
<div class="card"><h2>המסר השיווקי (לאישור יזם)</h2>סלוגן: <b>"איכות שרואים, בית שמרגישים"</b> · מסר מכירה: <b>"לא צריך לעזוב את ערד כדי להתקדם"</b>. קהל ליבה: תושבי ערד (משפרי דיור, משפחות צעירות, מצמצמים); בשלב ב׳ באר שבע והדרום. ים המלח – רק לדירות שאושרו. פארק/גן הרפתקאות/מרחקים – רק לאחר אימות. אין להבטיח "יוקרה" או חיסכון ללא בסיס. משרד מכירות: אנגלו סכסון, מרכז מסחרי ערד (חן 29) · 08-3852118.</div>`;

/* ---------- Q&A ---------- */
const KB=[
[['חניה','חניות','טעינה','רכב'],'חניון עילי, חניה פרטית לכל דירה עם הכנה לעמדת טעינה לרכב חשמלי. בחוברת הפנטהאוז כתוב "2 חניות עיליות לכל דירה". המפרט וחוברת הפנטהאוז לא עקביים – לברר כמה חניות בכל סוג דירה.'],
[['חשמל','אמפר','פאזי'],'דירות רגילות: 3×25 אמפר לפי המפרט (חוברת 3 חדרים אומרת 3×40). גן/מיני פנטהאוז/פנטהאוז: 3×40. סתירה – לברר.'],
[['מיזוג','מזגן','מיני מרכזי'],'המפרט: הכנה למיזוג מיני מרכזי (הכנה בלבד, המערכת לא כלולה). חוברת 3 חדרים מציינת מערכת מיזוג דירתית דירוג A + הנמכת גבס. לא עקבי – לברר.'],
[['מטבח','קיסר','ארונות'],'מטבח: ארונות איכותיים עם טריקה שקטה, משטח אבן קיסר, כיור אקרילי/נירוסטה, ברז נשלף, הכנה למדיח, חיפוי קרמיקה. (3 חדרים: גם יחידת BI וקלפה).'],
[['ריצוף','גרניט','פורצלן'],'ריצוף גרניט פורצלן 100×100 לבחירה; מרפסות 30×30 או 15×60; חדרים רטובים אנטי-סליפ וחיפוי עד התקרה.'],
[['מעלית'],'מעלית חדשה, אחת בכל בניין (גיליון מגרשים).'],
[['מסירה','איכלוס','לוח זמנים'],'מועד מסירה לא מופיע באף מסמך. המסמך השיווקי: "יתווסף רק לפי אישור עדכני". שאלה מרכזית לפגישה.'],
[['תשלום','הצמדה','מקדמה','נדר','מימון'],'תנאי תשלום לא מצוינים לפרויקט (ריק בגיליון). במגרשים אחרים בשכונה 20/80 ללא הצמדה. המחירון האחרון הוא "אחרי ישיבה 19.10.26 – בלי נדר – לסגירה". לברר מה כלול ומה התוקף.'],
[['מחסן'],'מחסן בכל דירה (בקומה/בלובי). גדלים במחירון: 2.9–5.6 מ״ר (3 מ״ר ב-3 חדרים; לדירה 3 אין מחסן). חוברת 3 חדרים אומרת 6 מ״ר – סתירה.'],
[['נוף','ים המלח'],'נוף לים המלח רק בדירות שאושרו פרטנית, לא הבטחה לכל הפרויקט. הרשימה לא נמסרה.'],
[['מחיר למשתכן','מטרה','מחיר מטרה'],'10 דירות "מחיר מטרה" נמכרו (6, 11, 22, 24, 26, 28, 30, 31, 34, 35). אין כאלה למכירה.'],
[['יזם','מוכר','עידו'],'יזם לפי גיליון המגרשים: עידו מאיר, מגרש 109. מוכר/מתווך אחראי ורישיון – טרם הוגדרו במסמך השיווקי.'],
[['מיקום','כתובת','איפה','שכונה'],'שכונת הראשונים, ערד, מגרש 109. משרד מכירות: אנגלו סכסון, מרכז מסחרי ערד (חן 29), טל׳ 08-3852118.'],
[['בניין','קומות','גובה'],'2 בניינים, 5 קומות + גג, גובה ~23.65 מ׳, עד 4 דירות לקומה לבניין, חיפוי טיח משולב אבן, מעקות זכוכית.'],
[['חוזר','תב"ע','היתר','ועדה'],'35 דירות לפי תב״ע, 42 לפי היתר (תוספת 20%). סטטוס: אחרי החלטת ועדה. סוג מכרז: דיור מופחת.'],
[['סתירה','בעיה','דגל','לברר','שאלות'],'עיקרי הסתירות: A/B של פנטהאוז 37/42, חשמל 25/40 אמפר, מרפסת/מחסן של 3 חדרים, אינטרפוץ 3/4 דרך, חניה 1/2, מחיר 5 חדרים פנטהאוז עלה אחרי הישיבה, סימון X בדירות 39-40. פירוט מלא בטאב "סיכום".']
];
const WORDS={אחד:1,שניים:2,שלוש:3,שלושה:3,ארבע:4,ארבעה:4,חמש:5,חמישה:5};
const fmtA=a=>`דירה ${a.n} · ${a.type} · ב׳${a.b} קומה ${a.floor} · ${a.area} מ״ר · מרפסת ${a.bal} · ${a.dir} · ${a.sold?'נמכרה':sh(a.post)}`;
const parseBudget=q=>{const m=q.match(/(?:עד|מתחת ל|לא יותר מ|תקציב)\s*(?:של\s*)?([\d.,]+)\s*(מיליון|מ'|מ״|אלף|k)?/);if(!m)return null;let v=parseFloat(m[1].replace(/,/g,''));if(m[2]&&/מיליון|מ'|מ״/.test(m[2]))v*=1e6;else if(m[2]&&/אלף|k/.test(m[2]))v*=1e3;else if(v<100)v*=1e6;else if(v<10000)v*=1e3;return v};
function answer(q){
  q=q.replace(/[?!]/g,'').trim();const ql=q;
  let m;
  if((m=ql.match(/דירה\s*(?:מספר\s*)?(\d{1,2})\b/))){const a=APTS.find(x=>x.n==+m[1]);if(a){window._last=a.n;return fmtA(a)+(a.sold?'':`\nמחירון ${sh(a.list)} · פרה-סייל ${sh(a.pre)} · אחרי ישיבה ${sh(a.post)} (${nf(ppm(a))} ₪/מ״ר)`)+(a.x?'\n⚠ מסומנת X בגיליון.':'')+(PLAN[a.n]||rooms(a)===3?'\n(תכנית – בטאב "נכסים ותמונות" או לחיצה על השורה במחירון)':'')}}
  if(/כמה.*(נמכר|נשאר|פנוי|זמין)|נמכרו|פנויות|מלאי/.test(ql))return `סה״כ 42 דירות: ${SOLD.length} נמכרו (כולן מחיר מטרה), ${AV.length} פנויות.\nפנויות לפי סוג:\n`+[...new Set(AV.map(a=>a.type))].map(t=>`• ${t}: ${AV.filter(a=>a.type===t).length}`).join('\n');
  if(/סה״כ|סך הכל|שווי|הנחה|פרה.?סייל|מחירון/.test(ql)&&!/דירה/.test(ql))return `32 דירות פנויות (כולל מע״מ):\n• מחירון שיווק: ${sh(tl)}\n• פרה-סייל: ${sh(tp)} (−1.5%)\n• אחרי ישיבה 19.10.26 (בלי נדר, לסגירה): ${sh(tq)} (−${(100-100*tq/tl).toFixed(1)}%)\nחסכון מפרה-סייל לאחרי הישיבה: ${sh(tp-tq)}.`;
  const r=(()=>{let x=ql.match(/(\d(?:\.5)?)\s*חדרים?/);if(x)return +x[1];for(const w in WORDS)if(new RegExp(w+'\\s*חדרים?').test(ql))return WORDS[w];return null})();
  const k=/מיני/.test(ql)?'מיני פנטהאוז':/פנטהאוז/.test(ql)?'פנטהאוז':/גן|גינה/.test(ql)?'גן':null;
  const fm=ql.match(/קומה\s*(\d|קרקע)/),bud=parseBudget(ql);
  const cheap=/זול|הכי נמוך|מינימום/.test(ql),exp=/יקר|הכי גבוה|מקסימום/.test(ql),big=/גדול|הכי הרבה מ״ר|מרווח/.test(ql),ppmq=/למ״ר|למטר|לפי מ״ר|יקר למטר|משתלם/.test(ql);
  const bld=ql.match(/בניין\s*([ABab])/);
  const isQ=r||k||fm||bud||cheap||exp||big||ppmq||bld||/דירות|רשימה|הציעו|מה יש|אפשרויות/.test(ql);
  if(isQ&&!KB.some(([ks])=>ks.some(w=>ql.includes(w))&&!(r||k||bud))){
    let l=AV.slice();
    if(r)l=l.filter(a=>rooms(a)===r);if(k)l=l.filter(a=>a.type.startsWith(k)||(k==='פנטהאוז'&&kind(a)==='פנטהאוז'));
    if(k==='פנטהאוז'&&!/מיני/.test(ql))l=l.filter(a=>kind(a)==='פנטהאוז');
    if(fm)l=l.filter(a=>String(a.floor)===fm[1]);if(bud)l=l.filter(a=>a.post<=bud);if(bld)l=l.filter(a=>a.b===bld[1].toUpperCase());
    if(!l.length)return 'לא נמצאו דירות פנויות שמתאימות'+(bud?` עד ${sh(bud)}`:'')+'. נסה להרחיב.';
    if(ppmq)l.sort((a,b)=>ppm(a)-ppm(b));else if(exp||big)l.sort((a,b)=>exp?b.post-a.post:b.area-a.area);else l.sort((a,b)=>a.post-b.post);
    const top=(cheap||exp||big||ppmq)?l.slice(0,3):l;
    return `נמצאו ${l.length} דירות פנויות${(cheap||exp||big||ppmq)?` – ${ppmq?'הכי משתלמות למ״ר':big?'הגדולות':exp?'היקרות':'הזולות'} (${top.length}):`:':'}\n`+top.map(a=>fmtA(a)+(ppmq?` · ${nf(ppm(a))} ₪/מ״ר`:'')).join('\n')+(l.length>top.length?`\n… ועוד ${l.length-top.length}`:'')+`\n(מחירים אחרי ישיבה 19.10, כולל מע״מ)`;
  }
  let best=null,bs=0;for(const e of KB){const s=e[0].filter(w=>ql.includes(w)).length;if(s>bs){bs=s;best=e}}
  if(best)return best[1];
  return 'לא מצאתי תשובה במסמכים. נסה לשאול על: מחיר של X חדרים, דירה מספר N, כמה נמכרו, תקציב עד 1.6 מיליון, חניה, חשמל, מסירה, תנאי תשלום, או "סתירות".';
}
const msgs=$('#msgs');
function say(t,c){const d=document.createElement('div');d.className='m '+c;d.textContent=t;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight}
say('שלום 👋 אני יודע הכל על נופי הראשונים לפי המסמכים. שאל אותי על מחירים, דירות, מפרט או מה לברר בפגישה.','b');
$('#chips').innerHTML=['כמה דירות נשארו?','הכי זולה 4 חדרים','דירות 5 חדרים','דירות עד 1.5 מיליון','פנטהאוז','מה הכי משתלם למ״ר?','תנאי תשלום','איזה סתירות יש?','דירה 16','כמה חניות?'].map(t=>`<button>${t}</button>`).join('');
function ask(t){if(!t.trim())return;say(t,'u');say(answer(t),'b')}
$('#f').onsubmit=e=>{e.preventDefault();ask($('#qi').value);$('#qi').value=''};
$('#chips').onclick=e=>{if(e.target.tagName==='BUTTON')ask(e.target.textContent)};

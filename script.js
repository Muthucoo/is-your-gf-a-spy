const $ = (id) => document.getElementById(id);
const question = $("question"), hint = $("hint"), title = $("stepTitle"), progress = $("progress"), answers = $("answers");
let current = "start", trail = [];

const steps = {
  start: {title:"First things first…", q:"What do you do?", hint:"The entire investigation depends on your answer.", yes:"AI", no:"Not AI", next:{yes:"ai10",no:"government"}},
  ai10: {title:"Route A · Artificial Intelligence",q:"Is she a 10?",hint:"The Bureau's peer-reviewed attractiveness metric.",yes:"YES",no:"NO",next:{yes:"spy10",no:"company"}},
  company: {title:"Route A · Funding round",q:"Is your company worth over $100M?",hint:"If your valuation is below this, please remain calm.",yes:"YES",no:"relax",next:{yes:"listener",no:"relax"}},
  listener: {title:"Route A · Active listening",q:"Is she a good listener?",hint:"This is somehow relevant to venture capital.",yes:"YES",no:"vc",next:{yes:"gpu",no:"vc"}},
  gpu: {title:"Route A · GPU compliment",q:"Does she say your GPU is the highest she's ever seen?",hint:"A highly technical and completely normal romantic question.",yes:"YES",no:"NO",next:{yes:"spy",no:"watch"}},
  government: {title:"Route B · Public service",q:"Are you in the government?",hint:"Please answer honestly. This is a fake website, but still.",yes:"YES",no:"NO",next:{yes:"taiwan",no:"crypto"}},
  taiwan: {title:"Route B · Geopolitics",q:"Does she avoid talking about Taiwan?",hint:"The flowchart author has concerns about this.",yes:"YES",no:"NO",next:{yes:"spy",no:"classified"}},
  classified: {title:"Route B · Document security",q:"Does she ask you about classified documents?",hint:"Maybe don't leave those lying around anyway.",yes:"YES",no:"NO",next:{yes:"redflag",no:"probably"}},
  crypto: {title:"Route B · Crypto bro checkpoint",q:"Are you in crypto?",hint:"The blockchain has entered the investigation.",yes:"YES",no:"normal",next:{yes:"kim",no:"normal"}},
  kim: {title:"Route B · International relations",q:'Can she say "Kim Jong Un is a big pig"?',hint:"Do not ask why this is the test. The Bureau refuses to elaborate.",yes:"YES",no:"northKorea",next:{yes:"money",no:"northKorea"}},
  money: {title:"Route B · Tax season",q:"Did you make more than $100k from crypto?",hint:"The IRS would like to know your location. (Kidding.)",yes:"YES",no:"probably",next:{yes:"irs",no:"probably"}}
};
const outcomes = {
  spy10:["SPY","The Bureau has identified a suspiciously perfect operative. Trust nobody. Especially the flowchart."],
  spy:["SPY","Case closed. Probably. The red arrows have spoken."],
  northKorea:["SPY (NORTH KOREAN)","This is an extremely unserious geopolitical assessment. Please do not cite us at the UN."],
  irs:["IRS AGENT","Congratulations. You may have accidentally dated a tax audit. Please retain all crypto receipts."],
  vc:["VC ASSOCIATE (WORSE)","Not a spy. Somehow, the Bureau believes this is a worse outcome."],
  watch:["COULD STILL BE A SPY","Keep watching. Or maybe just communicate like adults. The Bureau recommends neither."],
  relax:["YOU CAN RELAX (FOR NOW)","No spy detected. Your startup valuation, however, remains under investigation."],
  probably:["PROBABLY NOT A SPY","Insufficient evidence. Suspicion levels reduced to a manageable 73%."],
  normal:["PROBABLY A NORMAL GF","A rare and beautiful outcome. Please cherish this statistical anomaly."],
  redflag:["🚨 VERY SUSPICIOUS","The original chart gets a little mysterious here. The Bureau has stamped this RED FLAG and called it a day."]
};
function renderStep(id){
  current=id; const s=steps[id]; if(!s){showResult(id);return;}
  title.textContent=s.title;question.textContent=s.q;hint.textContent=s.hint;
  progress.style.width=(Math.min(95,(trail.length+1)*12))+"%";
  answers.innerHTML=`<button class="answer yes" data-answer="yes">${s.yes}<span>↗</span></button><button class="answer no" data-answer="no">${s.no}<span>↘</span></button>`;
  answers.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>choose(btn.dataset.answer)));
  $("investigation").scrollIntoView({behavior:"smooth",block:"center"});
}
function choose(answer){trail.push({step:current,answer});const next=steps[current].next[answer];renderStep(next);}
function showResult(id){
  const [name,desc]=outcomes[id]||outcomes.probably;
  $("resultTitle").textContent=name;$("resultText").textContent=desc;
  $("resultSeal").textContent=id==="irs"?"TAX EVASION UNIT":id==="spy"||id==="spy10"||id==="northKorea"?"CONFIRMED-ish":"CASE FILED";
  $("resultOverlay").classList.add("show");$("resultOverlay").setAttribute("aria-hidden","false");
  $("confetti").innerHTML=Array.from({length:55},(_,i)=>`<i style="left:${Math.random()*100}%;animation-delay:${Math.random()*.9}s;transform:rotate(${Math.random()*180}deg)"></i>`).join("");
  progress.style.width="100%";
}
function reset(){trail=[];$("resultOverlay").classList.remove("show");$("resultOverlay").setAttribute("aria-hidden","true");renderStep("start");}
$("startBtn").addEventListener("click",()=>{renderStep("start");});
$("restartSmall").addEventListener("click",reset);$("againBtn").addEventListener("click",reset);$("closeResult").addEventListener("click",()=>{$("resultOverlay").classList.remove("show");$("resultOverlay").setAttribute("aria-hidden","true");});
$("shareBtn").addEventListener("click",async()=>{const text=`My Totally Accurate Spy Detector result: ${$("resultTitle").textContent}. Take the test!`;if(navigator.share){try{await navigator.share({title:"Is Your GF a Spy?",text,url:location.href})}catch(e){}}else if(navigator.clipboard){await navigator.clipboard.writeText(text+" "+location.href);$("shareBtn").textContent="COPIED TO CLIPBOARD ✓";}});
renderStep("start");

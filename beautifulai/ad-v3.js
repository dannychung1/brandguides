/* ad-v3.js: prompt builder v3, Part A (spec of Nov 16, 2026).
   Writes the compact prompt: one labeled line per element, each chip owning its own line.
   Line order: Photo · Subject · Moment · Gaze · Light · Frame · Wardrobe · Cast · Hair · Screen · Look · Never include · Avoid.
   Loads after ad-data.js and before ad-gallery.js; replaces AD.build and the option lists the form reads. */
(function(){
  var AD=window.AD;if(!AD)return;

  /* ── state: every random pick is kept in R, so a chip change re-rolls only its own line ── */
  var R={},LV=[],LVK={};
  function keep(k,fn){if(!(k in R))R[k]=fn();return R[k]}
  function one(a){return a[Math.floor(Math.random()*a.length)]}
  function pickN(a,n){var c=a.slice(),o=[];while(o.length<n&&c.length)o.push(c.splice(Math.floor(Math.random()*c.length),1)[0]);return o}
  function v(k,t){t=String(t);LV.push(t);LVK[t]=k;return t}

  /* ── fixed lines (section 1) ── */
  var LOOK='Look: natural grade with warm highlights and warm, glowing skin; neutral midtones and neutral shadows, never blue; whites stay clean; rich but real color, crisp with moderate contrast, fine grain';
  var AVOID='Avoid: plastic or airbrushed skin, a cut-out or composited look, stock-photo posing, god rays, lens flare, halos, HDR, a teal-orange grade, an orange or golden cast';
  var NEVER='Never include: readable text, words, numbers, logos or signage; no paper, printed pages, printed slides, notebooks, sketches or outlines; no phone in a hand; no cans or bottles';
  var HAIR='Hair: styled and groomed for a workday, neat and in place, with natural texture and a few fine strands at the hairline; never messy, windswept, frizzy or wet-looking, never helmet-stiff or plastic';
  var SKIN='Skin: real, detailed skin on every skin tone: visible pores, fine lines and natural unevenness; deep and dark skin keeps its full texture and true undertones, matte with only a soft natural sheen on the high points, never glossy, waxy, smoothed or airbrushed';
  var SKIN_H='Skin: real, detailed skin on the hands for every skin tone: knuckle creases, fine lines and visible texture, never glossy, waxy or smoothed';
  var SCREEN_BLANK=function(dev){return 'Screen: '+dev+' is on and completely blank: a flat, even light grey rectangle inside its thin bezel, all 4 corners visible, nothing overlapping it, no interface, icons or text, ready for a screenshot in post'};

  /* ── times, wins, places and poses (sections 3 and 6) ──
     Each time sets the light and its own wins; the Setting chip picks the place; the place's posture tag picks the pose. */
  var ALL=['Office','Home','Home office','Café','In transit','Coworking','Hotel'];
  var TIMES=[
    {k:'7:30',time:'7:30 a.m.',light:'cool early-morning daylight with warm patches of low sun',types:['Sun','Backlit','Soft'],sets:ALL,tags:['s','st','pe','le','so','h'],
      wins:['the first draft is done before the day starts','the outline clicks over the first coffee','the overnight edits from the team are all in','the opening slide finally says it','the deck is ready before anyone else is up','the agenda is set before the first call']},
    {k:'9:00',time:'9:00 a.m.',light:'bright, clean morning light',types:['Sun','Soft','Backlit'],sets:ALL,tags:['s','st','h','w','le','so','pe'],
      wins:['a final tweak lands on the way in','the numbers update in one pass','the deck is shared before the 9:30','the last slide clicks into place on the way','the reply comes back: "looks great"','the story order finally makes sense']},
    {k:'10:55',time:'10:55 a.m.',light:'open window light',types:['Soft','Backlit'],sets:['Office','Coworking','Hotel','Café','Home office','Home'],tags:['w','st'],
      wins:['they walk in ready','the deck is up on screen before anyone sits down','the last check is done at the door','a colleague says "this looks sharp" on the way in','they walk in with time to spare','the one-pager is open and ready']},
    {k:'11:30',time:'11:30 a.m.',light:'bright midday light',types:['Soft','Sun'],sets:['Office','Coworking','Hotel'],tags:['pr'],screen:true,
      wins:['they win the room','the high-stakes pitch hits its turning point','the toughest question gets the best answer','the skeptic at the table starts nodding','the room asks for the next slide before it comes up','the pitch lands the way it was rehearsed','the room leans in','the room goes quiet on the key slide','someone asks for the deck before it ends','the chart makes the point on its own','the questions are the good kind','the decision gets made in the room']},
    {k:'12:30',time:'12:30 p.m.',light:'hard midday sun',types:['Sun'],sets:ALL,tags:['h','s','st'],company:true,
      wins:['the idea gets a laugh','a colleague says "that’s the slide"','the plan comes together over lunch','a rough idea becomes a slide in minutes','they both agree on the headline','a quick win worth a grin']},
    {k:'2:00',time:'2:00 p.m.',light:'soft, even afternoon light',types:['Soft'],sets:['Office','Home office','Home','Coworking','Hotel','Café'],tags:['s','pe'],act:'on a video call',
      wins:['the client on the call says "send me that"','the call ends 10 minutes early','the client asks to share the deck with their team','the follow-up deck is sent before the call ends','the client asks, "can we use this for the board?"','the client nods along on the video call']},
    {k:'4:45',time:'4:45 p.m.',light:'low late-afternoon sun, clear rather than golden',types:['Sun','Backlit','Soft'],sets:ALL,tags:['so','le','s','pe','st'],
      wins:['the deck is sent: the exhale','the last comment is resolved','the proposal goes out on time','the deck is approved without a change','the inbox finally goes quiet','the laptop eases halfway closed, done']},
    {k:'6:15',time:'6:15 p.m.',light:'the last daylight fading toward dusk, cool outside, with a few lamps on inside',types:['Backlit','Sun','Soft'],sets:['Office','Home office','Coworking','Hotel','In transit','Home'],tags:['s','pe','le','w','st'],dim:true,
      wins:["tomorrow's deck is done",'the week’s last deck goes out','the team’s slides are merged and clean','the deck is locked and the coat goes on','the morning review is prepped','the room empties and the work is done']}
  ];
  /* role wins mix in about 2 times in 5, so a leader's win reads like a leader's */
  var RWINS={
    'Marketing':['the campaign story finally clicks','the launch deck gets a yes from the brand team','the hero slide lands on the first try','the results slide makes the numbers sing','the creative review ends early'],
    'Sales':['the prospect asks for the proposal by Friday','the renewal deck gets a nod','the pricing slide answers the question before it’s asked','the demo deck lands with the buyer','the forecast review goes smoothly'],
    'Business development':['the partner says "let’s do this"','the pitch earns a second meeting','the market map makes the case in one slide','the deal summary is ready ahead of the call','the intro deck opens the door'],
    'Consultants & analysts':['the client signs off on the recommendation','the findings deck tells the story in 10 slides','the steering committee nods along','the workshop readout is done by noon','the analysis finally fits on one slide'],
    'Team leader':['the team’s deck comes together in one pass','the team review ends with everyone aligned','a teammate’s slide gets the credit it deserves','the all-hands deck is locked','the quarterly plan lands with the team'],
    'C-suite':['the board deck is locked a day early','the investor update reads clear and calm','the all-hands story lands with the whole company','the strategy slide gets a yes from the board','the budget review wraps in half the time']
  };
  /* places per setting, each tagged with its posture: s seated · st standing · pe perched · le ledge · so sofa · w walking or arriving · pr presenting · h tall table */
  var PLACES={
    'Office':[['s','at a wide desk by the window'],['s','in a glass-walled meeting room'],['s','at a long shared table'],['s','in a quiet library-style booth'],['h','at a tall table in the break-out area'],['st','at the kitchen bar in the office'],['so','on a low sofa in the office lounge'],['pe','on the edge of a desk on the open floor'],['le','at a window ledge in a quiet corner'],['st','at a standing desk'],['w','across the open floor'],['w','in the hallway outside a meeting room'],['w','at a meeting-room door, about to step in'],['pr','in a meeting room, at a wall-mounted screen'],['pr','at the head of a long boardroom table, beside a wall-mounted screen']],
    'Home':[['st','at the kitchen counter'],['s','at the dining table'],['so','on the sofa'],['so','in an armchair by a bookcase'],['le','on a window seat'],['st','at a breakfast bar'],['s','at a table in a sunroom'],['s','at a balcony table, the door open behind them'],['s','at the kitchen table after breakfast'],['h','on a stool at the kitchen island'],['w','down the hallway at home, on the way out']],
    'Home office':[['s','at their desk by the window'],['s','at a desk in a converted spare room'],['st','at a standing desk'],['le','at the window ledge'],['s','at a desk in a garden studio'],['pe','on the edge of their desk'],['st','at the kitchen counter before heading to the desk'],['so','on a reading chair in the corner of the study']],
    'Café':[['s','at a café window table'],['h','at a tall café table'],['so','in a deep café armchair by the window'],['s','at a small marble table'],['s','on a long bench in a bakery café'],['s','at a café terrace table under an awning'],['h','on a stool at the coffee bar'],['s','at a table in a bookshop café'],['w','stepping out of a café door']],
    'In transit':[['s','in a train seat by the window'],['s','at a quiet airport gate'],['so','in an airport lounge armchair'],['h','at a counter in a station café'],['s','at a train table seat'],['s','in a ferry lounge seat by the window'],['w','through a bright airport concourse'],['s','in a quiet carriage on a high-speed train']],
    'Coworking':[['s','at a long communal table in a coworking space'],['h','at a tall table by the coworking coffee bar'],['so','on a lounge sofa in a coworking space'],['s','in a glass phone booth in a coworking space'],['pe','on a stool by the coworking window'],['st','at a standing bar along the coworking window'],['w','across a coworking floor'],['pr','in a small coworking meeting room, at a wall-mounted screen'],['s','in a quiet corner pod in a coworking space']],
    'Hotel':[['s','at the desk in a hotel room'],['so','in a hotel lobby armchair'],['h','at a tall table in a hotel lobby'],['s','at a table in a hotel café'],['le','on the window seat of a hotel room'],['w','through a hotel lobby'],['pr','in a hotel conference room, at a wall-mounted screen']]
  };
  var POSES={
    s:['sitting back in the chair, one arm loose over the backrest','leaning in, elbows on the table','turned a little in the chair toward the window','one leg crossed over the other, the laptop square in front of them','sitting forward, both hands on the keyboard','half turned toward someone just out of frame, one hand on the trackpad','settled back, reaching for a cup without looking','sitting sideways on the chair, one arm over the back'],
    st:['standing, one hip against the counter','standing, weight on one leg, a hand on the laptop','standing over the laptop, leaning on both palms','standing, reaching across to the trackpad mid-thought','standing, half turned toward someone just out of frame'],
    pe:['perched, one foot on the floor','perched, the laptop balanced on one knee','perched, arms loosely folded, eyes on the screen','perched, leaning back on one hand'],
    le:['leaning on the ledge, the laptop open beside them','sitting on the ledge, knees up, the laptop resting on them','leaning a shoulder on the window frame, the laptop on one forearm','half sitting on the ledge, one foot on the floor'],
    so:['cross-legged, the laptop on their knees','curled into the corner, the laptop on a cushion','feet up on the coffee table, the laptop on their lap','sitting forward on the edge of the cushion','stretched out, one arm along the back'],
    w:['mid-stride, the laptop under one arm','walking with the laptop open on one forearm, eyes on the last slide','slowing at the door, glancing at the laptop one last time','walking side by side with a colleague','turning back mid-stride to answer someone'],
    pr:['standing at the head of the table, mid-sentence','stepping back from the screen to let the slide speak','standing, a clicker loose in one hand, turned toward the room','leaning on the table edge, answering a question','walking the length of the table as they talk','seated at the table, presenting from their chair, leaning in','standing behind a chair, both hands resting on its back, mid-point','pausing mid-sentence, letting the key line land','half turned to the screen, glancing back at the room','listening to a question, head tilted, about to answer','sketching the shape of the idea in the air, hands low','perched on the table corner, talking straight to the decision-maker'],
    h:['leaning on the tall table, the laptop between their hands','on a stool, one foot on the rung','standing at the tall table, a cup beside the laptop','leaning in over the table, mid-laugh']
  };
  var BODY=['shoulders relaxed, settled in their body','shoulders loose, breathing out','easy and unhurried, the tension gone','settled in, a hand resting on the laptop'];
  var BODY_PEAK=['weight forward, fully in it','energy high, voice carrying the room','grounded and sure, every gesture deliberate','animated and present, the room with them'];
  var BODY_BEFORE=['alert and leaning in','shoulders square, moving with purpose','energy gathering, ready to go','quick and light, a step ahead of the moment'];
  var MOMENT_TAIL=', caught mid-movement and unaware of the camera, just after the peak: the expression settling on its own, never a smile for the camera';
  /* the moment can sit just before, at or just after the peak; the peak is for presenting, before and after for everything else */
  var PHASE={
    before:{lead:'just before ',tail:', caught mid-movement and unaware of the camera, the momentum building: focused, sure and leaning into it, never a smile for the camera'},
    peak:{lead:'',tail:', caught at the peak, unaware of the camera: fully in it, mid-delivery and convincing, the energy at its height; never a pose for the camera'},
    after:{lead:'',tail:MOMENT_TAIL}};
  function phaseFor(tag){var opts=tag==='pr'?['before','peak','peak','after']:['before','after'];var p=keep('phase',function(){return one(opts)});if(opts.indexOf(p)<0){p=one(opts);R.phase=p}return p}
  var STOCK=' no hands on the chin or face, no posed smiles at the screen, no fist pumps, high fives, thumbs up, jumping or finger guns';

  /* ── casting (section 4) ── */
  var AGE_RANGE={'20s':[24,29],'30s':[31,39],'40s':[41,49],'50s':[51,59]};
  var PERSON={Female:'woman',Male:'man',Other:'person'};
  var ROLE={'Marketing':'in marketing','Sales':'in sales','Business development':'in business development','Consultants & analysts':'in consulting','Team leader':'who leads a team','C-suite':'C'};
  var CHIEF=['chief executive','chief financial officer','chief marketing officer','chief operating officer','chief revenue officer'];
  var HERITAGE={'Mixed heritage':'mixed-heritage'};
  var MARKS=[['freckles'],['a mole on the cheek'],['a small scar through one brow'],['crooked lower teeth'],['a chipped front tooth'],['faint acne scars'],['sun spots on the cheeks',40],['laugh lines',30],['a few grey strands',36],['salt-and-pepper stubble',38,'Male'],['a receding hairline',38,'Male'],['uneven single eyelids',0,null,['East Asian','Southeast Asian']]];
  var HAND_MARKS=['sun spots on the backs of the hands','a small scar on one knuckle','short, unpolished nails','visible veins on the backs of the hands'];
  var STYLING=['tortoiseshell glasses','gold-rimmed glasses','rimless glasses','bold, thick-framed glasses','a simple ring','stacked silver rings','a steel watch','small hoop earrings','a woven bracelet','reading glasses pushed up on the head','a knit beanie'];
  function styl(pool,n){var o=[],c=pickN(pool,pool.length);c.forEach(function(x){if(o.length<n&&!(/glasses/.test(x)&&o.some(function(y){return /glasses/.test(y)}))&&!(/watch/.test(x)&&o.some(function(y){return /watch/.test(y)})))o.push(x)});return o}
  var HAND_STYLING=['a simple ring','a steel watch','a woven bracelet','a leather-strap watch'];
  var ASSIST=['a hearing aid','a simple wooden walking cane with a clean, curved crook handle, hooked over the edge of the table','a wheelchair','a prosthetic hand'];
  function beanieOK(sel){return !sel._pr&&!/C-suite|Team leader/.test(sel.role||'')&&(/^Home/.test(sel.setting||'')||/20s|30s/.test(sel.age||''))}
  function ageOf(sel){var r=AGE_RANGE[sel.age]||[31,39];return keep('ageN',function(){return r[0]+Math.floor(Math.random()*(r[1]-r[0]+1))})}
  function who(sel){var age=ageOf(sel),h=HERITAGE[sel.race]||sel.race,p=PERSON[sel.gender]||'person',b=(AD.BUILDS&&AD.BUILDS[sel.build])||'an average build',r=ROLE[sel.role]||'in marketing';if(r==='C')r='who is the company\u2019s '+v('chief',keep('chief',function(){return one(CHIEF)}));
    return v('ageN',age+'-year-old')+' '+h+' '+p+' '+r+', with '+b}
  function marks(sel,hands){var age=ageOf(sel);if(hands)return keep('marks',function(){return pickN(HAND_MARKS,2)});
    return keep('marks',function(){var ok=MARKS.filter(function(m){return age>=(m[1]||0)&&(!m[2]||m[2]===sel.gender)&&(!m[3]||m[3].indexOf(sel.race)>-1)}).map(function(m){return m[0]});return pickN(ok,2)})}
  function castLine(sel,hands){var m=marks(sel,hands),st=keep('styling',function(){return styl(hands?HAND_STYLING:(beanieOK(sel)?STYLING:STYLING.filter(function(x){return x!=='a knit beanie'})),Math.random()<0.5?1:2)}),as=keep('assist',function(){return Math.random()<(hands?1/30:1/15)?one(hands?['a prosthetic hand']:ASSIST):''});
    return 'Cast: a real person, never a model; '+v('marks',m.join(', '))+'; '+v('styling',st.join(' and '))+(as?'; '+v('assist',as)+', shown as part of their day':'')}

  /* ── wardrobe color (section 5) ── */
  /* each hue carries the warm, natural colors that pair with it for the rest of the outfit */
  var PAIRS={a:['cream','camel','khaki','charcoal','oatmeal'],n:['cream','camel','white','stone','tan'],r:['oatmeal','warm grey','olive','cream','camel'],m:['denim blue','cream','olive','stone','charcoal']};
  var RAMPS=[
    ['faded azure, like well-washed chambray','#5C9DBA','a',['chambray shirt','oxford-cloth shirt','crisp poplin shirt','fine-gauge knit polo']],
    ['deep azure denim, broken in','#2E5A6B','a',['denim jacket','wool crewneck','corduroy overshirt','unstructured wool-blend blazer']],
    ['soft greyed azure','#CCDEE6','a',['knit sweater','linen shirt','fine merino crewneck','washed-silk shirt']],
    ['darkest navy that reads near-black','#002533','n',['wool blazer','crewneck sweater','fine merino turtleneck','unstructured wool-blend blazer']],
    ['dusty raspberry wool','#8F4565','r',['wool blazer','knit sweater','fine merino crewneck','suede jacket']],
    ['muted magenta wine','#57293E','r',['ribbed knit sweater','velvet blazer','leather jacket','fine merino turtleneck']],
    ['soft greyed rose','#E4CDD7','r',['linen shirt','silk shirt','fine-gauge knit polo']],
    ['washed ochre','#A9733C','m',['canvas jacket','suede jacket','fine merino turtleneck']],
    ['dusty azure blue, softened','#7FB4CC','a',['fine merino crewneck','poplin shirt','knit cardigan']],
    ['deep, inky azure','#1D5670','a',['wool blazer','fine merino turtleneck','suede jacket']],
    ['muted brand magenta, dusty and deep','#9C3E68','r',['fine merino crewneck','washed-silk shirt','wool-blend overshirt']],
    ['soft greyed magenta-pink','#C890AA','r',['knit cardigan','poplin shirt','fine-gauge knit polo']]
  ];
  function wardrobeLine(sel,sleeve){var r=keep('ramp',function(){return one(RAMPS)}),gs=r[3];if(r[2]==='r'&&sel.gender==='Male'){var nj=gs.filter(function(x){return !/blazer|jacket|overshirt/.test(x)});if(nj.length)gs=nj}var g=keep('garment',function(){return one(gs)});if(gs.indexOf(g)<0){g=one(gs);R.garment=g}var pr=keep('pair',function(){return pickN(PAIRS[r[2]],2)});if(pr.some(function(x){return PAIRS[r[2]].indexOf(x)<0})){pr=pickN(PAIRS[r[2]],2);R.pair=pr}
    var what=sleeve?'the sleeve of a '+g:'a '+g;
    return 'Wardrobe: '+v('garment',what)+' in '+v('ramp',r[0]+' ('+r[1]+')')+', the same hue as our brand color, worn the way real clothes are: sophisticated but lived in, its material shown with true fidelity (the knit of merino, the nap of suede, the weave of wool, the soft sheen of silk); the color belongs in this room and in a workplace, never vivid, uniform or costume-like; it stands out from the light rather than matching it; the rest of the outfit in '+v('pair',pr.join(' and '))+', colors that pair well with it, never another bright color; '+v('sil',silFor(sel))+'; contemporary workwear that fits who they are, never sloppy, athletic or logoed'}
  /* silhouettes span the workplace: tailored to oversized; oversized is for the fashion-forward, mostly 20s and 30s */
  function silFor(sel){var young=/20s|30s/.test(sel.age||''),opts=young?['tailored and well fitted','a relaxed, easy fit','an oversized, fashion-forward silhouette with a clean drape']:['tailored and well fitted','tailored and well fitted','a relaxed, easy fit'];var s=keep('sil',function(){return one(opts)});if(opts.indexOf(s)<0){s=one(opts);R.sil=s}return s}

  /* ── light (section 2) ── */
  var TYPE_LINE={Sun:'hard-edged patches of sun across the table, floor and hands',Soft:'soft, even window light with one warm patch of sun near the hands; a little warm bounce lifts the face',Backlit:'a window glows behind them and rims their hair and shoulders without blowing out; a little warm bounce lifts the face'};
  function lightType(sel,row){var want=sel.light&&sel.light!=='Mixed'?sel.light:null;if(want)return want;return keep('ltype',function(){return one(row.types)})}
  function lightLine(sel,row,opt){opt=opt||{};var t=lightType(sel,row),face=opt.hands?'the hands are the brightest skin in the frame':'the face is the brightest skin in the frame';
    var s='Light: '+v('time',row.light)+' lands on the person and on what they’re working on ('+(opt.what||'hands, laptop, the person they’re talking to')+'); '+face+'; the room falls a stop darker around them, never gloomy; warm where the sun or a lamp lands, neutral everywhere else, never an orange or golden cast; '+v('ltype',row.dim&&t==='Sun'?'warm pools of lamplight across the table and hands, the windows cool':opt.hands&&t==='Backlit'?'a window glows behind and rims the hands and the edge of the laptop without blowing out':TYPE_LINE[t]);
    if(row.dim)s+='; the screen adds only a faint, neutral fill on the hands or chin, never tinted, never the main light on the face';
    return s+'; never the sun disc in frame, haze beams or a spotlight on a black background'}

  /* ── choosing a time that fits the setting and light chips, then a place and a pose ── */
  function rowFor(sel,desk){var st=sel.setting||'Office',pl0=PLACES[st]||PLACES.Office;
    function placesFor(r){return pl0.filter(function(x){return r.tags.indexOf(x[0])>-1&&(!desk||!/^(w|pr)$/.test(x[0]))})}
    var fits=TIMES.filter(function(r){return r.sets.indexOf(st)>-1&&placesFor(r).length});if(!fits.length)fits=TIMES.filter(function(r){return placesFor(r).length});if(!fits.length)fits=TIMES.slice();
    if(sel.light&&sel.light!=='Mixed'){var m=fits.filter(function(r){return r.types.indexOf(sel.light)>-1});if(m.length)fits=m}
    if(sel.shot==='Two-shot'){var c=fits.filter(function(r){return !r.screen});if(c.length)fits=c}
    var k=keep('time',function(){return one(fits).k}),row=TIMES.filter(function(r){return r.k===k})[0];
    if(fits.indexOf(row)<0){row=one(fits);R.time=row.k}
    var places=placesFor(row);if(!places.length)places=pl0.filter(function(x){return !/^(w|pr)$/.test(x[0])});
    var pk=keep('place',function(){return one(places)[1]}),pl=places.filter(function(x){return x[1]===pk})[0];if(!pl){pl=one(places);R.place=pl[1]}
    var poses=POSES[pl[0]],pose=keep('pose',function(){return one(poses)});if(poses.indexOf(pose)<0){pose=one(poses);R.pose=pose}
    var rw=RWINS[sel.role]||[],win=keep('win',function(){return rw.length&&Math.random()<0.4?one(rw):one(row.wins)});if(row.wins.indexOf(win)<0&&rw.indexOf(win)<0){win=one(row.wins);R.win=win}
    var place=pl[1]+(row.act&&!/^(w|pr)$/.test(pl[0])?', '+row.act:'');
    return {row:row,place:place,pose:pose,tag:pl[0],win:win}}

  /* ── frames (sections 6 and 9) ── */
  var LENS={'Close-up':'85mm, close on the face and shoulders','Medium shot':'50mm, waist-up','Two-shot':'50mm, waist-up, the 2 of them together, the light favoring the professional','Wide shot':'35mm, the whole person and the room around them'};
  var GRAND='from a slight low angle, looking up a little, giving them quiet stature and a sense of grandness';
  var ANGLES=['from eye level',GRAND,'over a colleague\u2019s shoulder','through a soft, out-of-focus foreground object such as a glass or a plant','at arm\u2019s length, a blurred shoulder or laptop edge soft in the foreground','from a high angle, looking down into the moment','in a tight crop that cuts through a shoulder, the camera right inside the moment','low at table height, the laptop edge soft in the foreground'];
  var WALK_CLOSE='85mm, close on the face and shoulders, moving alongside them as they walk';
  var MOTION='; natural, subtle motion: only a slight blur in the hand swinging mid-stride or a lifting strand of hair; the face sharp; the person and the room share the same light and focus falloff, never a streaked background or a cut-out, composited look';
  var IMMERSED='; immersed and intimate: the camera is inside the moment, close enough to reach out and shake their hand';
  var KINETIC='immersed and intimate: the camera inside the moment, close enough to reach out and shake their hand';
  /* presenting rooms get their own camera positions, each one complete on its own */
  var PR_CAM=['from behind the seated room, the backs of 2 colleagues soft in the foreground','from a high back corner, looking down the length of the table at them','from low near the end of the table, looking up a little, giving them stature and a sense of grandness','from beside the table at seated height, '+KINETIC,'from eye level across the table, between two colleagues’ shoulders'];
  function angle(sel,row,tag){var a=ANGLES.concat([KINETIC,KINETIC]);if(sel.shot!=='Two-shot'&&!row.company)a.splice(2,1);if(sel.style==='Portrait')a=[ANGLES[0],GRAND];if(tag==='w'&&sel.shot==='Close-up')a=[ANGLES[0],GRAND];if(sel.shot==='Wide shot')a=a.filter(function(x){return x!==KINETIC&&!/tight crop/.test(x)});if(tag==='pr')a=PR_CAM;var g=keep('angle',function(){return one(a)});if(a.indexOf(g)<0){g=one(a);R.angle=g}return g}
  function copyBit(sel){return sel.copy&&sel.copy!=='None'?'; clear, empty space on one side for a headline':''}

  /* ── A pro ── */
  /* portrait: at ease and confident; a device can rest in the lap or hand, never in use */
  var PPOSE={
    sit:['sitting back at ease, one arm resting on the table','forearms loosely on the table, hands relaxed together','seated sideways to the table, an elbow over the back of the chair','one hand loosely around a drink','the laptop closed on their lap, a hand resting on it','a phone held loosely in one hand on their lap, screen away, not in use'],
    stand:['leaning against the table edge, hands resting at their sides','standing easy, a closed laptop held loosely at their side','standing, a tablet held loosely against them, not in use','leaning a shoulder on the wall, arms loosely folded']};
  var PBEFORE=['just before they sit down to build the presentation that has to land','just before they walk on stage','just before they face the room','just before the video call that matters begins'];
  var PAFTER=['right after the presentation goes well','right after they finish the perfect slide','right after the room says yes'];
  var PFEEL=['quiet satisfaction','pride','excitement','determination','dedication and commitment','openness, ready to collaborate'];
  function portraitMoment(f){var ph=keep('phase',function(){return one(['before','after'])});if(ph==='peak'){ph='after';R.phase=ph}
    var m=keep('pm',function(){return ph==='before'?one(PBEFORE):(Math.random()<0.5?'right after '+f.win:one(PAFTER))});
    var feel=keep('pfeel',function(){return one(PFEEL)});
    return 'Moment: '+v('pm',m)+'; the feeling is '+v('pfeel',feel)+'; at ease in their own space, nothing in their hands is working; the setting tells their professional story, not the pose; no typing, pointing or holding the laptop open toward us, no hands on the chin or face'}
  var DETAILS=['a hand resting on the closed laptop, a drink beside it','fingers lifting off the trackpad after the last click','a hand easing the laptop lid down, a drink beside it','both hands loose on the keyboard, the work done'];
  function pro(sel){
    if(sel.style==='Video call')return videoCall(sel);
    var style=sel.style||'Candid',f=rowFor(sel,style==='Portrait'||style==='Detail'),row=f.row,L=[];
    if(style==='Portrait'){var pp=/^(st|le)$/.test(f.tag)?PPOSE.stand:PPOSE.sit,pq=keep('ppose',function(){return one(pp)});if(pp.indexOf(pq)<0){pq=one(pp);R.ppose=pq}f.pose=v('ppose',pq)}
    if(style==='Detail'){
      var d=keep('detail',function(){return one(DETAILS)}),open=!/closed|lid down/.test(d);
      L.push('Photo: an editorial detail photograph of a professional’s hands just after a little win at work, the light landing on the hands and the laptop; candid, settled-in and quietly successful, buoyed by optimism; a real, unretouched moment');
      L.push('Subject: the hands of a '+who(sel)+', '+v('place',f.place)+', at '+v('time',row.time)+'; no face in frame');
      L.push('Moment: '+v('detail',d)+', right after '+v('win',f.win)+'; the hands settling, the work done;'+STOCK);
      L.push(lightLine(sel,row,{hands:true,what:'hands and laptop'}));
      L.push('Frame: '+v('lens',sel.shot==='Close-up'?'85mm, close on the hands':'50mm, the hands and the laptop')+', '+v('angle',keep('angleD',function(){return one(['from just above the table edge','from eye level across the table','at a low angle along the tabletop'])}))+(open?'; the laptop’s keyboard and trackpad fill the lower half of the frame':'; the closed laptop fills the lower half of the frame')+copyBit(sel));
      L.push(wardrobeLine(sel,true));
      L.push(castLine(sel,true));L.push(SKIN_H);
      L.push(open?'Screen: the laptop screen faces away from the camera or sits out of frame':'Screen: the laptop is closed');
      return L;
    }
    var portrait=style==='Portrait',solo=sel.shot!=='Two-shot'&&!row.company,fl=sel.float&&sel.float!=='No';
    L.push(portrait?'Photo: an editorial portrait of a professional in their element, the light landing on them; comfortably confident and quietly successful, buoyed by optimism; a real, unretouched moment':'Photo: a candid editorial photograph of a professional’s little win at work, the light landing on them and their idea; candid, settled-in, in flow and quietly successful, buoyed by optimism; a real, unretouched moment');
    var place=f.place;if(!solo&&!/colleague/.test(place+f.pose))place+=', a colleague beside them, mid-reaction and unposed';if(solo&&sel.shot==='Wide shot'&&keep('group',function(){return Math.random()<0.4})&&!/^(w|pr)$/.test(f.tag))place+=', 2 colleagues working around them';if(f.tag==='pr'&&!/colleagues/.test(place))place+=', colleagues seated around the table';
    L.push('Subject: a '+who(sel)+', '+v('place',place)+', '+(portrait?f.pose:v('pose',f.pose))+', at '+v('time',row.time));
    var body=keep('body',function(){return one(BODY)});
    if(portrait)L.push(portraitMoment(f));
    else{var ph=phaseFor(f.tag);if(ph==='peak'){body=keep('bodyP',function(){return one(BODY_PEAK)});L.push('Moment: '+PHASE[ph].lead+v('win',f.win)+PHASE[ph].tail+'; '+v('bodyP',body)+';'+STOCK)}else if(ph==='before'){body=keep('bodyB',function(){return one(BODY_BEFORE)});L.push('Moment: '+PHASE[ph].lead+v('win',f.win)+PHASE[ph].tail+'; '+v('bodyB',body)+';'+STOCK)}else L.push('Moment: '+PHASE[ph].lead+v('win',f.win)+PHASE[ph].tail+'; '+v('body',body)+';'+STOCK)}
    L.push(portrait?'Gaze: into the lens, settled and comfortably confident, an easy half-smile or a calm, steady look, as if a friend just asked how it’s going; never a posed grin':'Gaze: on the work or the person they’re talking to, never at the lens');
    L.push(lightLine(sel,row));
    var lens=portrait?(sel.shot==='Wide shot'?'50mm, waist-up, with the room around them':sel.shot==='Medium shot'?'85mm, chest-up':'85mm, close on the face and shoulders'):LENS[sel.shot]||LENS['Medium shot'];
    if(f.tag==='w'&&sel.shot==='Close-up')lens=WALK_CLOSE;else if(f.tag==='w'&&!/35mm|50mm/.test(lens))lens='50mm, waist-up';
    var fr='Frame: '+v('lens',lens)+', '+v('angle',angle(sel,row,f.tag))+(f.tag==='w'?MOTION:'');
    if(fl)fr+='; frame it wide, with open, uncluttered air around them, above each shoulder and beside the laptop, for blank floating slides added in post';
    L.push(fr+copyBit(sel));
    L.push(wardrobeLine(sel));
    L.push(castLine(f.tag==='pr'?Object.assign({},sel,{_pr:true}):sel));L.push(SKIN);
    L.push(HAIR);
    L.push(f.tag==='pr'?SCREEN_BLANK('the wall-mounted screen'):portrait?'Screen: no screen faces the camera; any laptop, tablet or phone is closed, set aside or resting, never in use':'Screen: the laptop screen faces away from the camera');
    if(sel.prop==='Prop'){var pr=keep('prop',function(){return one(PROPS)});L.splice(L.length-1,0,'Prop: '+v('prop',pr)+', the only object besides the laptop')}
    else L.splice(L.length-1,0,portrait?'Prop: nothing beyond the laptop, tablet, phone or cup the pose names':'Prop: none; only the laptop');
    return L;
  }
  function videoCall(sel){
    if(!('time' in R))R.time=one(['2:00','2:00','2:00','9:00','4:45','6:15']);
    var f=rowFor(sel,true),row=f.row,L=[];
    L.push('Photo: a candid editorial photograph from the point of view of their laptop\u2019s webcam: a professional on a video call, in a little win, the light landing on them; close and intimate, buoyed by optimism; a real, unretouched moment');
    L.push('Subject: a '+who(sel)+', '+v('place',f.place.replace(/, on a video call$/,''))+', on a video call, at '+v('time',row.time));
    /* each pose: [what they do, where they look, talk or listen]; listening poses never land on the peak */
    var VCP=[
      ['one hand mid-gesture, low and loose','into the lens, mid-sentence','t'],
      ['leaning in toward the camera, mid-sentence','into the lens, earnest and direct','t'],
      ['sitting back, laughing at something someone on the call just said','just off the lens, toward a face on the screen, still laughing','l'],
      ['presenting their shared slides, eyes flicking between the lens and the screen','down at their screen for a beat, about to look back up','t'],
      ['pausing to let the point land, eyebrows raised, hands still','into the lens, waiting for the reaction','l'],
      ['counting the next three steps on their fingers, mid-explanation','into the lens, mid-sentence','t'],
      ['sitting forward, elbows on the desk, answering a tough question','into the lens, steady and sure','t'],
      ['nodding slowly as the client talks, about to come back in','into the lens, listening closely','l'],
      ['sitting back, one hand around '+'a drink'+', listening','into the lens, relaxed and listening','l'],
      ['one elbow on the desk, chin clear of the hand, taking it in','into the lens, thoughtful','l'],
      ['leaning toward the lens to hear the question','into the lens, attentive','l'],
      ['tilting the laptop screen as the call begins, a quick smile','just below the lens, at the faces arriving on screen','l'],
      ['a slow half-smile as the decision comes in','into the lens, quietly pleased','l'],
      ['hands resting on the desk, letting the client finish','into the lens, patient and present','l']];
    var VCG=VCP.map(function(x){return x[0]});
    var VCW=['the client asks to see that slide again','the pitch on the call wins the room','the toughest question on the call gets the best answer','the decision-maker unmutes to say yes','every face on the call is nodding','the room on the other end leans in'];
    var g=keep('vcg',function(){return one(VCG)});if(VCG.indexOf(g)<0){g=one(VCG);R.vcg=g}
    var vw=keep('vcw',function(){return Math.random()<0.5?one(VCW):''}),win=vw||f.win;
    var gp=VCP[VCG.indexOf(g)],vopt=gp[2]==='t'?['before','peak','peak','after']:['before','after'],vph=keep('vcph',function(){return one(vopt)});if(vopt.indexOf(vph)<0){vph=one(vopt);R.vcph=vph}var VT=PHASE[vph];
    L.push('Moment: '+VT.lead+v(vw?'vcw':'win',win)+VT.tail+'; '+v('vcg',g)+';'+STOCK+', no both hands raised toward the camera');
    L.push('Gaze: '+gp[1]+', as if into the faces on the call'+(gp[2]==='l'?'; warm and open, a hint of a smile, clearly on their side; never skeptical, bored, stern or impatient':'')+'; never posed');
    L.push(lightLine(sel,row,{what:'face and hands'}));
    L.push('Frame: '+v('lens',keep('vcLens',function(){return one(['35mm from the laptop\u2019s webcam, just below eye level','35mm from the laptop\u2019s webcam, a touch low, looking up a little, giving them quiet stature'])}))+'; the soft top edge of the laptop screen in the lower frame'+copyBit(sel));
    var hp=keep('vcHead',function(){return Math.random()<1/10});
    L.push(wardrobeLine(sel));L.push(castLine(sel)+(hp?'; slim wireless headphones on, quiet and secondary':''));L.push(SKIN);L.push(HAIR);
    if(sel.prop==='Prop'){var pr=keep('prop',function(){return one(PROPS)});L.push('Prop: '+v('prop',pr)+', the only object besides the laptop')}else L.push('Prop: none; only the laptop');
    L.push('Screen: the camera is the laptop; no screen faces the camera');
    return L;
  }
  var CUPS=['a matte black stoneware mug','a speckled handmade ceramic mug','a clear double-walled glass of tea','a brushed-steel insulated tumbler','a slim thermos-style travel cup','a small espresso cup on its saucer','a plain white diner-style mug','a squat glazed mug in a deep blue','a tall, minimal porcelain cup','a café cortado in a small glass','a plain takeaway cup with a lid, no logo','a short enamel camp mug'];
  function cup(){return keep('cup',function(){return one(CUPS)})}
  var PROPS=['a drink','a glass of water','folded reading glasses','a small potted plant','a set of keys'];

  /* ── brand graphic space (section 8) ── */
  var GFX_LIGHT={Side:'a soft clear azure blue glow (#00B9FF) from the left and a soft rose pink glow (#DB2475) from the right',Halo:'a soft azure and rose glow behind the panel, so it reads as lit from behind',Corner:'a soft azure glow rising from the bottom-left corner and a soft rose glow from the top-right corner, the panel floating in the dark between them'};
  function gfx(sel,kind){
    var light=keep('gfxL',function(){return one(['Side','Halo','Corner'])}),dark=sel.ground==='Dark';
    var subj=kind==='editor'?'one blank editor window (16:10)':keep('gfxN',function(){return one(['one blank slide (16:9)','several blank slides (16:9) on one single flat plane, in a loose grid, receding together in perspective'])});
    return ['Image: a minimal 3D product render, as if made in Cinema 4D with Redshift or Octane, not a photograph: one hero panel on a seamless studio ground, matte surfaces, soft studio lighting, a soft contact shadow, generous empty space; calm and premium, like a high-end, enterprise-grade tech product launch',
      'Subject: '+v('gfxN',subj)+', floating at a gentle angle, with open space around it for interface callouts added later'+copyBit(sel),
      'Panels: thin, softly rounded corners, a slight edge thickness catching the light; completely blank: a flat, even white surface, all 4 corners of the hero panel visible, nothing overlapping it, no interface, icons or text, ready for real '+(kind==='editor'?'UI':'slides')+' in post',
      'Focus: the hero panel is sharp; panels farther along the plane soften with natural depth of field, never motion-smeared',
      'Ground: '+v('S:ground',dark?'an even deep Base Blue (#002533) space':'an even Gallery Grey (#F0F3F5) space with a soft floor reflection'),
      'Light: '+v('gfxL',GFX_LIGHT[light])+', kept apart, never blended into a purple or lavender wash; the panel is the brightest thing in the frame, white at its top edge softening to light grey; soft shadow beneath the panels',
      'Finish: subtle matte surfaces, fine grain; calm, restrained and premium',
      'Never include: readable text, numbers, logos, purple gradients, glowing orbs, chromatic fringing, motion blur, lens flare, neon, glossy plastic; no paper, printed pages, printed slides, notebooks, sketches or outlines'];
  }

  /* ── Our product ── */
  function product(sel){
    var mode=sel.pshot||'Over the shoulder';if(mode==='Brand graphic space')return gfx(sel,'editor');
    var f=rowFor(sel,true),row=f.row,L=[],dev=keep('device',function(){return mode==='Screen close-up'?one(['laptop','laptop','tablet']):'laptop'});
    L.push('Photo: a candid editorial photograph of our product at work: a professional’s '+v('device',dev)+' in a real working moment, the light landing on their hands and the screen; settled-in and quietly successful, buoyed by optimism; a real, unretouched moment');
    var frame,subj;
    if(mode==='Screen close-up'){subj='the hands of a '+who(sel)+', on the '+dev+', '+f.place;frame='50mm, close on the screen and hands, '+v('pAng',keep('pAng',function(){return one(['light raking across them','from just below the table edge, looking up a little at the screen, giving the product stature'])}))+(dev==='laptop'?'; the laptop’s keyboard and trackpad fill the lower half of the frame':'; the tablet fills the lower half of the frame')}
    else if(mode==='Point of view'){subj='a '+who(sel)+', seen through their own eyes, '+f.place;frame='35mm point of view, looking down past their hands to the laptop; the keyboard and trackpad fill the lower half of the frame'}
    else {subj='a '+who(sel)+', seen from behind, '+f.place;frame='50mm over the shoulder'+v('pAng',keep('pAngO',function(){return one(['',', from a little below the shoulder, looking up past it'])}))+': the back of their head and shoulder soft in the near foreground, the screen facing the camera in the middle of the frame'}
    L.push('Subject: '+v('place',subj)+', at '+v('time',row.time));
    L.push('Moment: the last piece of the work just came together, caught just after the peak: the hands easing off the keyboard;'+STOCK);
    L.push(lightLine(sel,row,{hands:mode!=='Over the shoulder',what:'hands and the '+dev}));
    L.push('Frame: '+v('lens',frame)+copyBit(sel));
    L.push(wardrobeLine(sel,mode!=='Over the shoulder'));
    L.push(castLine(sel,mode!=='Over the shoulder'));L.push(mode==='Over the shoulder'?SKIN:SKIN_H);
    if(mode==='Over the shoulder')L.push(HAIR);
    L.push(SCREEN_BLANK('the '+dev+' screen'));
    return L;
  }

  /* ── Our slides ── */
  function randomSel(){return keep('slideCast',function(){return {age:one(['30s','40s','50s']),gender:one(['Female','Male']),race:one(AD.RACES),build:one(Object.keys(AD.BUILDS)),role:one(Object.keys(ROLE))}})}
  function slides(sel){
    var mode=sel.layout||'Meeting room';if(mode==='Brand graphic space')return gfx(sel,'slides');
    var L=[],p=randomSel();
    if(mode==='Meeting room'){
      L.push('Photo: a candid editorial photograph of a meeting room just before a presentation, the room ready and calm, buoyed by optimism; a real, unretouched moment');
      L.push('Subject: an empty meeting room, chairs pulled in, a laptop open at the head of the table, the '+v('scr',keep('scr',function(){return one(['wall-mounted TV','projector screen'])}))+' on and waiting');
      L.push('Light: clear morning window light runs down the table and lands on the screen wall; the room falls a stop darker around it, never gloomy; true-to-life color, never an orange or golden cast; never the sun disc in frame, haze beams or god rays');
      L.push('Frame: 35mm, '+v('mrCam',keep('mrCam',function(){return one(['from the far end of the table at seated eye level','from low at the far end of the table, looking up a little, giving the room and the screen a sense of grandness','from a high corner, looking down the length of the table'])}))+', the screen in the upper third'+copyBit(sel));
      L.push(SCREEN_BLANK('the '+R.scr));
    }else if(mode==='Stage'){
      L.push('Photo: a candid editorial photograph of a professional presenting on a stage, the room leaning in; settled-in and quietly successful, buoyed by optimism; a real, unretouched moment');
      L.push('Subject: a '+who(p)+', presenting at the side of a stage beside a large projection screen');
      var sph=phaseFor('pr'),sw=keep('stageWin',function(){return one(['they win the room','the room leans in','the room goes quiet on the key slide','the big idea lands with the whole room'])});
      L.push('Moment: '+PHASE[sph].lead+v('stageWin',sw)+PHASE[sph].tail+'; '+v('stPose',keep('stPose',function(){return sph==='before'?one(['stepping out onto the stage','walking to the center of the stage, finding the first line','pausing at the edge of the stage, taking in the room']):one(['mid-sentence to the room, hands low and natural, the screen behind them, never gestured at','walking the stage as they talk','stopped center stage, letting the key line land','turned toward one side of the audience, answering a question','one hand at chest height, shaping the idea'])}))+';'+STOCK);
      L.push('Light: clean, neutral stage light lands on the presenter and the screen; the audience falls a stop darker, never gloomy; true-to-life color, never an orange or golden cast; never haze beams, god rays or a spotlight on a black background');
      L.push('Frame: '+v('stCam',keep('stCam',function(){return one(['35mm, from mid-audience, the soft backs of the audience out of focus in the foreground','35mm, from low in the front row, looking up a little at them, giving them stature and a sense of grandness','50mm, from the side of the stage, the audience soft beyond them','35mm, from the back of the room, the full stage and screen ahead'])}))+copyBit(sel));
      L.push(wardrobeLine(p));L.push(castLine(Object.assign({},p,{_pr:true})));L.push(SKIN);L.push(HAIR);
      L.push(SCREEN_BLANK('the projection screen'));
    }else{
      var dev=keep('device',function(){return one(['laptop','tablet'])});
      L.push('Photo: a candid editorial photograph of a professional sharing their slides with a colleague across a table, the light landing on them and their idea; settled-in, in flow and quietly successful, buoyed by optimism; a real, unretouched moment');
      L.push('Subject: a '+who(p)+', turning a '+v('device',dev)+' toward a colleague across a table');
      L.push('Moment: the idea lands with the colleague'+MOMENT_TAIL+';'+STOCK);
      L.push('Gaze: on the colleague, never at the lens');
      L.push('Light: soft window light lands on the two of them and the '+dev+'; the faces are the brightest skin in the frame; the room falls a stop darker, never gloomy; true-to-life color, never an orange or golden cast; never the sun disc in frame or haze beams');
      L.push('Frame: 50mm, from beside the colleague’s shoulder, the '+dev+' angled so its screen faces the camera'+copyBit(sel));
      L.push(wardrobeLine(p));L.push(castLine(p));L.push(SKIN);L.push(HAIR);
      L.push(SCREEN_BLANK('the '+dev+' screen'));
    }
    return L;
  }

  /* ── public API ── */
  function build(facet,sel){LV=[];LVK={};
    var L=facet==='Product'?product(sel):facet==='Presentation'?slides(sel):pro(sel);
    var gfxM=(facet==='Product'&&sel.pshot==='Brand graphic space')||(facet==='Presentation'&&sel.layout==='Brand graphic space');
    if(!gfxM){var c=cup();L=L.map(function(l){return l.replace(/\ba drink\b/g,c)});
      if(!L.some(function(l){return l.indexOf(c)>-1})){var i=L.findIndex(function(l){return /^Screen:/.test(l)});L.splice(i<0?L.length:i,0,'Cup: if a drink is in frame, it is '+v('cup',c)+'; at most 1')}}
    var gfxMode=(facet==='Product'&&sel.pshot==='Brand graphic space')||(facet==='Presentation'&&sel.layout==='Brand graphic space');
    if(!gfxMode){L.push(LOOK,facet==='Professional'&&sel.style==='Portrait'?NEVER.replace('no phone in a hand','no phone held up or in use'):NEVER,AVOID)}
    return L.join('\n')}
  AD.build=build;
  AD.hold=function(){R={}};AD.reroll=function(){R={}};
  AD.snap=function(){return JSON.parse(JSON.stringify(R))};AD.restore=function(s){R=JSON.parse(JSON.stringify(s||{}))};
  AD.lastVars=function(){return LV.slice()};AD.varKey=function(t){return LVK[t]};
  AD.unset=function(k){delete R[k];if(k==='ramp')delete R.garment;if(k==='time'){delete R.place;delete R.pose;delete R.win}if(k==='place')delete R.pose};
  AD.PSHOTS={'Screen close-up':1,'Over the shoulder':1,'Point of view':1,'Brand graphic space':1};
  AD.LAYOUTS={'Meeting room':1,'Stage':1,'Across the table':1,'Brand graphic space':1};
  AD.GROUNDS={'Light':1,'Dark':1};
  AD.ROLES={'Marketing':1,'Sales':1,'Business development':1,'Consultants & analysts':1,'Team leader':1,'C-suite':1};
  AD.SETTINGS={};ALL.forEach(function(k){AD.SETTINGS[k]=1});
  AD.V3=true;
})();

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
  var LOOK='Look: warm editorial grade, true skin tones, slightly lifted blacks, soft halation on bright edges, fine grain';
  var AVOID='Avoid: plastic or airbrushed skin, stock-photo posing, god rays, lens flare, halos, HDR, a teal-orange grade';
  var NEVER='Never include: readable text, words, numbers, logos or signage; no paper, printed pages, printed slides, notebooks, sketches or outlines; no phone in a hand';
  var HAIR='Hair: styled and groomed for a workday, neat and in place, with natural texture and a few fine strands at the hairline; never messy, windswept, frizzy or wet-looking, never helmet-stiff or plastic';
  var SCREEN_BLANK=function(dev){return 'Screen: '+dev+' is on and completely blank: a flat, even light grey rectangle inside its thin bezel, all 4 corners visible, nothing overlapping it, no interface, icons or text, ready for a screenshot in post'};

  /* ── times, situations and wins (section 3); each row lists the settings it fits and the light types it allows ── */
  var TIMES=[
    {k:'7:30',time:'7:30 a.m.',light:'cool early-morning daylight with warm patches of low sun',types:['Sun','Backlit','Soft'],win:'the first draft is done before the day starts',
      at:{Home:['standing at the kitchen counter, coffee beside the laptop'],'Home office':['standing at the kitchen counter before heading to the desk, coffee beside the laptop']},post:'standing'},
    {k:'9:00',time:'9:00 a.m.',light:'bright, clean morning light',types:['Sun','Soft','Backlit'],win:'a final tweak lands on the way in',
      at:{'Café':['at a café window table'],'In transit':['in a train seat by the window','at a quiet airport gate, laptop on their knees'],Office:['walking in through the office, laptop carried open in one hand']},post:'mixed'},
    {k:'10:55',time:'10:55 a.m.',light:'open window light',types:['Soft','Backlit'],win:'they walk in ready',
      at:{Office:['in the hallway outside a meeting room, laptop under one arm','at a meeting-room door, about to step in']},post:'standing'},
    {k:'11:30',time:'11:30 a.m.',light:'bright midday light',types:['Soft','Sun'],win:'the room leans in',
      at:{Office:['presenting at a wall-mounted screen in a meeting room, the backs of 2 colleagues soft in the foreground']},post:'presenting',screen:'the wall-mounted screen'},
    {k:'12:30',time:'12:30 p.m.',light:'hard midday sun',types:['Sun'],win:'the idea gets a laugh',
      at:{Office:['at a tall table with a colleague'],'Café':['at a tall café table with a colleague']},post:'high',company:true},
    {k:'2:00',time:'2:00 p.m.',light:'soft, even afternoon light',types:['Soft'],win:'the client on the call says "send me that"',
      at:{Office:['on a video call at their desk'],'Home office':['on a video call at their desk'],Home:['on a video call at the dining table']},post:'seated'},
    {k:'4:45',time:'4:45 p.m.',light:'low, warm late-afternoon sun',types:['Sun','Backlit','Soft'],win:'the deck is sent: the exhale',
      at:{Home:['cross-legged on the sofa'],'Home office':['leaning on a window ledge'],Office:['leaning on a window ledge in a quiet corner'],'Café':['sitting back in a café armchair by the window']},post:'easy'},
    {k:'6:15',time:'6:15 p.m.',light:'golden light turning to dusk',types:['Backlit','Sun','Soft'],win:"tomorrow's deck is done",
      at:{Office:['at a desk as the office empties out','perched on the edge of a desk as the office empties out'],'Home office':['at their desk as the house goes quiet']},post:'seated',dim:true}
  ];
  var BODY=['settled in their body, shoulders relaxed, a hand resting on the laptop','leaning back a little, shoulders loose','settled in, one arm loose over the chair back','weight easy on one hip, shoulders relaxed'];
  var BODY_FOR={standing:[3,0],mixed:[1,0],presenting:[3],high:[0,3],seated:[0,1,2],easy:[1,2,0]};
  var MOMENT_TAIL=', caught just after the peak: the smile settling, the nod finishing';
  var STOCK=' no fist pumps, high fives, thumbs up, jumping or finger guns';

  /* ── casting (section 4) ── */
  var AGE_RANGE={'20s':[24,29],'30s':[31,39],'40s':[41,49],'50s':[51,59]};
  var PERSON={Female:'woman',Male:'man',Other:'person'};
  var ROLE={'Marketing':'in marketing','Sales':'in sales','Business development':'in business development','Consultants & analysts':'in consulting'};
  var HERITAGE={'Mixed heritage':'mixed-heritage'};
  var MARKS=[['freckles'],['a mole on the cheek'],['a small scar through one brow'],['crooked lower teeth'],['a chipped front tooth'],['faint acne scars'],['sun spots on the cheeks',40],['laugh lines',30],['a few grey strands',36],['salt-and-pepper stubble',38,'Male'],['a receding hairline',38,'Male'],['uneven single eyelids',0,null,['East Asian','Southeast Asian']]];
  var HAND_MARKS=['sun spots on the backs of the hands','a small scar on one knuckle','short, unpolished nails','visible veins on the backs of the hands'];
  var STYLING=['tortoiseshell glasses','gold-rimmed glasses','rimless glasses','a simple ring','a steel watch','small hoop earrings','a woven bracelet','reading glasses pushed up on the head'];
  function styl(pool,n){var o=[],c=pickN(pool,pool.length);c.forEach(function(x){if(o.length<n&&!(/glasses/.test(x)&&o.some(function(y){return /glasses/.test(y)}))&&!(/watch/.test(x)&&o.some(function(y){return /watch/.test(y)})))o.push(x)});return o}
  var HAND_STYLING=['a simple ring','a steel watch','a woven bracelet','a leather-strap watch'];
  var ASSIST=['a hearing aid','a cane resting against the table','a wheelchair','a prosthetic hand'];
  function ageOf(sel){var r=AGE_RANGE[sel.age]||[31,39];return keep('ageN',function(){return r[0]+Math.floor(Math.random()*(r[1]-r[0]+1))})}
  function who(sel){var age=ageOf(sel),h=HERITAGE[sel.race]||sel.race,p=PERSON[sel.gender]||'person',b=(AD.BUILDS&&AD.BUILDS[sel.build])||'an average build',r=ROLE[sel.role]||'in marketing';
    return v('ageN',age+'-year-old')+' '+h+' '+p+' '+r+', with '+b}
  function marks(sel,hands){var age=ageOf(sel);if(hands)return keep('marks',function(){return pickN(HAND_MARKS,2)});
    return keep('marks',function(){var ok=MARKS.filter(function(m){return age>=(m[1]||0)&&(!m[2]||m[2]===sel.gender)&&(!m[3]||m[3].indexOf(sel.race)>-1)}).map(function(m){return m[0]});return pickN(ok,2)})}
  function castLine(sel,hands){var m=marks(sel,hands),st=keep('styling',function(){return styl(hands?HAND_STYLING:STYLING,Math.random()<0.5?1:2)}),as=keep('assist',function(){return Math.random()<1/6?one(hands?['a prosthetic hand']:ASSIST):''});
    return 'Cast: a real person, never a model; '+v('marks',m.join(', '))+'; '+v('styling',st.join(' and '))+(as?'; '+v('assist',as)+', shown as part of their day':'')}

  /* ── wardrobe color (section 5) ── */
  var RAMPS=[
    ['faded azure, like well-washed chambray','#5C9DBA',['chambray shirt','oxford-cloth shirt','poplin shirt']],
    ['deep azure denim, broken in','#2E5A6B',['denim jacket','wool crewneck','corduroy overshirt']],
    ['soft greyed azure','#CCDEE6',['knit sweater','linen shirt']],
    ['darkest navy that reads near-black','#002533',['wool blazer','crewneck sweater']],
    ['dusty raspberry wool','#8F4565',['wool blazer','knit sweater']],
    ['muted magenta wine','#57293E',['ribbed knit sweater','velvet blazer','leather jacket']],
    ['soft greyed rose','#E4CDD7',['linen shirt','silk shirt']],
    ['garment-dyed marigold cotton, slightly faded','#D39A58',['cotton overshirt','cotton shirt']],
    ['washed ochre, like an old work shirt','#A9733C',['canvas jacket','suede jacket']],
    ['muted rust brown','#764E2D',['knit cardigan','corduroy jacket']]
  ];
  function wardrobeLine(sel,sleeve){var r=keep('ramp',function(){return one(RAMPS)}),g=keep('garment',function(){return one(r[2])});if(r[2].indexOf(g)<0){g=one(r[2]);R.garment=g}
    var what=sleeve?'the sleeve of a '+g:'a '+g;
    return 'Wardrobe: '+v('garment',what)+' in '+v('ramp',r[0]+' ('+r[1]+')')+', the same hue as our brand color but the way real clothes look after a few washes: softly faded, slightly uneven dye, a little lighter at the seams and creases, never vivid, uniform or costume-like; it stands out from the warm light rather than matching it; everything else neutral'}

  /* ── light (section 2) ── */
  var TYPE_LINE={Sun:'hard-edged patches of sun across the table, floor and hands',Soft:'soft, even window light with one warm patch of sun near the hands',Backlit:'a window glows behind them and rims their hair and shoulders without blowing out'};
  function lightType(sel,row){var want=sel.light&&sel.light!=='Mixed'?sel.light:null;if(want)return want;return keep('ltype',function(){return one(row.types)})}
  function lightLine(sel,row,opt){opt=opt||{};var t=lightType(sel,row),face=opt.hands?'the hands are the brightest skin in the frame':'the face is the brightest skin in the frame';
    var s='Light: '+v('time',row.light)+' lands on the person and on what they’re working on ('+(opt.what||'hands, laptop, the person they’re talking to')+'); '+face+'; the room falls a stop darker around them, warm, never gloomy; '+v('ltype',opt.hands&&t==='Backlit'?'a window glows behind and rims the hands and the edge of the laptop without blowing out':TYPE_LINE[t]);
    if(row.dim)s+='; the screen adds only a faint, neutral fill on the hands or chin, never tinted, never the main light on the face';
    return s+'; never the sun disc in frame, haze beams or a spotlight on a black background'}

  /* ── choosing a time row that fits the setting and the light chip ── */
  function rowFor(sel,desk){var st=sel.setting||'Office';
    var fits=TIMES.filter(function(r){return r.at[st]&&(!desk||!/standing|presenting|mixed/.test(r.post)||r.k==='7:30')});if(!fits.length)fits=TIMES.filter(function(r){return r.at[st]});if(!fits.length)fits=TIMES.filter(function(r){return r.at.Office});
    if(sel.light&&sel.light!=='Mixed'){var m=fits.filter(function(r){return r.types.indexOf(sel.light)>-1});if(m.length)fits=m}
    if(sel.shot==='Two-shot'){var c=fits.filter(function(r){return !r.screen});if(c.length)fits=c}
    var k=keep('time',function(){return one(fits).k}),row=TIMES.filter(function(r){return r.k===k})[0];
    if(fits.indexOf(row)<0){row=one(fits);R.time=row.k}
    var places=row.at[st]||row.at.Office||row.at[Object.keys(row.at)[0]];if(desk){var dp=places.filter(function(x){return !/walking|door|hallway|presenting/.test(x)});if(dp.length)places=dp}var pl=keep('place',function(){return one(places)});if(places.indexOf(pl)<0){pl=one(places);R.place=pl}
    return {row:row,place:pl}}

  /* ── frames (sections 6 and 9) ── */
  var LENS={'Close-up':'85mm, close on the face and shoulders','Medium shot':'50mm, waist-up','Two-shot':'50mm, waist-up, the 2 of them together, the light favoring the professional','Wide shot':'35mm, the whole person and the room around them'};
  var ANGLES=['from eye level','from slightly low','over a colleague’s shoulder','through a soft, out-of-focus foreground object such as a glass or a plant'];
  function angle(sel,row){var a=ANGLES.slice();if(sel.shot!=='Two-shot'&&!row.company)a.splice(2,1);if(sel.style==='Portrait')a=[ANGLES[0],ANGLES[1]];return keep('angle',function(){return one(a)})}
  function copyBit(sel){return sel.copy&&sel.copy!=='None'?'; clear, empty space on one side for a headline':''}

  /* ── A pro ── */
  var DETAILS=['a hand resting on the closed laptop, a coffee beside it','fingers lifting off the trackpad after the last click','a hand easing the laptop lid down, a coffee beside it','both hands loose on the keyboard, the work done'];
  function pro(sel){
    var style=sel.style||'Candid',f=rowFor(sel),row=f.row,L=[];
    if(style==='Detail'){
      var d=keep('detail',function(){return one(DETAILS)}),open=!/closed|lid down/.test(d);
      L.push('Photo: an editorial detail photograph of a professional’s hands just after a little win at work, the light landing on the hands and the laptop; candid, settled-in and quietly successful, buoyed by optimism; a real, unretouched moment');
      L.push('Subject: the hands of a '+who(sel)+', '+v('place',f.place)+', at '+v('time',row.time)+'; no face in frame');
      L.push('Moment: '+v('detail',d)+', right after '+v('time',row.win)+'; the hands settling, the work done;'+STOCK);
      L.push(lightLine(sel,row,{hands:true,what:'hands and laptop'}));
      L.push('Frame: '+v('lens',sel.shot==='Close-up'?'85mm, close on the hands':'50mm, the hands and the laptop')+', '+v('angle',keep('angleD',function(){return one(['from just above the table edge','from eye level across the table','at a low angle along the tabletop'])}))+(open?'; the laptop’s keyboard and trackpad fill the lower half of the frame':'; the closed laptop fills the lower half of the frame')+copyBit(sel));
      L.push(wardrobeLine(sel,true));
      L.push(castLine(sel,true));
      L.push(open?'Screen: the laptop screen faces away from the camera or sits out of frame':'Screen: the laptop is closed');
      return L;
    }
    var portrait=style==='Portrait',solo=sel.shot!=='Two-shot'&&!row.company,fl=sel.float&&sel.float!=='No';
    L.push(portrait?'Photo: an editorial portrait of a professional just after a little win at work, the light landing on them; settled-in and quietly successful, buoyed by optimism; a real, unretouched moment':'Photo: a candid editorial photograph of a professional’s little win at work, the light landing on them and their idea; candid, settled-in, in flow and quietly successful, buoyed by optimism; a real, unretouched moment');
    var place=f.place;if(!solo&&!/colleague/.test(place))place+=', a colleague beside them';
    L.push('Subject: a '+who(sel)+', '+v('place',place)+', at '+v('time',row.time));
    var body=/walking/.test(place)?'mid-stride, shoulders relaxed, the laptop easy in one hand':keep('body',function(){return BODY[one(BODY_FOR[row.post]||[0,1])]});
    L.push('Moment: '+v('time',row.win)+MOMENT_TAIL+'; '+v('body',body)+';'+STOCK);
    L.push(portrait?'Gaze: into the lens with a settled, easy half-smile, unposed, as if a friend just asked how it went':'Gaze: on the work or the person they’re talking to, never at the lens');
    L.push(lightLine(sel,row));
    var lens=portrait?(sel.shot==='Wide shot'?'50mm, waist-up, with the room around them':sel.shot==='Medium shot'?'85mm, chest-up':'85mm, close on the face and shoulders'):LENS[sel.shot]||LENS['Medium shot'];
    if(/walking/.test(place)&&/85mm, close/.test(lens))lens='50mm, waist-up';
    var fr='Frame: '+v('lens',lens)+', '+v('angle',angle(sel,row));
    if(fl)fr+='; frame it wide, with open, uncluttered air around them, above each shoulder and beside the laptop, for blank floating slides added in post';
    L.push(fr+copyBit(sel));
    L.push(wardrobeLine(sel));
    L.push(castLine(sel));
    L.push(HAIR);
    L.push(row.screen?SCREEN_BLANK(row.screen):'Screen: the laptop screen faces away from the camera');
    if(sel.prop==='Prop'){var pr=keep('prop',function(){return one(PROPS)});L.splice(L.length-1,0,'Prop: '+v('prop',pr)+', the only object besides the laptop')}
    else L.splice(L.length-1,0,'Prop: none; only the laptop');
    return L;
  }
  var PROPS=['a ceramic mug of coffee','a glass of water','a cup of tea','a small espresso cup','folded reading glasses','wireless earbuds in their case','a reusable water bottle','a small potted plant','a set of keys'];

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
    if(mode==='Screen close-up'){subj='the hands of a '+who(sel)+', on the '+dev+', '+f.place;frame='50mm, close on the screen and hands, light raking across them'+(dev==='laptop'?'; the laptop’s keyboard and trackpad fill the lower half of the frame':'; the tablet fills the lower half of the frame')}
    else if(mode==='Point of view'){subj='a '+who(sel)+', seen through their own eyes, '+f.place;frame='35mm point of view, looking down past their hands to the laptop; the keyboard and trackpad fill the lower half of the frame'}
    else {subj='a '+who(sel)+', seen from behind, '+f.place;frame='50mm over the shoulder: the back of their head and shoulder soft in the near foreground, the screen facing the camera in the middle of the frame'}
    L.push('Subject: '+v('place',subj)+', at '+v('time',row.time));
    L.push('Moment: the last piece of the work just came together, caught just after the peak: the hands easing off the keyboard;'+STOCK);
    L.push(lightLine(sel,row,{hands:mode!=='Over the shoulder',what:'hands and the '+dev}));
    L.push('Frame: '+v('lens',frame)+copyBit(sel));
    L.push(wardrobeLine(sel,mode!=='Over the shoulder'));
    L.push(castLine(sel,mode!=='Over the shoulder'));
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
      L.push('Light: clear morning window light runs down the table and lands on the screen wall; the room falls a stop darker around it, warm, never gloomy; never the sun disc in frame, haze beams or god rays');
      L.push('Frame: 35mm, from the far end of the table at seated eye level, the screen in the upper third'+copyBit(sel));
      L.push(SCREEN_BLANK('the '+R.scr));
    }else if(mode==='Stage'){
      L.push('Photo: a candid editorial photograph of a professional presenting on a stage, the room leaning in; settled-in and quietly successful, buoyed by optimism; a real, unretouched moment');
      L.push('Subject: a '+who(p)+', presenting at the side of a stage beside a large projection screen');
      L.push('Moment: the room leans in'+MOMENT_TAIL+'; standing easy, one hand open toward the screen;'+STOCK);
      L.push('Light: warm stage light lands on the presenter and the screen; the audience falls a stop darker, warm, never gloomy; never haze beams, god rays or a spotlight on a black background');
      L.push('Frame: 35mm, from mid-audience, the soft backs of the audience out of focus in the foreground'+copyBit(sel));
      L.push(wardrobeLine(p));L.push(castLine(p));L.push(HAIR);
      L.push(SCREEN_BLANK('the projection screen'));
    }else{
      var dev=keep('device',function(){return one(['laptop','tablet'])});
      L.push('Photo: a candid editorial photograph of a professional sharing their slides with a colleague across a table, the light landing on them and their idea; settled-in, in flow and quietly successful, buoyed by optimism; a real, unretouched moment');
      L.push('Subject: a '+who(p)+', turning a '+v('device',dev)+' toward a colleague across a table');
      L.push('Moment: the idea lands with the colleague'+MOMENT_TAIL+';'+STOCK);
      L.push('Gaze: on the colleague, never at the lens');
      L.push('Light: soft window light lands on the two of them and the '+dev+'; the faces are the brightest skin in the frame; the room falls a stop darker, warm, never gloomy; never the sun disc in frame or haze beams');
      L.push('Frame: 50mm, from beside the colleague’s shoulder, the '+dev+' angled so its screen faces the camera'+copyBit(sel));
      L.push(wardrobeLine(p));L.push(castLine(p));L.push(HAIR);
      L.push(SCREEN_BLANK('the '+dev+' screen'));
    }
    return L;
  }

  /* ── public API ── */
  function build(facet,sel){LV=[];LVK={};
    var L=facet==='Product'?product(sel):facet==='Presentation'?slides(sel):pro(sel);
    var gfxMode=(facet==='Product'&&sel.pshot==='Brand graphic space')||(facet==='Presentation'&&sel.layout==='Brand graphic space');
    if(!gfxMode){L.push(LOOK,NEVER,AVOID)}
    return L.join('\n')}
  AD.build=build;
  AD.hold=function(){R={}};AD.reroll=function(){R={}};
  AD.snap=function(){return JSON.parse(JSON.stringify(R))};AD.restore=function(s){R=JSON.parse(JSON.stringify(s||{}))};
  AD.lastVars=function(){return LV.slice()};AD.varKey=function(t){return LVK[t]};
  AD.unset=function(k){delete R[k];if(k==='ramp')delete R.garment;if(k==='time')delete R.place};
  AD.PSHOTS={'Screen close-up':1,'Over the shoulder':1,'Point of view':1,'Brand graphic space':1};
  AD.LAYOUTS={'Meeting room':1,'Stage':1,'Across the table':1,'Brand graphic space':1};
  AD.GROUNDS={'Light':1,'Dark':1};
  AD.V3=true;
})();

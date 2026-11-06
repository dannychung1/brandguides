/* Copy edit tweak — select any text in the guide and edit it in place.
   Uses the canvas Tweaks protocol: the Tweaks toggle turns edit mode on, and each edit is
   written into this page's own EDITMODE block (window.COPY_EDITS) by the canvas.
   Saved edits apply on load everywhere the page is served. Claude bakes them into the HTML on request. */
(function(){
    var BLOCKERS='h1,h2,h3,h4,h5,h6,p,li,ul,ol,figure,img,video,svg,section,article,table,button,input,textarea,select,canvas,image-slot,nav,header,footer,form';
  var page=decodeURIComponent(location.pathname.split('/').pop()||'index.html').replace(/\.dc\.html$/,'');
  var saved={}, dirty={}, on=false, ui=null, current=null;
  function norm(s){return (s||'').replace(/\s+/g,' ').trim()}
  function key(t,o,i){return t+'|'+i+'|'+o}

  /* Record each text element's original text and its occurrence index, before any edit is applied */
  var orig=new Map(), byKey={};
  function index(){
    var seen={};
    document.querySelectorAll('body *').forEach(function(el){
      if(el.closest('.ce-ui')||el.children.length>40)return;
      var t=norm(el.textContent);if(!t||t.length>1200)return;
      var k=el.tagName+'|'+t;seen[k]=(seen[k]||0);
      orig.set(el,{t:el.tagName,o:t,i:seen[k]});byKey[key(el.tagName,t,seen[k])]=el;seen[k]++;
    });
  }
  function apply(){
    Object.keys(saved).forEach(function(k){
      var h=saved[k];if(typeof h!=='string')return;
      var el=byKey[k];if(!el)return;
      var o=orig.get(el);if(el.innerHTML!==h){el.innerHTML=h;relink(o.o,norm(el.textContent));}
    });
  }
  /* Menus are built from headings: keep any link that repeated the old text in step */
  function relink(oldT,newT){
    if(oldT===newT)return;
    document.querySelectorAll('a').forEach(function(a){if(!a.children.length&&norm(a.textContent)===oldT)a.textContent=newT});
  }

  function post(msg){try{if(window.parent!==window)window.parent.postMessage(msg,'*')}catch(e){}}
  /* ── editing ── */
  function css(){
    var s=document.createElement('style');s.className='ce-ui';
    s.textContent=
    '.ce-on [data-ce-hover]{outline:1px dashed var(--color-blue,#00B9FF);outline-offset:4px;cursor:text}'+
    '.ce-on [contenteditable]{outline:2px solid var(--color-blue,#00B9FF)!important;outline-offset:4px;cursor:text;caret-color:var(--color-blue,#00B9FF)}'+
    '.ce-on [data-ce-dirty]{background:color-mix(in oklch,var(--color-blue,#00B9FF) 10%,transparent)}'+
    '.ce-bar{position:fixed;left:var(--gutter,24px);bottom:24px;z-index:2147483000;display:flex;align-items:center;gap:8px;padding:8px;border-radius:999px;background:var(--color-neutral-darkest,#001A24);color:#fff;font:400 14px/1 "Post Grotesk",system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,26,36,.25)}'+
    '.ce-bar button{appearance:none;border:0;border-radius:999px;height:36px;padding:0 16px;font:500 14px/1 inherit;font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:6px}'+
    '.ce-bar .ce-go{background:var(--color-blue,#00B9FF);color:var(--color-neutral-darkest,#001A24)}.ce-bar .ce-go:hover{background:#52D0FF}'+
    '.ce-bar .ce-ghost{background:transparent;color:#D8DADA}.ce-bar .ce-ghost:hover{color:#fff}'+
    '.ce-bar .ce-msg{padding:0 8px 0 12px;color:#D8DADA;white-space:nowrap}'+
    '.ce-bar .material-symbols-outlined{font-size:18px;font-variation-settings:"wght" 300}'+
    '.ce-bar[hidden],.ce-bar [hidden]{display:none}'+
    '@media print{.ce-bar{display:none}}';
    document.head.appendChild(s);
  }
  function bar(){
    var b=document.createElement('div');b.className='ce-bar ce-ui';b.setAttribute('role','toolbar');b.setAttribute('aria-label','Edit copy');
    b.innerHTML='<span class="ce-msg" hidden></span>'+
      '<button type="button" class="ce-ghost ce-discard" hidden>Discard</button>'+
      '<button type="button" class="ce-go ce-toggle"><span class="material-symbols-outlined" aria-hidden="true">edit</span><span class="ce-lbl">Edit copy</span></button>';
    document.body.appendChild(b);
    b.querySelector('.ce-toggle').addEventListener('click',function(){stop();post({type:'__edit_mode_dismissed'})});
    
    return b;
  }
  function count(){return Object.keys(dirty).length}
  function render(msg){
    if(!ui)return;
    var n=count(),m=ui.querySelector('.ce-msg');
    m.hidden=!on;m.textContent=msg||(n?n+(n===1?' edit':' edits')+' saved':'Click any text to edit it');
    ui.querySelector('.ce-discard').hidden=true;
    ui.querySelector('.ce-lbl').textContent='Done';
    ui.querySelector('.ce-toggle .material-symbols-outlined').textContent=on?'check':'edit';
  }
  function target(node){
    var el=node&&node.nodeType===1?node:node&&node.parentElement;
    if(!el||el.closest('.ce-ui'))return null;
    if(el.matches('.material-symbols-outlined'))el=el.parentElement;
    while(el&&el!==document.body){
      var d=getComputedStyle(el).display;
      if(d==='inline'||d==='contents'){el=el.parentElement;continue}
      break;
    }
    if(!el||el===document.body||el.closest('.ce-ui'))return null;
    if(!norm(el.textContent)||el.querySelector(BLOCKERS))return null;
    if(el.closest('.copy-block pre,[data-mosaic],.bd-out'))return null;
    return el;
  }
  function onOver(e){var t=target(e.target);document.querySelectorAll('[data-ce-hover]').forEach(function(x){if(x!==t)x.removeAttribute('data-ce-hover')});if(t&&!t.isContentEditable)t.setAttribute('data-ce-hover','')}
  function onClick(e){
    if(e.target.closest('.ce-ui'))return;
    var t=target(e.target);
    if(e.target.closest('a,button,label,summary,[role=tab],[onclick]')||t){e.preventDefault();e.stopPropagation()}
    if(!t||t===current)return;
    edit(t,e);
  }
  function edit(t,e){
    if(current)commit(current);
    current=t;
    if(!orig.has(t))orig.set(t,{t:t.tagName,o:norm(t.textContent),i:0});
    t.__ceBefore=t.innerHTML;if(t.__ceBase===undefined)t.__ceBase=t.innerHTML;
    t.querySelectorAll('.material-symbols-outlined').forEach(function(i){i.setAttribute('contenteditable','false')});
    try{t.contentEditable='plaintext-only'}catch(x){t.contentEditable='true'}
    if(t.contentEditable!=='plaintext-only')t.contentEditable='true';
    t.removeAttribute('data-ce-hover');t.focus();
    if(e&&document.caretRangeFromPoint){var r=document.caretRangeFromPoint(e.clientX,e.clientY);if(r){var s=getSelection();s.removeAllRanges();s.addRange(r)}}
  }
  function clean(el){
    var c=el.cloneNode(true);
    c.querySelectorAll('[contenteditable]').forEach(function(x){x.removeAttribute('contenteditable')});
    c.querySelectorAll('br').forEach(function(b){if(!b.nextSibling)b.remove()});
    return c.innerHTML.replace(/ (?=\S)/g,function(m){return m});
  }
  function commit(el){
    el.removeAttribute('contenteditable');
    el.querySelectorAll('[contenteditable]').forEach(function(x){x.removeAttribute('contenteditable')});
    var o=orig.get(el),k=key(o.t,o.o,o.i);
    if(el.innerHTML!==el.__ceBefore){
      var before=norm(new DOMParser().parseFromString('<b>'+el.__ceBefore+'</b>','text/html').body.textContent);
      var h=clean(el),edits={};edits[k]=norm(el.textContent)===o.o&&h===el.__ceBase?null:h;
      saved[k]=edits[k];dirty[k]=1;el.setAttribute('data-ce-dirty','');
      post({type:'__edit_mode_set_keys',edits:edits});el.__ceBefore=el.innerHTML;
      relink(before,norm(el.textContent));
    }
    if(current===el)current=null;
    render();
  }
  function onKey(e){
    if(!current)return;
    if(e.key==='Escape'){current.innerHTML=current.__ceBefore;var c=current;commit(c);c.blur();e.preventDefault()}
    else if(e.key==='Enter'&&!e.shiftKey&&/^H[1-6]$|^A$|^SPAN$|^BUTTON$/.test(current.tagName)){e.preventDefault();var d=current;commit(d);d.blur()}
  }
  function onFocusOut(e){if(current&&e.target===current)commit(current)}
  function start(){
    on=true;document.documentElement.classList.add('ce-on');if(!ui){css();ui=bar()}ui.hidden=false;
    document.addEventListener('mouseover',onOver,true);
    document.addEventListener('click',onClick,true);
    document.addEventListener('keydown',onKey,true);
    document.addEventListener('focusout',onFocusOut,true);
    render();
  }
  function stop(){
    if(current)commit(current);
    on=false;document.documentElement.classList.remove('ce-on');
    document.removeEventListener('mouseover',onOver,true);
    document.removeEventListener('click',onClick,true);
    document.removeEventListener('keydown',onKey,true);
    document.removeEventListener('focusout',onFocusOut,true);
    document.querySelectorAll('[data-ce-hover],[data-ce-dirty]').forEach(function(x){x.removeAttribute('data-ce-hover');x.removeAttribute('data-ce-dirty')});
    dirty={};if(ui)ui.hidden=true;
  }
  /* The canvas Tweaks toggle switches edit mode on and off */
  window.addEventListener('message',function(e){
    var t=e&&e.data&&e.data.type;
    if(t==='__activate_edit_mode'&&!on)start();else if(t==='__deactivate_edit_mode'&&on)stop();
  });

  function boot(){
    var c=window.COPY_EDITS;saved=c&&typeof c==='object'?c:{};
    index();apply();
    post({type:'__edit_mode_available'});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

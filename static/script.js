const root=document.documentElement;
const availableThemes=["light","dark","midnight"];
const metaTheme=document.querySelector('meta[name="theme-color"]');
const themeButtons=[...document.querySelectorAll(".theme-option")];

function applyTheme(theme, save=true){
  const safeTheme=availableThemes.includes(theme)?theme:"light";
  root.dataset.theme=safeTheme;
  if(save) localStorage.setItem("portfolio-theme",safeTheme);
  const dark=safeTheme==="dark" || safeTheme==="midnight";
  themeButtons.forEach(btn=>{
    const active=btn.dataset.theme===safeTheme;
    btn.classList.toggle("is-active",active);
    btn.setAttribute("aria-pressed",String(active));
  });
  if(metaTheme) metaTheme.content=dark?"#030712":"#F8FAFC";
}

const savedTheme=localStorage.getItem("portfolio-theme");
const systemDark=window.matchMedia("(prefers-color-scheme: dark)");
applyTheme(savedTheme || (systemDark.matches?"dark":"light"),false);

if(themeButtons.length){
  themeButtons.forEach(btn=>{
    btn.addEventListener("click",()=>applyTheme(btn.dataset.theme || "light"));
  });
}

if(!savedTheme){
  systemDark.addEventListener?.("change",e=>applyTheme(e.matches?"dark":"light",false));
}

const fill=document.getElementById("loaderFill");
const pct=document.getElementById("loaderPct");
const loader=document.getElementById("loader");
let progress=0;
const loaderTimer=setInterval(()=>{
  progress=Math.min(progress+Math.random()*9+4,92);
  if(fill) fill.style.width=progress+"%";
  if(pct) pct.textContent=Math.round(progress)+"%";
},45);
function finishLoader(){
  clearInterval(loaderTimer);
  if(fill) fill.style.width="100%";
  if(pct) pct.textContent="100%";
  window.setTimeout(()=>loader?.classList.add("hide"),160);
}
if(document.readyState==="complete") finishLoader();
else window.addEventListener("load",finishLoader,{once:true});

const navToggle=document.getElementById("navToggle");
const mainNav=document.getElementById("mainNav");
if(navToggle&&mainNav){
  navToggle.addEventListener("click",()=>{
    const isOpen=mainNav.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded",String(isOpen));
  });

  mainNav.querySelectorAll(".nav-links a, .nav-resume").forEach(link=>{
    link.addEventListener("click",()=>{
      mainNav.classList.remove("menu-open");
      navToggle.setAttribute("aria-expanded","false");
    });
  });
}

const cardWrap=document.getElementById("cardWrap");
const card3d=document.getElementById("card3d");
if(cardWrap&&card3d&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  cardWrap.addEventListener("mousemove",e=>{
    const r=cardWrap.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)/(r.width/2);
    const y=(e.clientY-r.top-r.height/2)/(r.height/2);
    card3d.style.transform=`rotateY(${x*8}deg) rotateX(${y*-6}deg)`;
  });
  cardWrap.addEventListener("mouseleave",()=>card3d.style.transform="rotateY(0) rotateX(0)");
}

const phrases=["clean web apps.","useful Python tools.","responsive interfaces.","real-world projects."];
let phraseIndex=0,charIndex=0,deleting=false;
const typed=document.getElementById("typed");
function type(){
  if(!typed)return;
  const phrase=phrases[phraseIndex];
  typed.textContent=deleting?phrase.slice(0,charIndex--):phrase.slice(0,charIndex++);
  if(!deleting&&charIndex>phrase.length){deleting=true;setTimeout(type,1100);return}
  if(deleting&&charIndex<0){deleting=false;phraseIndex=(phraseIndex+1)%phrases.length}
  setTimeout(type,deleting?42:72);
}
type();

function countUp(el,target,suffix=""){
  if(!el)return;
  let value=0;const step=target/45;
  const t=setInterval(()=>{
    value=Math.min(value+step,target);
    el.textContent=Math.round(value)+suffix;
    if(value>=target)clearInterval(t);
  },25);
}
const statsObserver=new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting){
    document.querySelectorAll(".s-num").forEach(el=>countUp(el,Number(el.dataset.target||0),el.dataset.suffix||""));
    statsObserver.disconnect();
  }
},{threshold:.5});
const heroStats=document.querySelector(".hero-stats");
if(heroStats)statsObserver.observe(heroStats);

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));
setTimeout(()=>document.querySelector("#hero .reveal")?.classList.add("in"),100);

const progressBar=document.getElementById("scrollProgress");
const nav=document.querySelector("nav");
const navLinks=[...document.querySelectorAll(".nav-links a")];
const sections=[...document.querySelectorAll("section[id]")];
let scrollTicking=false;
function updateScrollState(){
  const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
  const ratio=maxScroll>0?window.scrollY/maxScroll:0;
  if(progressBar) progressBar.style.width=`${ratio*100}%`;
  nav?.classList.toggle("scrolled",window.scrollY>24);
  const current=sections.reduce((active,section)=>window.scrollY+150>=section.offsetTop?section.id:active,"");
  navLinks.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+current));
  scrollTicking=false;
}
window.addEventListener("scroll",()=>{
  if(!scrollTicking){window.requestAnimationFrame(updateScrollState);scrollTicking=true;}
},{passive:true});
updateScrollState();

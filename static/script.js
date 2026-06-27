const fill=document.getElementById('loaderFill');
const pct=document.getElementById('loaderPct');
let progress=0;
const timer=setInterval(()=>{
  progress+=Math.random()*4+1;
  if(progress>=100){progress=100;clearInterval(timer);setTimeout(()=>document.getElementById('loader').classList.add('hide'),300)}
  fill.style.width=progress+'%';
  pct.textContent=Math.round(progress)+'%';
},40);

const cur=document.getElementById('cur');
const cur2=document.getElementById('cur2');
let mouseX=0,mouseY=0;
document.addEventListener('mousemove',e=>{
  mouseX=e.clientX;mouseY=e.clientY;
  cur.style.left=mouseX+'px';cur.style.top=mouseY+'px';
  cur2.style.left=mouseX+'px';cur2.style.top=mouseY+'px';
});
document.querySelectorAll('a,button,.sk-card,.pc,.exp-card,.cert,.card3d-wrap').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.transform='scale(3)';cur2.style.width='60px';cur2.style.height='60px';cur2.style.borderColor='rgba(6,182,212,0.7)'});
  el.addEventListener('mouseleave',()=>{cur.style.transform='scale(1)';cur2.style.width='36px';cur2.style.height='36px';cur2.style.borderColor='rgba(139,92,246,0.5)'});
});

const canvas=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,1000);
camera.position.z=70;

const particleCount=3000;
const positions=new Float32Array(particleCount*3);
const colors=new Float32Array(particleCount*3);
const color1=new THREE.Color(0x8b5cf6),color2=new THREE.Color(0x06b6d4),color3=new THREE.Color(0xf43f5e);
for(let i=0;i<particleCount;i++){
  const radius=Math.random()*120;
  const theta=Math.random()*Math.PI*2;
  const phi=Math.acos(2*Math.random()-1);
  positions[i*3]=radius*Math.sin(phi)*Math.cos(theta);
  positions[i*3+1]=radius*Math.sin(phi)*Math.sin(theta);
  positions[i*3+2]=radius*Math.cos(phi)-30;
  const t=Math.random();
  const color=t<0.5?color1.clone().lerp(color2,t*2):color2.clone().lerp(color3,(t-0.5)*2);
  colors[i*3]=color.r;colors[i*3+1]=color.g;colors[i*3+2]=color.b;
}
const particleGeometry=new THREE.BufferGeometry();
particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
particleGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
const particles=new THREE.Points(particleGeometry,new THREE.PointsMaterial({size:0.35,vertexColors:true,transparent:true,opacity:0.8}));
scene.add(particles);

const shapes=[];
const materials=[
  new THREE.MeshBasicMaterial({color:0x8b5cf6,wireframe:true,transparent:true,opacity:0.1}),
  new THREE.MeshBasicMaterial({color:0x06b6d4,wireframe:true,transparent:true,opacity:0.08}),
  new THREE.MeshBasicMaterial({color:0xf43f5e,wireframe:true,transparent:true,opacity:0.07}),
];
[[new THREE.IcosahedronGeometry(12,1),0,[-35,18,-50]],[new THREE.OctahedronGeometry(9,0),1,[40,-12,-45]],[new THREE.TorusGeometry(8,0.5,8,20),2,[15,25,-60]],[new THREE.TetrahedronGeometry(7,0),0,[-25,-20,-55]]].forEach(([geometry,materialIndex,position])=>{
  const mesh=new THREE.Mesh(geometry,materials[materialIndex]);
  mesh.position.set(...position);
  mesh.userData={sx:(Math.random()-0.5)*0.004,sy:(Math.random()-0.5)*0.004,sz:(Math.random()-0.5)*0.003,baseY:position[1],t:Math.random()*Math.PI*2};
  scene.add(mesh);shapes.push(mesh);
});

const lineGeometry=new THREE.BufferGeometry();
const linePositions=[];
for(let i=0;i<80;i++){
  const a=Math.floor(Math.random()*particleCount)*3;
  const b=Math.floor(Math.random()*particleCount)*3;
  const dx=positions[a]-positions[b];
  const dy=positions[a+1]-positions[b+1];
  const dz=positions[a+2]-positions[b+2];
  if(Math.sqrt(dx*dx+dy*dy+dz*dz)<40){
    linePositions.push(positions[a],positions[a+1],positions[a+2],positions[b],positions[b+1],positions[b+2]);
  }
}
lineGeometry.setAttribute('position',new THREE.Float32BufferAttribute(linePositions,3));
const lineSegments=new THREE.LineSegments(lineGeometry,new THREE.LineBasicMaterial({color:0x8b5cf6,transparent:true,opacity:0.04}));
scene.add(lineSegments);

let scrollY=0,targetScrollY=0,mouseRX=0,mouseRY=0;
window.addEventListener('scroll',()=>{targetScrollY=window.scrollY});
document.addEventListener('mousemove',e=>{mouseRX=(e.clientX/innerWidth-0.5)*0.5;mouseRY=(e.clientY/innerHeight-0.5)*0.5});

let time=0;
function animate(){
  requestAnimationFrame(animate);
  time+=0.005;
  scrollY+=(targetScrollY-scrollY)*0.06;

  particles.rotation.y=time*0.04+mouseRX*0.15;
  particles.rotation.x=mouseRY*0.08+scrollY*0.0004;
  particles.rotation.z=time*0.01;

  shapes.forEach(shape=>{
    shape.rotation.x+=shape.userData.sx;
    shape.rotation.y+=shape.userData.sy;
    shape.rotation.z+=shape.userData.sz;
    shape.userData.t+=0.008;
    shape.position.y=shape.userData.baseY+Math.sin(shape.userData.t)*3;
  });

  camera.position.x=mouseRX*5;
  camera.position.y=-mouseRY*3+scrollY*0.01;
  camera.lookAt(0,0,0);

  renderer.render(scene,camera);
}
animate();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

const cardWrap=document.getElementById('cardWrap');
const card3d=document.getElementById('card3d');
if (cardWrap && card3d) {
  cardWrap.addEventListener('mousemove',e=>{
    const rect=cardWrap.getBoundingClientRect();
    const x=(e.clientX-rect.left-rect.width/2)/(rect.width/2);
    const y=-(e.clientY-rect.top-rect.height/2)/(rect.height/2);
    card3d.style.transform=`rotateY(${x*18}deg) rotateX(${y*12}deg)`;
  });
  cardWrap.addEventListener('mouseleave',()=>{card3d.style.transform='rotateY(0) rotateX(0)'});
}

const phrases=['full-stack web apps.','polished Flask products.','real-world Python tools.','responsive interfaces.','backend logic that scales.'];
let phraseIndex=0, charIndex=0, deleting=false;
const typedElement=document.getElementById('typed');
function type(){
  const current=phrases[phraseIndex];
  typedElement.textContent=deleting?current.substring(0,charIndex--):current.substring(0,charIndex++);
  if(!deleting&&charIndex>current.length){deleting=true;setTimeout(type,1200);return}
  if(deleting&&charIndex<0){deleting=false;phraseIndex=(phraseIndex+1)%phrases.length}
  setTimeout(type,deleting?50:80);
}
if (typedElement) type();

function countUp(element,target,suffix=''){
  let value=0;const step=target/60;
  const timer=setInterval(()=>{value=Math.min(value+step,target);element.textContent=Math.round(value)+suffix;if(value>=target)clearInterval(timer)},25);
}
const statsObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){countUp(document.getElementById('cn1'),4,'+');countUp(document.getElementById('cn2'),6,'+');countUp(document.getElementById('cn3'),50,'+');statsObserver.disconnect()}});
},{threshold:0.5});
const heroStats=document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach((entry,index)=>{if(entry.isIntersecting)setTimeout(()=>entry.target.classList.add('in'),index*80)});
},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(reveal=>revealObserver.observe(reveal));
setTimeout(()=>{const firstReveal=document.querySelector('#hero .reveal'); if(firstReveal) firstReveal.classList.add('in');},100);

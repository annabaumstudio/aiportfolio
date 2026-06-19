const io=new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        const el=e.target;
        const sibs=[...el.parentElement.querySelectorAll('.reveal')];
        const delay=sibs.indexOf(el)>=0?Math.min(sibs.indexOf(el),5)*90:0;
        setTimeout(()=>el.classList.add('in'),delay);
        io.unobserve(el);
      }
    });
  },{threshold:.14,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  /* ===== mouse-reactive layer (desktop / fine pointer only) ===== */
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(fine){
    const lerp=(a,b,n)=>a+(b-a)*n;

    /* --- soft glow that trails the cursor --- */
    const glow=document.querySelector('.cursor-glow');
    let gx=innerWidth/2,gy=innerHeight/2,tx=gx,ty=gy;
    addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;document.body.classList.add('mouse-on');});
    addEventListener('mouseleave',()=>document.body.classList.remove('mouse-on'));
    (function trail(){
      gx=lerp(gx,tx,.12);gy=lerp(gy,ty,.12);
      glow.style.transform=`translate(${gx}px,${gy}px) translate(-50%,-50%)`;
      requestAnimationFrame(trail);
    })();

    /* --- hero parallax: title & accents drift opposite the cursor --- */
    const hero=document.querySelector('.hero');
    const h1=hero.querySelector('h1'),tag=hero.querySelector('.tag'),sub=hero.querySelector('.sub');
    hero.addEventListener('mousemove',e=>{
      const r=hero.getBoundingClientRect();
      const dx=(e.clientX-r.width/2)/r.width, dy=(e.clientY-r.height/2)/r.height;
      h1.style.transform=`translate(${dx*-26}px,${dy*-18}px)`;
      tag.style.transform=`translate(${dx*16}px,${dy*12}px)`;
      sub.style.transform=`translate(${dx*10}px,${dy*8}px)`;
    });
    hero.addEventListener('mouseleave',()=>{
      [h1,tag,sub].forEach(el=>{el.style.transform='';el.style.transition='transform .6s cubic-bezier(.2,.7,.2,1)';
        setTimeout(()=>el.style.transition='',600);});
    });

    /* --- gallery 3D tilt following the cursor --- */
    document.querySelectorAll('.work').forEach(card=>{
      const frame=card.querySelector('.frame');
      card.addEventListener('mousemove',e=>{
        const r=frame.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
        const rx=(py-.5)*-12, ry=(px-.5)*12;
        card.classList.add('tilting');
        frame.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
        frame.style.setProperty('--gx',(px*100)+'%');
        frame.style.setProperty('--gy',(py*100)+'%');
      });
      card.addEventListener('mouseleave',()=>{
        card.classList.remove('tilting');
        frame.style.transform='';
      });
    });

    /* --- magnetic buttons: gently pull toward the cursor --- */
    document.querySelectorAll('.btn,.order-btn,.btn-ghost').forEach(btn=>{
      const strength=btn.classList.contains('order-btn')?.18:.32;
      btn.addEventListener('mousemove',e=>{
        const r=btn.getBoundingClientRect();
        const mx=e.clientX-(r.left+r.width/2), my=e.clientY-(r.top+r.height/2);
        btn.style.transform=`translate(${mx*strength}px,${my*strength}px)`;
      });
      btn.addEventListener('mouseleave',()=>{
        btn.style.transition='transform .5s cubic-bezier(.2,.7,.2,1)';
        btn.style.transform='';
        setTimeout(()=>btn.style.transition='',500);
      });
    });
  }

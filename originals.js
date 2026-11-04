// Original WAVEON instrumental demo compositions, synthesized locally with Web Audio.
const waveonDemos=[
 {title:"Neon Highway",style:"Synthwave",bpm:108,root:45,chords:[[0,3,7],[5,8,12],[8,12,15],[3,7,10]],melody:[12,15,19,15,12,10,7,10,12,15,22,19,15,12,10,7]},
 {title:"Midnight Drive",style:"Chill / Lo-fi",bpm:82,root:48,chords:[[0,4,7,11],[-2,2,5,9],[-5,-1,2,7],[-7,-3,0,4]],melody:[12,11,7,4,7,11,12,14,16,14,11,7,9,7,4,2]},
 {title:"Skyline Pulse",style:"Electronic",bpm:126,root:43,chords:[[0,3,7],[7,10,14],[5,8,12],[3,7,10]],melody:[12,19,17,15,12,15,17,19,22,19,17,15,12,10,7,10]}
];
let waveonCtx=null,waveonTimer=null,waveonDemo=-1,waveonStep=0,waveonNext=0,waveonMaster=null;
function waveonTone(freq,at,duration,shape,volume){const ctx=waveonCtx;if(!ctx)return;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=shape;osc.frequency.setValueAtTime(freq,at);gain.gain.setValueAtTime(0.0001,at);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);osc.connect(gain).connect(waveonMaster);osc.start(at);osc.stop(at+duration+.02)}
function waveonHz(note){return 440*Math.pow(2,(note-69)/12)}
function waveonBeat(){if(waveonDemo<0||!waveonCtx)return;const d=waveonDemos[waveonDemo],beat=60/d.bpm,step=waveonStep,bar=Math.floor(step/16)%4,within=step%16,ch=d.chords[bar],at=waveonNext;
if(within===0){for(const interval of ch)waveonTone(waveonHz(d.root+interval+12),at,beat*3.6,'triangle',.055)}
if(within%4===0)waveonTone(waveonHz(d.root+ch[0]-12),at,beat*.85,'sine',.15);
if(within%2===0){const note=d.root+d.melody[within];waveonTone(waveonHz(note+12),at,beat*.42,d.style==='Chill / Lo-fi'?'sine':'triangle',.09)}
if(within%4===0){waveonTone(85,at,.09,'sine',.17)}
if(within%4===2){waveonTone(180,at,.06,'triangle',.06)}
waveonStep++;waveonNext+=beat/4}
function waveonSchedule(){if(!waveonCtx||waveonDemo<0)return;while(waveonNext<waveonCtx.currentTime+.18)waveonBeat()}
async function waveonPlayDemo(i){if(waveonDemo===i){waveonStopDemo();return}waveonStopDemo();const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass){alert('Web Audio is not supported');return}waveonCtx=new AudioContextClass();waveonMaster=waveonCtx.createGain();waveonMaster.gain.value=.75;waveonMaster.connect(waveonCtx.destination);await waveonCtx.resume();waveonDemo=i;waveonStep=0;waveonNext=waveonCtx.currentTime+.05;waveonSchedule();waveonTimer=setInterval(waveonSchedule,60);document.getElementById('now').textContent=waveonDemos[i].title+' · WAVEON Originals';document.getElementById('player').pause();document.getElementById('player').removeAttribute('src');waveonRenderDemos()}
function waveonStopDemo(){if(waveonTimer)clearInterval(waveonTimer);waveonTimer=null;waveonDemo=-1;if(waveonCtx){waveonCtx.close().catch(()=>{});waveonCtx=null}waveonRenderDemos()}
function waveonRenderDemos(){const root=document.getElementById('demo-tracks');if(!root)return;root.replaceChildren();waveonDemos.forEach((d,i)=>{const line=document.createElement('div');line.className='track';const art=document.createElement('div');art.className='art';art.textContent=['🌃','🌙','🌆'][i];const meta=document.createElement('div');meta.className='meta';const title=document.createElement('strong');title.textContent=d.title;const subtitle=document.createElement('small');subtitle.textContent='WAVEON Originals · '+d.style;meta.append(title,subtitle);const btn=document.createElement('button');btn.textContent=waveonDemo===i?'⏸':'▶';btn.setAttribute('aria-label',(waveonDemo===i?'Stop ':'Play ')+d.title);btn.onclick=()=>waveonPlayDemo(i);line.append(art,meta,btn);root.append(line)})}
window.waveonPlayDemo=waveonPlayDemo;window.waveonStopDemo=waveonStopDemo;window.waveonRenderDemos=waveonRenderDemos;waveonRenderDemos();
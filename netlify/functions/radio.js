const HOSTS=['https://de1.api.radio-browser.info','https://nl1.api.radio-browser.info','https://at1.api.radio-browser.info'];
const headers={'User-Agent':'WAVEONMusic/2.0','Accept':'application/json'};
exports.handler=async(event)=>{
 const tag=String(event.queryStringParameters?.tag||'pop').slice(0,35);
 const tags=[tag,...(tag==='remix'?['dance','electronic','pop']:[])];
 const attempts=[];
 for(const term of tags){for(const host of HOSTS){attempts.push((async()=>{
  const query=new URLSearchParams({tag:term,hidebroken:'true',limit:'60',order:'votes',reverse:'true'});
  const res=await fetch(host+'/json/stations/search?'+query,{headers,signal:AbortSignal.timeout(7000)});
  if(!res.ok)throw Error('HTTP '+res.status);
  const rows=await res.json();if(!Array.isArray(rows))throw Error('Invalid station list');
  const stations=rows.filter(x=>x.name&&x.url_resolved&&/^https:\/\//i.test(x.url_resolved)).map(x=>({stationuuid:x.stationuuid||x.url_resolved,name:x.name,url_resolved:x.url_resolved,favicon:x.favicon,country:x.country,tags:x.tags,codec:x.codec}));
  if(!stations.length)throw Error('Empty stations');return stations.slice(0,35);
 })());}}
 try{const stations=await Promise.any(attempts);return{statusCode:200,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=60'},body:JSON.stringify(stations)}}
 catch(e){return{statusCode:503,headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify({error:'Radio directory temporarily unavailable'})}}
};

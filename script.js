const API="https://vrc.lol";
const $=id=>document.getElementById(id);
const form=$("form"), status=$("status"), result=$("result");

function message(text,error=false){status.hidden=!text;status.textContent=text||"";status.className="status"+(error?" error":"")}

form.addEventListener("submit",async e=>{
  e.preventDefault();
  const username=$("username").value.trim().replace(/^@+/,"");
  if(!username)return;
  const btn=$("search");btn.disabled=true;btn.textContent="Searching…";
  result.hidden=true;message("Looking up Bedrock profile…");
  try{
    const url=`${API}/minecraft-api?username=${encodeURIComponent(username)}&type=bedrock`;
    const r=await fetch(url,{headers:{Accept:"application/json"}});
    if(!r.ok)throw new Error(`API request failed (${r.status})`);
    const data=await r.json();
    if(data.success===false)throw new Error(data.message||"Player not found.");
    const p=data.bedrock||data.profile?.bedrock;
    if(!p)throw new Error("No Bedrock profile was returned.");
    const name=p.username||p.gamertag||username;
    const xuid=p.xuid_decimal||p.xuid||"Not available";
    const skin=p.skin_url||p.skinUrl||`${API}/skin?username=${encodeURIComponent(username)}&type=bedrock`;
    $("name").textContent=name;$("dname").textContent=name;
    $("xuid").textContent=`XUID: ${xuid}`;$("dxuid").textContent=xuid;
    $("skin").src=skin;$("skin").alt=`${name}'s Minecraft Bedrock skin`;
    $("download").href=skin;$("download").download=`${name.replace(/[^\w.-]+/g,"_")}-bedrock-skin.png`;
    $("raw").href=skin;$("json").textContent=JSON.stringify(data,null,2);
    result.hidden=false;message("");
    $("skin").onerror=()=>message("Profile found, but the skin could not be retrieved. The skin may be private, Marketplace-only, or unavailable through the API.",true);
  }catch(err){message(err.message||"Lookup failed.",true)}
  finally{btn.disabled=false;btn.textContent="Search"}
});

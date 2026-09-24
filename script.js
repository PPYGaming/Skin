const API = "https://vrc.lol";
const $ = id => document.getElementById(id);
const form = $("form"), status = $("status"), result = $("result");
let currentSkinUrl = "";
let downloadObjectUrl = "";

function message(text, error = false) {
  status.hidden = !text;
  status.textContent = text || "";
  status.className = "status" + (error ? " error" : "");
}

function cleanName(name) {
  return name.replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "bedrock-skin";
}

async function getJson(url) {
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  let data = null;
  try { data = await r.json(); } catch (_) {}
  if (!r.ok) {
    const detail = data?.message || data?.error || "";
    const err = new Error(`API request failed (${r.status})${detail ? `: ${detail}` : ""}`);
    err.status = r.status;
    throw err;
  }
  return data;
}

async function lookupBedrock(identifier) {
  const query = encodeURIComponent(identifier);
  const baseUrl = `${API}/minecraft-api?username=${query}&type=bedrock`;
  try {
    return await getJson(baseUrl);
  } catch (err) {
    // VRC.LOL supports a refresh request for profiles that are not currently cached.
    // It is deliberately a one-time fallback so the page does not spam the service.
    if (err.status !== 404) throw err;
    return await getJson(`${baseUrl}&update=true`);
  }
}

async function makeDownloadLink(url, name) {
  if (downloadObjectUrl) URL.revokeObjectURL(downloadObjectUrl);
  const r = await fetch(url, { mode: "cors" });
  if (!r.ok) throw new Error(`Skin download failed (${r.status})`);
  const blob = await r.blob();
  downloadObjectUrl = URL.createObjectURL(blob);
  const a = $("download");
  a.href = downloadObjectUrl;
  a.download = `${cleanName(name)}-bedrock-skin.png`;
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const username = $("username").value.trim().replace(/^@+/, "");
  if (!username) return;

  const btn = $("search");
  btn.disabled = true;
  btn.textContent = "Searching…";
  result.hidden = true;
  message("Looking up Xbox / Minecraft Bedrock profile…");

  try {
    const data = await lookupBedrock(username);
    if (data?.success === false) throw new Error(data.message || data.error || "Player not found.");

    const p = data?.bedrock || data?.profile?.bedrock;
    if (!p) throw new Error("No Bedrock profile was returned for this Xbox gamertag or XUID.");

    const name = p.username || p.gamertag || username;
    const xuid = p.xuid_decimal || p.xuid || "Not available";
    const skin = p.skin_url || p.skinUrl || `${API}/skin?username=${encodeURIComponent(username)}&type=bedrock`;

    $("name").textContent = name;
    $("dname").textContent = name;
    $("xuid").textContent = `XUID: ${xuid}`;
    $("dxuid").textContent = xuid;
    $("skin").alt = `${name}'s Minecraft Bedrock skin`;
    $("skinUrl").textContent = skin;
    $("dimensions").textContent = "Checking…";
    $("raw").href = skin;
    $("json").textContent = JSON.stringify(data, null, 2);
    currentSkinUrl = skin;

    $("skin").onload = () => {
      const w = $("skin").naturalWidth;
      const h = $("skin").naturalHeight;
      $("dimensions").textContent = `${w}×${h} PNG`;
      if ((w === 128 && h === 128) || (w === 64 && h === 64) || (w === 64 && h === 32)) {
        $("formatStatus").textContent = "Bedrock-compatible skin format";
      } else {
        $("formatStatus").textContent = "Image retrieved; size may not be a standard Bedrock skin format";
      }
      makeDownloadLink(currentSkinUrl, name).catch(() => {
        // Cross-origin download may be blocked; keep the raw image link usable.
        const a = $("download");
        a.href = currentSkinUrl;
        a.removeAttribute("download");
      });
    };
    $("skin").onerror = () => {
      message("Xbox profile found, but the skin image could not be retrieved. This can happen with private, Marketplace-only, or unavailable skins.", true);
    };
    result.hidden = false;
    message("");
    $("skin").src = skin;
  } catch (err) {
    message(err.message || "Lookup failed.", true);
  } finally {
    btn.disabled = false;
    btn.textContent = "Search";
  }
});

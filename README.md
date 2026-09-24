# Bedrock Skin Downloader

Static Minecraft Bedrock skin lookup website for Xbox gamertags and Bedrock XUIDs.

## API

This build uses the VRC.LOL Minecraft Profile API only (no direct GeyserMC API calls):
- `GET https://vrc.lol/minecraft-api?username=GAMERTAG&type=bedrock`
- If the profile is not cached, it makes one refresh request with `&update=true`.
- Skin PNG: `GET https://vrc.lol/skin?username=GAMERTAG&type=bedrock`

The API documentation currently lists gamertag/XUID input, Bedrock lookup, skin PNG output, and CORS-enabled browser use. HTTP 404 means the requested profile/asset is not available from the service; the page now reports the API message and performs a single refresh attempt.

## 128×128 support

The site preserves the returned Bedrock PNG and detects its actual dimensions. Standard Bedrock skin sizes such as 128×128, 64×64, and 64×32 are accepted and shown in the result.

Files:
- `index.html`
- `script.js`
- `style.css`

Upload these files to GitHub Pages or another static web host.

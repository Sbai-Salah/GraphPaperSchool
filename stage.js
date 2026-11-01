// The little cartoon crew that lives behind the notebook page.
// Pure markup and CSS animation (see style.css). Nothing here touches student data.
const stage = document.createElement("div");
stage.className = "stage";
stage.setAttribute("aria-hidden", "true");
stage.innerHTML = `
  <div class="plane">
    <svg viewBox="0 0 110 40" width="110" height="40" focusable="false">
      <path d="M2 34 q12 -14 24 -3 t24 -9" fill="none" stroke="#6f7f9f" stroke-width="2" stroke-dasharray="3 5" stroke-linecap="round"/>
      <polygon points="50,22 106,4 74,24" fill="#fff" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="74,24 106,4 80,37" fill="#dce6f7" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  </div>

  <div class="pencil">
    <svg class="hop" viewBox="0 0 44 92" width="44" height="92" focusable="false">
      <polygon points="12,22 32,22 22,2" fill="#e8c79a" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="19,9.5 25,9.5 22,2" fill="#333"/>
      <rect x="12" y="22" width="20" height="44" fill="#f2c230" stroke="#222" stroke-width="2"/>
      <rect x="12" y="66" width="20" height="6" fill="#b9bfc7" stroke="#222" stroke-width="2"/>
      <rect x="12" y="72" width="20" height="10" rx="2" fill="#ee8e9a" stroke="#222" stroke-width="2"/>
      <circle cx="18" cy="38" r="2.4" fill="#222"/>
      <circle cx="26" cy="38" r="2.4" fill="#222"/>
      <path d="M17 46 Q22 51 27 46" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 46 L4 54" stroke="#222" stroke-width="2" stroke-linecap="round"/>
      <path class="wave" d="M32 46 L40 38" stroke="#222" stroke-width="2" stroke-linecap="round"/>
      <path d="M17 82 L15 90 M27 82 L29 90" stroke="#222" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </div>

  <div class="eraser">
    <svg viewBox="0 0 72 56" width="72" height="56" focusable="false">
      <rect x="2" y="6" width="68" height="44" rx="10" fill="#ee8e9a" stroke="#222" stroke-width="2"/>
      <path d="M44 6 H60 a10 10 0 0 1 10 10 V40 a10 10 0 0 1 -10 10 H44 Z" fill="#5b7fd6" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
      <g class="eyes">
        <circle cx="16" cy="24" r="6" fill="#fff" stroke="#222" stroke-width="2"/>
        <circle cx="32" cy="24" r="6" fill="#fff" stroke="#222" stroke-width="2"/>
        <circle cx="18" cy="25" r="2.4" fill="#222"/>
        <circle cx="34" cy="25" r="2.4" fill="#222"/>
      </g>
      <path d="M17 38 Q24 43 31 38" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </div>
`;
document.body.prepend(stage);

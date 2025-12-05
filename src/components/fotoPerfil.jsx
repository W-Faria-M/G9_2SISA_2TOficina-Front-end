import React, { useState, useEffect } from "react";
import PopupSucesso from './PopupSucesso';
import PopupErro from './PopupErro';

export default function FotoPerfil({ usuarioId, apiBase = 'http://localhost:8080' }) {
  // estados para cada atributo do avatar
  const [topType, setTopType] = useState("");
  const [accessoriesType, setAccessoriesType] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [facialHairType, setFacialHairType] = useState("");
  const [facialHairColor, setFacialHairColor] = useState("");
  const [clotheType, setClotheType] = useState("");
  const [clotheColor, setClotheColor] = useState("");
  const [eyeType, setEyeType] = useState("");
  const [eyebrowType, setEyebrowType] = useState("");
  const [mouthType, setMouthType] = useState("");
  const [skinColor, setSkinColor] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [serverAvatarUrl, setServerAvatarUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [avatarId, setAvatarId] = useState(null);
  const [popupSucesso, setPopupSucesso] = useState({ show: false, mensagem: "" });
  const [popupErro, setPopupErro] = useState({ show: false, mensagem: "" });  // opções básicas (pode ser estendido conforme necessidade)
  const [TOP_OPTIONS, setTopOptions] = useState(["NoHair", "Hat", "ShortHairShortFlat", "LongHairStraight", "Hijab"]);
  const [ACCESSORIES_OPTIONS, setAccessoriesOptions] = useState(["Blank", "Sunglasses", "Prescription02", "Kurt"]);
  const [HAIR_COLORS, setHairColors] = useState(["Black", "BrownDark", "Brown", "Blonde", "Red"]);
  const [FACIAL_HAIR, setFacialHairOptions] = useState(["Blank", "BeardLight", "BeardMagestic", "MoustacheFancy"]);
  const [FACIAL_HAIR_COLORS, setFacialHairColors] = useState(["BrownDark", "Brown", "Black", "Blonde"]);
  const [CLOTHE_TYPES, setClotheTypes] = useState(["Hoodie", "BlazerShirt", "ShirtCrewNeck", "Overall"]);
  const [CLOTHE_COLORS, setClotheColors] = useState(["PastelOrange", "Blue01", "Gray02", "Black"]);
  const [EYE_TYPES, setEyeTypes] = useState(["Default", "Happy", "Wink", "Surprised"]);
  const [EYEBROW_TYPES, setEyebrowTypes] = useState(["Default", "RaisedExcited", "SadConcerned"]);
  const [MOUTH_TYPES, setMouthTypes] = useState(["Default", "Smile", "Serious", "Twinkle"]);
  const [SKIN_COLORS, setSkinColors] = useState(["Light", "Tanned", "Brown", "DarkBrown", "Pale"]);

  const avatarUrl = `https://avataaars.io/?avatarStyle=Transparent&topType=${encodeURIComponent(
    topType
  )}&accessoriesType=${encodeURIComponent(accessoriesType)}&hairColor=${encodeURIComponent(
    hairColor
  )}&facialHairType=${encodeURIComponent(facialHairType)}&facialHairColor=${encodeURIComponent(
    facialHairColor
  )}&clotheType=${encodeURIComponent(clotheType)}&clotheColor=${encodeURIComponent(
    clotheColor
  )}&eyeType=${encodeURIComponent(eyeType)}&eyebrowType=${encodeURIComponent(
    eyebrowType
  )}&mouthType=${encodeURIComponent(mouthType)}&skinColor=${encodeURIComponent(skinColor)}`;

  // backup temporário para cancelar alterações na modal
  const [temp, setTemp] = useState({});

  console.log('Rendering FotoPerfil with avatarUrl:', avatarUrl);
  console.debug('[fotoPerfil] props', { usuarioId, apiBase });
  // carregar avatar do endpoint /{usuarioId}/avatar (GET) ou usar localStorage como fallback
  useEffect(() => {
    let mounted = true;
    async function load() {
      function applyAvatarData(raw) {
        if (!raw) return false;
        // deep-search helper: look for any of candidate keys anywhere in the object
        const deepFind = (obj, candidates) => {
          if (!obj || typeof obj !== 'object') return undefined;
          for (const k of Object.keys(obj)) {
            if (candidates.includes(k)) return obj[k];
          }
          // recurse
          for (const k of Object.keys(obj)) {
            try {
              const v = obj[k];
              if (v && typeof v === 'object') {
                const found = deepFind(v, candidates);
                if (found !== undefined) return found;
              }
            } catch (e) {
              // ignore
            }
          }
          return undefined;
        };

        // flatten common containers and arrays to increase chance of matching
        let src = raw;
        if (raw.avatar) src = raw.avatar;
        else if (raw.data) src = raw.data;
        else if (raw.result) src = raw.result;
        if (Array.isArray(src) && src.length) src = src[0];

        const mapping = {
          id: ['id', 'avatarId', 'avatar_id'],
          usuarioId: ['usuarioId', 'userId', 'usuario_id'],
          topType: ['topType', 'top_type', 'top'],
          accessoriesType: ['accessoriesType', 'accessories_type', 'accessories'],
          hairColor: ['hairColor', 'hair_color', 'hairColorValue', 'hair_color_value'],
          facialHairType: ['facialHairType', 'facial_hair_type', 'facialHair', 'facial_hair'],
          facialHairColor: ['facialHairColor', 'facial_hair_color'],
          clotheType: ['clotheType', 'clothe_type', 'clothe'],
          clotheColor: ['clotheColor', 'clothe_color'],
          eyeType: ['eyeType', 'eye_type', 'eyes'],
          eyebrowType: ['eyebrowType', 'eyebrow_type'],
          mouthType: ['mouthType', 'mouth_type'],
          skinColor: ['skinColor', 'skin_color', 'skinTone', 'skin_tone'],
          avatarUrl: ['avatarUrl', 'url', 'avatar_url'],
        };

        let applied = false;
        try {
          const values = {};
          for (const field of Object.keys(mapping)) {
            const val = deepFind(src, mapping[field]);
            if (val !== undefined) values[field] = val;
          }

          // apply values to state if present
          if (values.id) { setAvatarId(values.id); applied = true; }
          if (values.usuarioId) { /* usuarioId comes from prop; nothing to override */ applied = true; }
          if (values.topType) { setTopType(values.topType); applied = true; }
          if (values.accessoriesType) { setAccessoriesType(values.accessoriesType); applied = true; }
          if (values.hairColor) { setHairColor(values.hairColor); applied = true; }
          if (values.facialHairType) { setFacialHairType(values.facialHairType); applied = true; }
          if (values.facialHairColor) { setFacialHairColor(values.facialHairColor); applied = true; }
          if (values.clotheType) { setClotheType(values.clotheType); applied = true; }
          if (values.clotheColor) { setClotheColor(values.clotheColor); applied = true; }
          if (values.eyeType) { setEyeType(values.eyeType); applied = true; }
          if (values.eyebrowType) { setEyebrowType(values.eyebrowType); applied = true; }
          if (values.mouthType) { setMouthType(values.mouthType); applied = true; }
          if (values.skinColor) { setSkinColor(values.skinColor); applied = true; }
          if (values.avatarUrl) { setServerAvatarUrl(values.avatarUrl); applied = true; }
          if (applied) setLoaded(true);
          console.debug('[fotoPerfil] applied avatar values', values, 'from raw:', raw);
        } catch (e) {
          console.warn('[fotoPerfil] error applying avatar data', e, raw);
        }
        return applied;
      }
      // As opções de avatar são estáticas no frontend (não vêm do servidor).
      // Mantemos os arrays locais declarados nos useState iniciais acima.
      // primeiro: se não há usuarioId, carregar do localStorage e sair
        // if no usuarioId provided we cannot load from server — abort
        if (!usuarioId) {
          setError('usuarioId ausente; impossível carregar avatar do servidor.');
          return;
        }

      setLoading(true);
      setError(null);
      const base = apiBase.replace(/\/$/, '') || 'http://localhost:8080';
      // Prioritize the known endpoint then fall back to a few sensible alternatives
      const endpointsToTry = [
        `${base}/usuarios/${usuarioId}/avatar`,
        `${base}/${usuarioId}/avatar`,
        `/${usuarioId}/avatar`,
        `/usuarios/${usuarioId}/avatar`,
      ];

      let lastErr = null;
      for (const url of endpointsToTry) {
        try {
          console.debug('[fotoPerfil] tentando GET', url);
          const r = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
          if (!r.ok) throw new Error(`Status ${r.status}`);
          const j = await r.json().catch(() => ({}));
          const d = j || {};
          // try to apply avatar fields from any response shape
          const applied = applyAvatarData(d);
          if (!mounted) return;
          if (!applied) {
            // previous behavior: try to set fields directly if keys exist
            setTopType(d.topType || d.top_type || d.top || topType);
            setAccessoriesType(d.accessoriesType || d.accessories_type || d.accessories || accessoriesType);
            setHairColor(d.hairColor || d.hair_color || d.hair || hairColor);
            setFacialHairType(d.facialHairType || d.facial_hair_type || d.facialHair || facialHairType);
            setFacialHairColor(d.facialHairColor || d.facial_hair_color || facialHairColor);
            setClotheType(d.clotheType || d.clothe_type || d.clothe || clotheType);
            setClotheColor(d.clotheColor || d.clothe_color || clotheColor);
            setEyeType(d.eyeType || d.eye_type || d.eyes || eyeType);
            setEyebrowType(d.eyebrowType || d.eyebrow_type || eyebrowType);
            setMouthType(d.mouthType || d.mouth_type || mouthType);
            setSkinColor(d.skinColor || d.skin_color || d.skinTone || skinColor);
            setLoaded(true);
          }
          setLoading(false);
          setError(null);
          return;
        } catch (err) {
          lastErr = err;
          console.warn('[fotoPerfil] erro ao tentar', url, err);
          // tentar próximo endpoint
        }
      }

      // se chegou aqui, todos attempts falharam — usar localStorage como fallback
      try {
        const raw = localStorage.getItem("avatarPrefs");
        if (raw) {
              const d = JSON.parse(raw) || {};
              // try to normalize localStorage schema too
              const appliedLocal = (function(){
                try { return applyAvatarData(d); } catch(e){ return false; }
              })();
              if (!appliedLocal) {
                if (d.avatarUrl || d.url) setServerAvatarUrl(d.avatarUrl || d.url);
                if (!mounted) return;
                setTopType(d.topType || d.top_type || d.top || topType);
                setAccessoriesType(d.accessoriesType || d.accessories_type || d.accessories || accessoriesType);
                setHairColor(d.hairColor || d.hair_color || d.hair || hairColor);
                setFacialHairType(d.facialHairType || d.facial_hair_type || d.facialHair || facialHairType);
                setFacialHairColor(d.facialHairColor || d.facial_hair_color || facialHairColor);
                setClotheType(d.clotheType || d.clothe_type || d.clothe || clotheType);
                setClotheColor(d.clotheColor || d.clothe_color || clotheColor);
                setEyeType(d.eyeType || d.eye_type || d.eyes || eyeType);
                setEyebrowType(d.eyebrowType || d.eyebrow_type || eyebrowType);
                setMouthType(d.mouthType || d.mouth_type || mouthType);
                setSkinColor(d.skinColor || d.skin_color || d.skinTone || skinColor);
              }
              setLoaded(true);
            }
      } catch (e) {
        console.warn('Erro no fallback localStorage', e, lastErr);
      }
      setError('Não foi possível carregar avatar do servidor; usando dados locais.');
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [usuarioId, apiBase]);

  function openModal() {
    setTemp({
      topType,
      accessoriesType,
      hairColor,
      facialHairType,
      facialHairColor,
      clotheType,
      clotheColor,
      eyeType,
      eyebrowType,
      mouthType,
      skinColor,
    });
    setModalOpen(true);
  }

  function cancelModal() {
    // restaurar do temp e fechar
    setTopType(temp.topType);
    setAccessoriesType(temp.accessoriesType);
    setHairColor(temp.hairColor);
    setFacialHairType(temp.facialHairType);
    setFacialHairColor(temp.facialHairColor);
    setClotheType(temp.clotheType);
    setClotheColor(temp.clotheColor);
    setEyeType(temp.eyeType);
    setEyebrowType(temp.eyebrowType);
    setMouthType(temp.mouthType);
    setSkinColor(temp.skinColor);
    setModalOpen(false);
  }

  async function saveModal() {
    setSaving(true);
    const data = {
      // include id if available so backend can update existing record
      ...(avatarId ? { id: avatarId } : {}),
      usuarioId: typeof usuarioId === 'string' && /^\\d+$/.test(usuarioId) ? Number(usuarioId) : usuarioId,
      avatarStyle: 'Transparent',
      topType,
      accessoriesType,
      hairColor,
      facialHairType,
      facialHairColor,
      clotheType,
      clotheColor,
      eyeType,
      eyebrowType,
      mouthType,
      skinColor,
    };
    // no local persistence: require usuarioId to save to server
    if (!usuarioId) {
      setPopupErro({ show: true, mensagem: "Impossível salvar: usuário não identificado." });
      setSaving(false);
      return;
    }    const base = apiBase.replace(/\/$/, '') || 'http://localhost:8080';
    const endpointsToTry = [
      `${base}/usuarios/${usuarioId}/avatar`,
      `${base}/${usuarioId}/avatar`,
      `/${usuarioId}/avatar`,
      `/usuarios/${usuarioId}/avatar`,
    ];

    console.debug('[fotoPerfil] saveModal starting', { usuarioId, data, endpointsToTry });

    let saved = false;
    let lastErr = null;
    for (const url of endpointsToTry) {
      try {
        console.debug('[fotoPerfil] attempting PUT', url, data);
        const r = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data),
        });

        let resp = null;
        try {
          resp = await r.json().catch(() => null);
        } catch (e) {
          // non-json response
          resp = null;
        }

        console.debug('[fotoPerfil] PUT response', { url, status: r.status, ok: r.ok, body: resp });

        if (!r.ok) {
          // log body for debugging
          const text = await r.text().catch(() => null);
          console.error('[fotoPerfil] PUT failed', { url, status: r.status, text });
          lastErr = new Error(`PUT ${url} failed with status ${r.status}`);
          // try next endpoint
          continue;
        }

        // success
        if (resp && (resp.avatarUrl || resp.url)) {
          setServerAvatarUrl(resp.avatarUrl || resp.url);
          console.debug('[fotoPerfil] server provided avatarUrl', resp.avatarUrl || resp.url);
        }
        saved = true;
        break;
      } catch (err) {
        lastErr = err;
        console.error('[fotoPerfil] network/error on PUT', { url, err });
        // tentar próximo endpoint
      }
    }

    if (saved) {
      setPopupSucesso({ show: true, mensagem: "Avatar salvo com sucesso no servidor." });
    } else {
      console.error('Falha ao salvar avatar no servidor:', lastErr);
      setPopupErro({ show: true, mensagem: "Não foi possível salvar o avatar. Tente novamente." });
    }    setSaving(false);
    setModalOpen(false);
  }

  return (
    <>
			<div className="relative mb-4!">
				<div className="w-40 h-40 rounded-full overflow-hidden border-2 border-[#F27405] bg-[#2B2B2B] p-1 relative z-10">
					<img src={serverAvatarUrl || avatarUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
				</div>

        {/* Botão de editar*/}
        <button
          onClick={openModal}
          className="absolute bottom-0 right-0 bg-[#2B2B2B] p-1.5! rounded-full! text-[#F27405] shadow-md hover:scale-105! transition! z-20"
        >
          ✏️
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="bg-[#0b0b0b] rounded-lg w-[95%] max-w-4xl p-8 border-l-4 border-[#F27405] shadow-xl max-h-[85vh] overflow-auto ">
            <h3 className="text-2xl font-semibold mb-4 text-[#F27405] text-center">Redefinir avatar</h3>
                {/* Preview do avatar */}
								<div className="flex justify-center mb-4">
									<div className="w-40 h-40 rounded-full overflow-hidden border-2 border-[#F27405] bg-[#2B2B2B] p-1">
										<img src={serverAvatarUrl || avatarUrl} alt="Preview avatar" className="w-full h-full object-cover" />
									</div>
								</div>
            <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-auto text-white">
              <label className="block">
                Top Type
								<select value={topType} onChange={(e) => setTopType(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {TOP_OPTIONS.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Accessories
								<select value={accessoriesType} onChange={(e) => setAccessoriesType(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {ACCESSORIES_OPTIONS.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Hair Color
								<select value={hairColor} onChange={(e) => setHairColor(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {HAIR_COLORS.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Facial Hair
								<select value={facialHairType} onChange={(e) => setFacialHairType(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {FACIAL_HAIR.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Facial Hair Color
								<select value={facialHairColor} onChange={(e) => setFacialHairColor(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {FACIAL_HAIR_COLORS.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Clothe Type
								<select value={clotheType} onChange={(e) => setClotheType(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {CLOTHE_TYPES.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Clothe Color
								<select value={clotheColor} onChange={(e) => setClotheColor(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {CLOTHE_COLORS.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Eye Type
								<select value={eyeType} onChange={(e) => setEyeType(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {EYE_TYPES.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Eyebrow
								<select value={eyebrowType} onChange={(e) => setEyebrowType(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {EYEBROW_TYPES.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Mouth
								<select value={mouthType} onChange={(e) => setMouthType(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {MOUTH_TYPES.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Skin
								<select value={skinColor} onChange={(e) => setSkinColor(e.target.value)} className="w-full mt-1 bg-[#f7fafc] rounded-md border-2 border-[#F27405] px-2 py-1 text-sm text-black">
                  {SKIN_COLORS.map((o) => (
                    <option key={o} value={o} className="text-black">{o}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button className="px-4 py-2 border border-[#F27405] text-[#F27405] rounded" onClick={cancelModal}>
                Cancelar
              </button>
               <button
                 className="px-4 py-2 border border-[#10B981] text-[#10B981] rounded bg-transparent disabled:opacity-50"
                 onClick={saveModal}
                 disabled={saving}
               >
                 Salvar
               </button>
            </div>
          </div>
        </div>
      )}

      {popupSucesso.show && (
        <PopupSucesso
          mensagem={popupSucesso.mensagem}
          onClose={() => setPopupSucesso({ show: false, mensagem: "" })}
          darkMode={true}
        />
      )}
      {popupErro.show && (
        <PopupErro
          mensagem={popupErro.mensagem}
          onClose={() => setPopupErro({ show: false, mensagem: "" })}
          darkMode={true}
        />
      )}
    </>
  );
}


let id = document.getElementById("id");
let silid = document.getElementById("sil-id");
let ad = document.getElementById("ad");
let kateqoriya = document.getElementById("kateqoriya");
let baxis = document.getElementById("baxis");
let tarix = document.getElementById("tarix");

const API_URL = 'https://6ad0ef8caddc5b5cb1428a39.mockapi.io/product/news';

function gonder() {
  if (!ad || !ad.value.trim()) {
    alert("Zəhmət olmasa başlığı daxil edin!");
    if (ad) ad.focus();
    return;
  }

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      title: ad.value,
      category: kateqoriya ? kateqoriya.value : "",
      view: baxis ? baxis.value : 0,
      date: tarix ? tarix.value : "",
    }),
    headers: {
      'Content-type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(json => {
    alert("Xeber elave olundu " + json.id);
    terminalaYaz('POST', API_URL, 201, "Yeni xəbər əlavə olundu: ID #" + json.id);
    formuTemizle();
    melumatlariGetir();
  })
  .catch(err => {
    alert("Xəta baş verdi: " + err);
    terminalaYaz('POST', API_URL, 500, "Xəta: " + err);
  });
}

function deyis() {
  if (!id || !id.value.trim()) {
    alert("Dəyişmək üçün zəhmət olmasa ID daxil edin və ya cədvəldən seçin!");
    if (id) id.focus();
    return;
  }

  fetch(API_URL + '/' + id.value.trim(), {
    method: 'PUT',
    body: JSON.stringify({
      title: ad ? ad.value : "",
      category: kateqoriya ? kateqoriya.value : "",
      view: baxis ? baxis.value : 0,
      date: tarix ? tarix.value : "",
    }),
    headers: {
      'Content-type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    alert("Xeber deyishildi id:" + data.id);
    terminalaYaz('PUT', API_URL + '/' + data.id, 200, "Xəbər yeniləndi: ID #" + data.id);
    formuTemizle();
    melumatlariGetir();
  })
  .catch(err => {
    alert("Xəta baş verdi: " + err);
    terminalaYaz('PUT', API_URL + '/' + id.value, 500, "Xəta: " + err);
  });
}

function sil(silinecekId) {
  const hedefId = silinecekId || (id ? id.value.trim() : null) || (silid ? silid.value.trim() : null);
  if (!hedefId) {
    alert("Silmək üçün zəhmət olmasa ID daxil edin və ya cədvəldən seçin!");
    if (id) id.focus();
    return;
  }

  if (!confirm("ID #" + hedefId + " olan xəbəri silmək istədiyinizdən əminsiniz?")) {
    return;
  }

  fetch(API_URL + '/' + hedefId, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
    alert("Xeber silindi id: " + hedefId);
    terminalaYaz('DELETE', API_URL + '/' + hedefId, 200, "Xəbər silindi: ID #" + hedefId);
    if (id && id.value.trim() === String(hedefId)) {
      formuTemizle();
    }
    melumatlariGetir();
  })
  .catch(err => {
    alert("Silmə zamanı xəta: " + err);
    terminalaYaz('DELETE', API_URL + '/' + hedefId, 500, "Xəta: " + err);
  });
}

function melumatlariGetir() {
  const cedvelBedeni = document.getElementById("cedvel-bedeni");
  const umumiSay = document.getElementById("umumi-say");
  const saygac = document.getElementById("saygac");

  if (cedvelBedeni) {
    cedvelBedeni.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 25px; color: #888;">
          [ API-DƏN MƏLUMATLAR YÜKLƏNİR... ]
        </td>
      </tr>
    `;
  }

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      terminalaYaz('GET', API_URL, 200, data.length + " məlumat gətirildi");

      if (umumiSay) umumiSay.innerText = data.length;
      if (saygac) saygac.innerText = data.length;

      if (!cedvelBedeni) return;
      cedvelBedeni.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        cedvelBedeni.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 25px; color: #888;">
              [ HEÇ BİR MƏHSUL TAPILMADI ]
            </td>
          </tr>
        `;
        return;
      }

      data.forEach(item => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td class="sutun-id">[ #${item.id} ]</td>
          <td class="sutun-ad">
            <div style="font-weight: 700;">${metniQoru(item.title || "Ad yoxdur")}</div>
            <small style="color: #888; font-size: 11px;">Kat: ${metniQoru(item.category || "Ümumi")} | Baxış: ${item.view || 0}</small>
          </td>
          <td class="sutun-tarix">${item.date || "Tarix yoxdur"}</td>
          <td class="sutun-qelem">
            <button type="button" class="emeliyyat-duymesi" title="Redaktə et (Qələm)" onclick="redakteEt('${item.id}', '${atributuQoru(item.title)}', '${atributuQoru(item.category)}', '${item.view || 0}', '${item.date || ""}')">
              <svg class="vektor-ikon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            </button>
          </td>
          <td class="sutun-qab">
            <button type="button" class="emeliyyat-duymesi" title="Sil (Zibil qutusu)" onclick="sil('${item.id}')">
              <svg class="vektor-ikon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </td>
        `;

        cedvelBedeni.appendChild(tr);
      });
    })
    .catch(err => {
      if (cedvelBedeni) {
        cedvelBedeni.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 25px; color: #ff5555;">
              [ API XƏTASI: ${err.message} ]
            </td>
          </tr>
        `;
      }
      terminalaYaz('GET', API_URL, 500, "Xəta: " + err);
    });
}

function redakteEt(setirId, setirAd, setirKat, setirBaxis, setirTarix) {
  if (id) id.value = setirId;
  if (silid) silid.value = setirId;
  if (ad) ad.value = setirAd;
  if (kateqoriya) kateqoriya.value = setirKat;
  if (baxis) baxis.value = setirBaxis;
  if (tarix) tarix.value = setirTarix;

  canliPayloadGoster();
  if (ad) ad.focus();
}

function formuTemizle() {
  if (id) id.value = "";
  if (silid) silid.value = "";
  if (ad) ad.value = "";
  if (kateqoriya) kateqoriya.value = "";
  if (baxis) baxis.value = "";
  if (tarix) {
    tarix.value = new Date().toISOString().split('T')[0];
  }

  canliPayloadGoster();
}

function canliPayloadGoster() {
  const jsonOnbaxis = document.getElementById("json-onbaxis");
  if (!jsonOnbaxis) return;

  const melumat = {
    id: id ? id.value : "",
    title: ad ? ad.value : "",
    category: kateqoriya ? kateqoriya.value : "",
    view: baxis ? baxis.value : "",
    date: tarix ? tarix.value : "",
  };

  jsonOnbaxis.textContent = JSON.stringify(melumat, null, 2);
}

function terminalaYaz(metod, unvan, status, mesaj) {
  const terminalYazilari = document.getElementById("terminal-yazilari");
  if (!terminalYazilari) return;

  const setir = document.createElement("div");
  setir.className = "jurnal-setri";
  setir.innerHTML = `
    <span class="jurnal-metodu">[${metod}]</span>
    <span>${unvan}</span>
    <span>STATUS: ${status}</span>
    <span>>> ${mesaj}</span>
    <span style="margin-left:auto; color:#666;">${new Date().toLocaleTimeString()}</span>
  `;
  terminalYazilari.prepend(setir);
}

function metniQoru(metn) {
  if (!metn) return "";
  return String(metn)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function atributuQoru(metn) {
  if (!metn) return "";
  return String(metn)
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;');
}

document.addEventListener("DOMContentLoaded", () => {
  if (tarix && !tarix.value) {
    tarix.value = new Date().toISOString().split('T')[0];
  }

  [id, ad, kateqoriya, baxis, tarix].forEach(element => {
    if (element) {
      element.addEventListener("input", () => {
        if (element === id && silid) silid.value = id.value;
        canliPayloadGoster();
      });
      element.addEventListener("change", () => {
        if (element === id && silid) silid.value = id.value;
        canliPayloadGoster();
      });
    }
  });

  const axtarisXanasi = document.getElementById("axtaris-xanasi");
  if (axtarisXanasi) {
    axtarisXanasi.addEventListener("input", (e) => {
      const sorgu = e.target.value.toLowerCase().trim();
      const setirler = document.querySelectorAll("#cedvel-bedeni tr");
      setirler.forEach(s => {
        const mezmun = s.textContent.toLowerCase();
        s.style.display = mezmun.includes(sorgu) ? "" : "none";
      });
    });
  }

  const duymeElaveEt = document.getElementById("duyme-elave-et");
  if (duymeElaveEt) {
    duymeElaveEt.addEventListener("click", () => {
      formuTemizle();
      if (ad) ad.focus();
    });
  }

  canliPayloadGoster();
  melumatlariGetir();
});

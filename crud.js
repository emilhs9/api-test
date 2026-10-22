let id = document.getElementById("id");
let silid = document.getElementById("sil-id");
let ad = document.getElementById("ad");
let kateqoriya = document.getElementById("kateqoriya");
let baxis = document.getElementById("baxis");
let tarix = document.getElementById("tarix");

const API_URL = 'https://6ad0ef8caddc5b5cb1428a39.mockapi.io/product/news';

function gonder() {
  if (!ad || !ad.value.trim()) {
    alert("Please enter a title!");
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
    alert("News added: ID #" + json.id);
    terminalaYaz('POST', API_URL, 201, "New item created: ID #" + json.id);
    formuTemizle();
    melumatlariGetir();
  })
  .catch(err => {
    alert("Error occurred: " + err);
    terminalaYaz('POST', API_URL, 500, "Error: " + err);
  });
}

function deyis() {
  if (!id || !id.value.trim()) {
    alert("Please enter an ID or select a row using [EDIT]!");
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
    alert("News updated: ID #" + data.id);
    terminalaYaz('PUT', API_URL + '/' + data.id, 200, "Item updated: ID #" + data.id);
    formuTemizle();
    melumatlariGetir();
  })
  .catch(err => {
    alert("Error occurred: " + err);
    terminalaYaz('PUT', API_URL + '/' + id.value, 500, "Error: " + err);
  });
}

function sil(silinecekId) {
  const hedefId = silinecekId || (id ? id.value.trim() : null) || (silid ? silid.value.trim() : null);
  if (!hedefId) {
    alert("Please enter an ID or select a row using [DELETE]!");
    if (id) id.focus();
    return;
  }

  if (!confirm("Are you sure you want to delete item with ID #" + hedefId + "?")) {
    return;
  }

  fetch(API_URL + '/' + hedefId, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
    alert("News deleted: ID #" + hedefId);
    terminalaYaz('DELETE', API_URL + '/' + hedefId, 200, "Item deleted: ID #" + hedefId);
    if (id && id.value.trim() === String(hedefId)) {
      formuTemizle();
    }
    melumatlariGetir();
  })
  .catch(err => {
    alert("Deletion error: " + err);
    terminalaYaz('DELETE', API_URL + '/' + hedefId, 500, "Error: " + err);
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
          [ LOADING DATA FROM API... ]
        </td>
      </tr>
    `;
  }

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      terminalaYaz('GET', API_URL, 200, data.length + " items loaded");

      if (umumiSay) umumiSay.innerText = data.length;
      if (saygac) saygac.innerText = data.length;

      if (!cedvelBedeni) return;
      cedvelBedeni.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        cedvelBedeni.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 25px; color: #888;">
              [ NO PRODUCTS FOUND ]
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
            <div style="font-weight: 700;">${metniQoru(item.title || "No Title")}</div>
            <small style="color: #888; font-size: 11px;">Cat: ${metniQoru(item.category || "General")} | Views: ${item.view || 0}</small>
          </td>
          <td class="sutun-tarix">${item.date || "N/A"}</td>
          <td class="sutun-qelem">
            <button type="button" class="emeliyyat-duymesi" title="Edit row" onclick="redakteEt('${item.id}', '${atributuQoru(item.title)}', '${atributuQoru(item.category)}', '${item.view || 0}', '${item.date || ""}')">
              EDIT
            </button>
          </td>
          <td class="sutun-qab">
            <button type="button" class="emeliyyat-duymesi" title="Delete row" onclick="sil('${item.id}')">
              DELETE
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
              [ API ERROR: ${err.message} ]
            </td>
          </tr>
        `;
      }
      terminalaYaz('GET', API_URL, 500, "Error: " + err);
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

  terminalYazilari.innerHTML = `
    <span class="jurnal-metodu">[${metod}]</span>
    <span>${unvan}</span>
    <span>STATUS: ${status}</span>
    <span>>> ${mesaj}</span>
    <span style="margin-left:auto; color:#666; padding-left:15px;">${new Date().toLocaleTimeString()}</span>
  `;
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

let id = document.getElementById("id");
let silid = document.getElementById("sil-id");
let ad = document.getElementById("ad");
let kateqoriya = document.getElementById("kateqoriya");
let baxis = document.getElementById("baxis");
let tarix = document.getElementById("tarix");

const API_URL = 'https://6ad0ef8caddc5b5cb1428a39.mockapi.io/product/news';
let cariMehsullar = [];

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
    alert("Item added: ID #" + json.id);
    formuTemizle();
    melumatlariGetir();
  })
  .catch(err => {
    alert("Error: " + err);
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
    alert("Item updated: ID #" + data.id);
    formuTemizle();
    melumatlariGetir();
  })
  .catch(err => {
    alert("Error: " + err);
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
    alert("Item deleted: ID #" + hedefId);
    if (id && id.value.trim() === String(hedefId)) {
      formuTemizle();
    }
    melumatlariGetir();
  })
  .catch(err => {
    alert("Error: " + err);
  });
}

function melumatlariGetir() {
  const cedvelBedeni = document.getElementById("cedvel-bedeni");

  if (cedvelBedeni) {
    cedvelBedeni.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 25px; color: #888;">
          [ LOADING DATA... ]
        </td>
      </tr>
    `;
  }

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      cariMehsullar = Array.isArray(data) ? data : [];
      if (!cedvelBedeni) return;
      cedvelBedeni.innerHTML = "";

      if (cariMehsullar.length === 0) {
        cedvelBedeni.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 25px; color: #888;">
              [ NO PRODUCTS FOUND ]
            </td>
          </tr>
        `;
        return;
      }

      cariMehsullar.forEach(item => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-id", item.id);

        if (id && id.value.trim() === String(item.id)) {
          tr.classList.add("secilmis-setir");
        }

        tr.innerHTML = `
          <td class="sutun-id">[ #${item.id} ]</td>
          <td class="sutun-ad">
            <div style="font-weight: 700;">${metniQoru(item.title || "No Title")}</div>
            <small style="color: #888; font-size: 11px;">${metniQoru(item.category || "General")} ${item.view ? `• Views: ${item.view}` : ""}</small>
          </td>
          <td class="sutun-tarix">${item.date || "N/A"}</td>
          <td class="sutun-qelem">
            <button type="button" class="emeliyyat-duymesi" onclick="redakteEt('${item.id}', '${atributuQoru(item.title)}', '${atributuQoru(item.category)}', '${item.view || 0}', '${item.date || ""}')">
              EDIT
            </button>
          </td>
          <td class="sutun-qab">
            <button type="button" class="emeliyyat-duymesi" onclick="sil('${item.id}')">
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
              [ ERROR: ${err.message} ]
            </td>
          </tr>
        `;
      }
    });
}

function idIleSecim(axtarilanId) {
  const setirler = document.querySelectorAll("#cedvel-bedeni tr");
  setirler.forEach(s => s.classList.remove("secilmis-setir"));

  if (!axtarilanId) return;

  const tapilanSetir = document.querySelector(`#cedvel-bedeni tr[data-id="${axtarilanId}"]`);
  if (tapilanSetir) {
    tapilanSetir.classList.add("secilmis-setir");
    tapilanSetir.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const mehsul = cariMehsullar.find(m => String(m.id) === String(axtarilanId));
    if (mehsul) {
      if (silid) silid.value = mehsul.id;
      if (ad) ad.value = mehsul.title || "";
      if (kateqoriya) kateqoriya.value = mehsul.category || "";
      if (baxis) baxis.value = mehsul.view || 0;
      if (tarix) tarix.value = mehsul.date || "";
    }
  }
}

function redakteEt(setirId, setirAd, setirKat, setirBaxis, setirTarix) {
  if (id) id.value = setirId;
  if (silid) silid.value = setirId;
  if (ad) ad.value = setirAd;
  if (kateqoriya) kateqoriya.value = setirKat;
  if (baxis) baxis.value = setirBaxis;
  if (tarix) tarix.value = setirTarix;

  idIleSecim(setirId);
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

  const setirler = document.querySelectorAll("#cedvel-bedeni tr");
  setirler.forEach(s => s.classList.remove("secilmis-setir"));
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

  if (id) {
    id.addEventListener("input", () => {
      idIleSecim(id.value.trim());
    });
  }

  const duymeElaveEt = document.getElementById("duyme-elave-et");
  if (duymeElaveEt) {
    duymeElaveEt.addEventListener("click", () => {
      formuTemizle();
      if (ad) ad.focus();
    });
  }

  melumatlariGetir();
});

const FELHASZNALOK = "http://localhost:3000/users";
 
const allapotElem = document.querySelector("#users-status");
const felhasznalokTablaTorze = document.querySelector("#users-table-body");
const ujFelhasznaloUrlap = document.querySelector("#new-user-form");
const hozzaadasGomb = document.querySelector("#add-user-button");
const szerkesztoSzekcio = document.querySelector("#edit-user-section");
const szerkesztoUrlap = document.querySelector("#edit-user-form");
const mentesGomb = document.querySelector("#save-user-changes-button");
const megszakitasGomb = document.querySelector("#cancel-edit-button");
 
function uzenetMegjelenitese(uzenet, tipus) {
    allapotElem.textContent = uzenet;
    allapotElem.className = `alert alert-${tipus}`;
}
 
function sorBeszurasa(felhasznalo) {
    const sor = document.createElement("tr");
    const ertekek = [felhasznalo.name, felhasznalo.email, felhasznalo.city, felhasznalo.phone, felhasznalo.role];
 
    ertekek.forEach((ertek) => {
        const cella = document.createElement("td");
        cella.textContent = ertek == null || ertek === "" ? "-" : String(ertek);
        sor.append(cella);
    });

    const muveletCella = document.createElement("td");
    const szerkesztesGomb = document.createElement("button");
    szerkesztesGomb.type = "button";
    szerkesztesGomb.className = "btn btn-outline-primary btn-sm";
    szerkesztesGomb.textContent = "Szerkesztés";
    szerkesztesGomb.disabled = felhasznalo.id == null;
    szerkesztesGomb.title = felhasznalo.id == null ? "Azonosító nélkül nem szerkeszthető" : "Felhasználó szerkesztése";
    szerkesztesGomb.addEventListener("click", () => szerkesztoMegnyitasa(felhasznalo));
    muveletCella.append(szerkesztesGomb);
    sor.append(muveletCella);
 
    felhasznalokTablaTorze.append(sor);
}

function szerkesztoMegnyitasa(felhasznalo) {
    for (const mezo of ["id", "name", "email", "city", "phone", "role"]) {
        szerkesztoUrlap.elements.namedItem(mezo).value = felhasznalo[mezo] ?? "";
    }

    szerkesztoSzekcio.hidden = false;
    szerkesztoSzekcio.scrollIntoView({ behavior: "smooth", block: "start" });
    szerkesztoUrlap.elements.namedItem("name").focus();
}

function szerkesztoBezara() {
    szerkesztoUrlap.reset();
    szerkesztoSzekcio.hidden = true;
}

megszakitasGomb.addEventListener("click", szerkesztoBezara);

szerkesztoUrlap.addEventListener("submit", async (esemeny) => {
    esemeny.preventDefault();
    mentesGomb.disabled = true;
    uzenetMegjelenitese("Felhasználó módosításainak mentése...", "info");

    const urlapAdatok = Object.fromEntries(new FormData(szerkesztoUrlap).entries());
    const felhasznaloId = urlapAdatok.id;
    delete urlapAdatok.id;

    try {
        const valasz = await fetch(`${FELHASZNALOK}/${encodeURIComponent(felhasznaloId)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(urlapAdatok)
        });

        if (!valasz.ok) {
            throw new Error(`A szerver ${valasz.status} hibát adott.`);
        }

        szerkesztoBezara();
        await listaFrissitese();
        uzenetMegjelenitese("A felhasználó adatai sikeresen módosítva.", "success");
    } catch (hiba) {
        uzenetMegjelenitese(`Nem sikerült módosítani a felhasználót: ${hiba.message}`, "danger");
    } finally {
        mentesGomb.disabled = false;
    }
});
 
async function listaFrissitese() {
    try {
        const valasz = await fetch(FELHASZNALOK);
 
        if (!valasz.ok) {
            throw new Error(`A szerver ${valasz.status} hibát adott.`);
        }
 
        const felhasznalok = await valasz.json();
 
        felhasznalokTablaTorze.replaceChildren();
 
        if (felhasznalok.length === 0) {
            throw new Error('Nincs megjelenitendő felhasználó')
            
        }
 
        felhasznalok.forEach(sorBeszurasa);
        uzenetMegjelenitese(`${felhasznalok.length} felhasználó betöltve.`, "success");
    } catch (hiba) {
        uzenetMegjelenitese(`Nem sikerült betölteni a felhasználókat: ${hiba.message}`, "danger");
    }
}
 
ujFelhasznaloUrlap.addEventListener("submit", async (esemeny) => {
    esemeny.preventDefault();
    hozzaadasGomb.disabled = true;
    uzenetMegjelenitese("Felhasználó mentése...", "info");

    const urlapAdatok = new FormData(ujFelhasznaloUrlap);
    const felhasznalo = Object.fromEntries(urlapAdatok.entries());

    try {
        const valasz = await fetch(FELHASZNALOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(felhasznalo)
        });

        if (!valasz.ok) {
            throw new Error(`A szerver ${valasz.status} hibát adott.`);
        }

        ujFelhasznaloUrlap.reset();
        await listaFrissitese();
        uzenetMegjelenitese("Az új felhasználó sikeresen hozzáadva.", "success");
    } catch (hiba) {
        uzenetMegjelenitese(`Nem sikerült hozzáadni a felhasználót: ${hiba.message}`, "danger");
    } finally {
        hozzaadasGomb.disabled = false;
    }
});
listaFrissitese()
 

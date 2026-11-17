const FELHASZNALOK = "http://localhost:3000/users";
 
const allapotElem = document.querySelector("#users-status");
const felhasznalokTablaTorze = document.querySelector("#users-table-body");
const ujFelhasznaloUrlap = document.querySelector("#new-user-form");
const hozzaadasGomb = document.querySelector("#add-user-button");
 
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
 
    felhasznalokTablaTorze.append(sor);
}
 
async function listaFrissitese() {
    try {
        const valasz = await fetch(FELHASZNALOK);
 
        if (!valasz.ok) {
            throw new Error(`A szerver ${valasz.status} hibát adott.`);
        }
 
        const felhasznalok = await valasz.json();
 
        felhasznalokTablaTorze.replaceChildren();
 
        if (felhasznalok.length === 0) {
            uzenetMegjelenitese("Nincs megjeleníthető felhasználó.", "secondary");
            return;
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
 

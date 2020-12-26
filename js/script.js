"use strict";

//HTML ajouter <main> et <header>
const main = document.createElement("main");
const header = document.createElement("header");
const body = document.body;
body.prepend(main);
body.prepend(header);
header.classList.add("text-center", "py-5");
main.classList.add("container");

//HTML ajouter enfant de <header>
const h1 = document.createElement("h1");
h1.textContent = "Veilles EthersJS";
header.prepend(h1);

//HTML ajouter enfants directs de <main>>
const pIntro = document.createElement("p");
const dateNow = moment();
const dateFormat = "dddd DD/MM/YYYY";
dateNow.locale("fr");
pIntro.textContent = `Bonjour! Nous sommes le ${dateNow.format(dateFormat)} 😊`;
pIntro.classList.add(
  "bg-primary",
  "rounded",
  "text-white",
  "py-3",
  "lead",
  "text-center"
);
main.prepend(pIntro);

//ajouter section qui regroupe les filtres et le tri
const filtreTri = document.createElement("section");
filtreTri.id = "filtre-tri";
filtreTri.classList.add("row", "row-cols-1", "row-cols-md-2", "row-cols-xl-3");
pIntro.after(filtreTri);

const filtreAVenir = document.createElement("div");
filtreAVenir.id = "filtreAVenir";
filtreAVenir.classList.add("col", "mb-3");
filtreAVenir.innerHTML = `<div class = "input-group">
<div class="input-group-text">
<input class="form-check-input" type="checkbox" id="toCome" name="toCome" aria-label="voir seulement les veilles a venir"/>
</div>
<label for="toCome" class="input-group-text form-control bg-white text-dark">
Afficher uniquement des veilles à venir
</label>
</div>`;

const tri = document.createElement("div");
tri.id = "tri";
tri.classList.add("col", "mb-3");
tri.innerHTML = `<div class="input-group"><label for="optionsTri" class="input-group-text text-dark">Trier</label>
<select id="optionsTri" name="optionsTri" class="form-select text-dark">
  <option value="par-date" class="bg-secondary text-white" selected>par date</option>
  <option value="alpha" class="bg-secondary text-white">de A à Z</option>
  <option value="alpha-reverse" class="bg-secondary text-white">de Z à A</option>
</select>
</div>`;

const filtreCategories = document.createElement("div");
filtreCategories.id = "filtreCategories";
filtreCategories.classList.add("col", "mb-3");
filtreCategories.innerHTML = `<div class="input-group">
<label for="filCat" class="input-group-text text-dark">Catégories</label>
<select id="filCat" name="filCat" class="form-select text-dark">
<option value="toutes" class="bg-secondary text-white" selected>toutes</option>
</select>
</div>`;

filtreTri.append(filtreAVenir);
filtreAVenir.after(tri);
tri.after(filtreCategories);

//ajouter section container pour les veilles
const sectionVeilles = document.createElement("section");
sectionVeilles.id = "grid-container";
main.append(sectionVeilles);

//elements HTML recupérés pour faire le tri
let filterCategory = "toutes";
const filterToCome = document.getElementById("toCome");
const optionsTri = document.getElementById("optionsTri");

//functions
// retourner la liste des catégories uniques triée alphabétiquement en évitant doublons majuscules-minuscules
function allCategories(list) {
  let listTotal = [];
  for (let element of list) {
    if ("category" in element) {
      listTotal.push(element.category.toUpperCase());
    }
  }
  const listCategoriesUnique = [];
  listTotal.forEach((el) => {
    if (!listCategoriesUnique.includes(el)) {
      listCategoriesUnique.push(el);
    }
  });
  return listCategoriesUnique.sort();
}
const uniqueCategories = allCategories(entries);
console.log("liste strings catégories:", uniqueCategories);

//function tri par date
function sortByDate(list) {
  return list.sort(
    (right, left) =>
      moment(right.date, "DD/MM/YYYY") - moment(left.date, "DD/MM/YYYY")
  );
}

//function tri alphabetique par nom de veille
function sortByName(list) {
  return list.sort((right, left) => (right.subject > left.subject ? 1 : -1));
}

//function tri inverse alphabetique par nom de veille
function sortByNameReverse(list) {
  return list.sort((right, left) => (right.subject < left.subject ? 1 : -1));
}

//function pour insérer les veilles avec filtres et tri intégrés
function insertVeilles() {
  //ajouter ul avec veilles
  const ulVeilles = document.createElement("ul");
  ulVeilles.classList.add("row", "row-cols-1", "gx-0", "list-unstyled");

  //filtre par categorie
  const filteredByCategory = entries.filter((element) => {
    if (filterCategory === "toutes") {
      return true;
    } else {
      return element.category.toLowerCase() === filterCategory;
    }
  });
  console.log("liste tous les objets:", Object.values(entries));
  console.log("choix catégorie:", filterCategory);
  console.log("liste objets filtrés par catégorie:", filteredByCategory);

  //filtre par veilles à venir
  const filteredByFuture = filteredByCategory.filter((element) => {
    if (filterToCome.checked === false) {
      return true;
    } else {
      return moment(element.date, "DD/MM/YYYY") > dateNow;
    }
  });
  console.log("choix veilles à venir seulement:", filterToCome.checked);
  console.log(
    "liste objets filtrés par catégorie et choix à venir:",
    filteredByFuture
  );

  //tri en appelant fonctions de tri
  switch (optionsTri.value) {
    case "alpha":
      sortByName(filteredByFuture);
      break;
    case "alpha-reverse":
      sortByNameReverse(filteredByFuture);
      break;
    default:
      sortByDate(filteredByFuture);
  }
  console.log("choix tri:", optionsTri.value);
  console.log(
    "liste objets filtrés par catégorie et choix à venir et triés selon choix",
    filteredByFuture
  );

  //ajouter enfants de l'ulVeilles
  let counter = 0;
  filteredByFuture.forEach((element) => {
    const liVeilles = document.createElement("li");
    counter++;
    if (counter % 2 === 0) {
      liVeilles.classList.add("bg-light");
    }
    liVeilles.classList.add("col", "card", "mb-3", "shadow-sm");
    const dateVeille = moment(element.date, "DD/MM/YYYY");
    const dateVeilleTime = moment(element.date, "DD-MM-YYYY");
    dateVeille.locale("fr");
    dateVeilleTime.locale("fr");
    liVeilles.innerHTML = `<div class="card-body">
    <h2 class="card-title">${element.subject}</h2>
    <span class="badge bg-primary mb-2">${element.category.toUpperCase()}</span>
    <p class="card-text">
    <time datetime="${dateVeilleTime}">${dateVeille.format(dateFormat)}</time>
    </p>
    </div>`;
    ulVeilles.append(liVeilles);
  });
  //vider section container avant de rajouter nouvelle selection
  sectionVeilles.innerHTML = "";
  sectionVeilles.append(ulVeilles);
  console.log("contenu element ulVeilles:", ulVeilles);
}
insertVeilles();

//function remplir element select categories et event listener
function activateFilterCategory() {
  const filCat = document.getElementById("filCat");
  for (let category of uniqueCategories) {
    const option = document.createElement("option");
    option.value = category.toLowerCase();
    option.classList.add("bg-secondary", "text-white");
    option.textContent = category.toLowerCase();
    filCat.append(option);
  }
  filCat.addEventListener("change", () => {
    filterCategory = filCat.value;
    insertVeilles();
  });
}
activateFilterCategory();

//event listener sur input coché pour veilles à venir
filterToCome.addEventListener("change", () => {
  insertVeilles();
});

//event listener sur element select tri
optionsTri.addEventListener("change", () => {
  insertVeilles();
});

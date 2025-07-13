
const mallaData = [];

const loadData = async () => {
  // En este demo los datos están embebidos para simplificar
  // Pero aquí podríamos cargar un data.json externo con fetch
  return [
    {"id": "coe1", "nombre": "Comunicación Oral y Escrita I (COE 1)", "anio": 1, "semestre": 1, "creditos": 2, "anual": false, "prerrequisitos": []},
    {"id": "quimica", "nombre": "Química General y Orgánica", "anio": 1, "semestre": 1, "creditos": 5, "anual": false, "prerrequisitos": []},
    {"id": "idioma1", "nombre": "Idioma Extranjero I", "anio": 1, "semestre": 1, "creditos": 3, "anual": false, "prerrequisitos": []},
    {"id": "morfo1", "nombre": "Morfología I", "anio": 1, "semestre": 1, "creditos": 10, "anual": false, "prerrequisitos": []},
    {"id": "fundamentos", "nombre": "Fundamentos Biológicos de la Medicina", "anio": 1, "semestre": 1, "creditos": 12, "anual": true, "prerrequisitos": []},
    {"id": "mate", "nombre": "Matemáticas", "anio": 1, "semestre": 1, "creditos": 4, "anual": false, "prerrequisitos": []},
    {"id": "coe2", "nombre": "Comunicación Oral y Escrita II (COE 2)", "anio": 1, "semestre": 2, "creditos": 4, "anual": false, "prerrequisitos": ["coe1"]},
    {"id": "idioma2", "nombre": "Idioma Extranjero II", "anio": 1, "semestre": 2, "creditos": 3, "anual": false, "prerrequisitos": ["idioma1"]},
    {"id": "morfo2", "nombre": "Morfología II", "anio": 1, "semestre": 2, "creditos": 7, "anual": false, "prerrequisitos": ["morfo1"]},
    {"id": "neuroanato", "nombre": "Neuroanatomía", "anio": 1, "semestre": 2, "creditos": 3, "anual": false, "prerrequisitos": ["morfo1"]},
    {"id": "fisica", "nombre": "Física", "anio": 1, "semestre": 2, "creditos": 4, "anual": false, "prerrequisitos": ["mate"]},
    {"id": "intro", "nombre": "Introducción a la Medicina", "anio": 1, "semestre": 2, "creditos": 4, "anual": false, "prerrequisitos": []}
  ];
};

const getStorageKey = () => "mallaMedUtalcaYear1";

const loadProgress = () => {
  const data = localStorage.getItem(getStorageKey());
  return data ? JSON.parse(data) : {};
};

const saveProgress = (progress) => {
  localStorage.setItem(getStorageKey(), JSON.stringify(progress));
};

const isUnlocked = (ramo, progress) => {
  // Si no tiene prerrequisitos, siempre desbloqueado
  if (ramo.prerrequisitos.length === 0) return true;

  // Todos los prerrequisitos deben estar aprobados
  return ramo.prerrequisitos.every(pr => progress[pr]);
};

const renderMalla = (data, progress) => {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";

  // Agrupar por semestre
  const semestres = {};
  data.forEach(ramo => {
    const key = `Año ${ramo.anio} - Semestre ${ramo.semestre}`;
    if (!semestres[key]) semestres[key] = [];
    semestres[key].push(ramo);
  });

  // Para los ramos anuales, se mostrará en ambos semestres, pero solo una vez marcado
  // Los marcaremos solo en el semestre 1 para simplicidad

  for (const [sem, ramos] of Object.entries(semestres)) {
    const semDiv = document.createElement("div");
    semDiv.className = "semestre";
    const semTitle = document.createElement("h2");
    semTitle.textContent = sem;
    semDiv.appendChild(semTitle);

    ramos.forEach(ramo => {
      // No mostrar ramo anual en semestre 2 para no repetir visualmente
      if (ramo.anual && ramo.semestre === 2) return;

      const ramoDiv = document.createElement("div");
      ramoDiv.className = "ramo";

      const unlocked = isUnlocked(ramo, progress);
      if (unlocked) ramoDiv.classList.add("desbloqueado");
      else ramoDiv.classList.add("bloqueado");

      if (progress[ramo.id]) ramoDiv.classList.add("aprobado");

      ramoDiv.setAttribute("data-id", ramo.id);

      const infoDiv = document.createElement("div");
      infoDiv.className = "info";

      const nombreSpan = document.createElement("span");
      nombreSpan.className = "nombre";
      nombreSpan.textContent = ramo.nombre;

      const creditosSpan = document.createElement("span");
      creditosSpan.className = "creditos";
      creditosSpan.textContent = `${ramo.creditos} créditos`;

      infoDiv.appendChild(nombreSpan);
      infoDiv.appendChild(creditosSpan);

      const checkmark = document.createElement("span");
      checkmark.className = "checkmark";
      checkmark.textContent = progress[ramo.id] ? "✔" : "";

      ramoDiv.appendChild(infoDiv);
      ramoDiv.appendChild(checkmark);

      if (unlocked) {
        ramoDiv.style.cursor = "pointer";
        ramoDiv.addEventListener("click", () => {
          // Cambiar estado aprobado o no aprobado
          if (progress[ramo.id]) {
            delete progress[ramo.id];
          } else {
            progress[ramo.id] = true;
          }
          saveProgress(progress);
          renderMalla(data, progress);
        });
      }

      container.appendChild(semDiv);
      semDiv.appendChild(ramoDiv);
    });
  }
};

const init = async () => {
  const data = await loadData();
  const progress = loadProgress();
  renderMalla(data, progress);
};

window.onload = init;

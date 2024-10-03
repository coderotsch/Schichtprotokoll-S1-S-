// Array zur Speicherung der erledigten und unerledigten Aufgaben
let unerledigteAufgaben = JSON.parse(localStorage.getItem('unerledigteAufgaben')) || [];
let erledigteAufgaben = JSON.parse(localStorage.getItem('erledigteAufgaben')) || [];

// Funktion zum Speichern der unerledigten Aufgaben im Local Storage
function speichereUnerledigteAufgaben() {
    localStorage.setItem('unerledigteAufgaben', JSON.stringify(unerledigteAufgaben));
}

// Funktion zum Speichern der erledigten Aufgaben im Local Storage
function speichereErledigteAufgaben() {
    localStorage.setItem('erledigteAufgaben', JSON.stringify(erledigteAufgaben));
}

// Funktion zur Speicherung der Aufgabe mit Datum, Aufgabensteller und Erlediger im Local Storage
function taskErledigt(checkbox, aufgabenText, aufgabenSteller, aufgabenErlediger) {
    const datum = new Date().toLocaleDateString(); // Datum in lesbarem Format
    if (checkbox.checked) {
        if (!erledigteAufgaben.some(aufgabe => aufgabe.task === aufgabenText)) {
            erledigteAufgaben.push({ task: aufgabenText, datum: datum, steller: aufgabenSteller, erlediger: aufgabenErlediger });
            unerledigteAufgaben = unerledigteAufgaben.filter(aufgabe => aufgabe.task !== aufgabenText);
        }
    } else {
        erledigteAufgaben = erledigteAufgaben.filter(aufgabe => aufgabe.task !== aufgabenText);
        unerledigteAufgaben.push({ task: aufgabenText, steller: aufgabenSteller, erlediger: aufgabenErlediger });
    }
    speichereErledigteAufgaben();
    speichereUnerledigteAufgaben();
    zeigeErledigteAufgaben();
    zeigeUnerledigteAufgaben();
}

// Funktion zur Anzeige der unerledigten Aufgaben im HTML
function zeigeUnerledigteAufgaben() {
    const taskContainer = document.getElementById('task-container');
    taskContainer.innerHTML = ''; // Container leeren

    unerledigteAufgaben.forEach(function (aufgabe) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.setAttribute('data-category', aufgabe.category || 'allgemein');

        taskElement.innerHTML = `
            <div class="category-bar"></div>
            <div class="task-info">
                <span><strong>Aufgabe:</strong> ${aufgabe.task}</span><br>
                <span><strong>Steller:</strong> ${aufgabe.steller}</span><br>
                <span><strong>Erlediger:</strong> ${aufgabe.erlediger}</span>
            </div>
            <input type="checkbox" class="mark-done">
        `;

        taskContainer.appendChild(taskElement);

        // Markiere als erledigt, falls vorhanden
        const checkbox = taskElement.querySelector('.mark-done');
        const erledigteAufgabe = erledigteAufgaben.find(item => item.task === aufgabe.task);
        if (erledigteAufgabe) {
            checkbox.checked = true;
            taskElement.classList.add('done');
        }

        // Event Listener für die Checkbox, um Aufgabe als erledigt zu markieren
        checkbox.addEventListener('change', function () {
            taskErledigt(this, aufgabe.task, aufgabe.steller, aufgabe.erlediger);
            if (this.checked) {
                taskElement.classList.add('done');
            } else {
                taskElement.classList.remove('done');
            }
        });
    });
}

// Funktion zur Anzeige der erledigten Aufgaben im HTML
function zeigeErledigteAufgaben() {
    const erledigteAufgabenListe = document.getElementById('erledigte-aufgaben-liste');
    erledigteAufgabenListe.innerHTML = ''; // Liste leeren

    erledigteAufgaben.forEach(function (aufgabe, index) {
        const li = document.createElement('li');
        li.textContent = `${aufgabe.task} (Erledigt am: ${aufgabe.datum}, Steller: ${aufgabe.steller}, Erlediger: ${aufgabe.erlediger})`;

        // Erstelle einen Löschen-Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.classList.add('delete-btn');
        deleteButton.style.marginLeft = '10px';

        // Event Listener zum Löschen der Aufgabe
        deleteButton.addEventListener('click', function () {
            löscheErledigteAufgabe(index);
        });

        li.appendChild(deleteButton);
        erledigteAufgabenListe.appendChild(li);
    });
}

// Funktion zum Löschen einer erledigten Aufgabe aus der Liste und dem Local Storage
function löscheErledigteAufgabe(index) {
    erledigteAufgaben.splice(index, 1);
    speichereErledigteAufgaben();
    zeigeErledigteAufgaben();
}

// Funktion zum Hinzufügen einer neuen Aufgabe
document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskInput = document.getElementById('modal-task-input').value;
    const priority = document.getElementById('modal-priority-select').value;
    const category = document.getElementById('modal-category-select').value;
    const dueDate = document.getElementById('modal-due-date').value;
    const taskSteller = document.getElementById('modal-task-steller').value;
    const taskErlediger = document.getElementById('modal-task-erlediger').value;

    if (taskInput && priority && category && dueDate && taskSteller && taskErlediger) {
        const taskElement = {
            task: taskInput,
            priority: priority,
            category: category,
            dueDate: dueDate,
            steller: taskSteller,
            erlediger: taskErlediger
        };

        unerledigteAufgaben.push(taskElement);
        speichereUnerledigteAufgaben();
        zeigeUnerledigteAufgaben();
    }
});

// Rufe beim Laden der Seite die Ladefunktion auf
window.onload = function () {
    setDateToToday();  // Setze das heutige Datum
    ladeMaschinenbereichWennLeer();  // Lade Maschinenbereich
    zeigeUnerledigteAufgaben(); // Zeige gespeicherte unerledigte Aufgaben
    zeigeErledigteAufgaben();   // Zeige gespeicherte erledigte Aufgaben
};

// Setze das heutige Datum im Datumsfeld
function setDateToToday() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    document.getElementById('date-display').value = `${year}-${month}-${day}`;
}

// Bibliotheken einbinden
const { jsPDF } = window.jspdf;  // Erstelle eine Referenz zu jsPDF
// Gemeinsame Funktion zum temporären Anwenden von CSS-Stilen
function applyTempStyles(element, styles) {
    const originalStyles = {};
    for (const property in styles) {
        originalStyles[property] = element.style[property];
        element.style[property] = styles[property];
    }
    return originalStyles; // Ursprüngliche Stile zurückgeben
}

// Gemeinsame Funktion zum Zurücksetzen der ursprünglichen Stile
function resetStyles(element, originalStyles) {
    for (const property in originalStyles) {
        element.style[property] = originalStyles[property];
    }
}

// Funktion zur Erstellung des PDFs mit Übergeber, Übernehmer und Datum im europäischen Format
document.getElementById('save-pdf-btn').addEventListener('click', function () {
    const dateInput = document.getElementById('date-display').value || 'default-date';

    // Formatieren des Datums im europäischen Format TT.MM.JJJJ
    const dateObject = new Date(dateInput);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Monate starten bei 0
    const year = dateObject.getFullYear();
    const europeanDate = `${day}.${month}.${year}`;

    const formattedDate = dateInput.replace(/-/g, '_'); // Für Dateiname im PDF
    const pdf = new jsPDF('landscape', 'mm', 'a4'); // Querformat PDF

    // Übergeber und Übernehmer Werte aus den Dropdowns holen
    const uebergeber = document.getElementById('uebergeber').value;
    const uebernehmer = document.getElementById('uebernehmer').value;

    // Temporär Übergeber, Übernehmer und das Datum als Text zum Dokument hinzufügen
    const uebergabeInfoElement = document.createElement('div');
    uebergabeInfoElement.innerHTML = `<strong>Übergeber:</strong> ${uebergeber} | <strong>Übernehmer:</strong> ${uebernehmer} | <strong>Datum:</strong> ${europeanDate}`;
    uebergabeInfoElement.style.fontSize = '16px';  // Ändere die Schriftgröße
    uebergabeInfoElement.style.marginBottom = '20px'; // Füge etwas Abstand hinzu

    const headerContainer = document.querySelector('.header-container');
    headerContainer.appendChild(uebergabeInfoElement);  // Füge Übergeber/Übernehmer zum Header hinzu

    // Temporäre Stilanwendung für die "große Bildschirm"-Ansicht
    const contentElement = document.body;

    const originalContentStyles = applyTempStyles(contentElement, {
        width: '1920px',  // Simuliere einen großen Bildschirm (1920px Breite)
        height: `${contentElement.scrollHeight}px`, // Setze Höhe entsprechend des gesamten Inhalts
        overflow: 'visible',
        transform: 'scale(1)'  // Kein Zoom, normale Skalierung
    });

    html2canvas(contentElement, {
        scale: 2, // Erhöhe die Auflösung für schärfere Screenshots
        useCORS: true,  // Falls externe Bilder geladen werden müssen
        width: 1920,  // Die Breite, die wir simulieren
        height: contentElement.scrollHeight // Setze Höhe auf den gesamten Inhalt
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 297;  // Querformat Breite in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;  // Verhältnis von Breite zu Höhe berechnen

        // Füge das Bild zur PDF hinzu und fülle die Seite aus
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Ursprüngliche Stile zurücksetzen
        resetStyles(contentElement, originalContentStyles);

        // Entferne das temporäre Übergeber/Übernehmer/Datum-Element aus dem Dokument
        headerContainer.removeChild(uebergabeInfoElement);

        // Speichere das PDF
        pdf.save(`Schichtprotokoll_${formattedDate}.pdf`);
    }).catch((error) => {
        console.error("Fehler beim Erstellen des Screenshots vom Inhaltselement:", error);
    });
});




// Modal öffnen und schließen
const modal = document.getElementById('taskModal');
const newTaskBtn = document.getElementById('new-task-btn');
const closeModal = document.getElementById('close-modal');

newTaskBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Funktion zum Laden der Maschinen-HTML und Speichern im Local Storage
function ladeMaschinenHTML(callback) {
    fetch('maschinen.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('maschinen-container').innerHTML = data;
            console.log('Maschinen-HTML geladen, jetzt DOM-Elemente prüfen.');
            callback();
        })
        .catch(error => {
            console.error('Fehler beim Laden der Maschinen-HTML:', error);
        });
}

// Funktion zum Laden der Maschinen.html und Speichern im Local Storage, falls noch keine Daten vorhanden sind
function ladeMaschinenbereichWennLeer() {
    const gespeicherterMaschinenBereich = JSON.parse(localStorage.getItem('maschinenBereich'));

    if (!gespeicherterMaschinenBereich) {
        // Wenn keine Daten vorhanden sind, lade Maschinen-HTML und speichere initiale Daten
        ladeMaschinenHTML(() => {
            console.log('Maschinen-HTML geladen, speichere initialen Maschinenbereich.');
            speichereMaschinenbereich(); // Speichern der initial geladenen Daten
            setzeEventListenerFuerMaschinen(); // Setze Event-Listener nach dem Laden der Maschinen-HTML
        });
    } else {
        // Wenn Daten vorhanden sind, lade sie aus dem Local Storage und setze die Event-Listener
        ladeMaschinenHTML(() => {
            console.log('Maschinen-HTML geladen, lade gespeicherte Daten.');
            ladeMaschinenbereich(); // Lade die Daten aus dem LocalStorage
            setzeEventListenerFuerMaschinen(); // Setze Event-Listener nach dem Laden der Maschinen-HTML
        });
    }
}

// Funktion zum Laden des Maschinenbereichs aus dem Local Storage
function ladeMaschinenbereich() {
    const gespeicherterMaschinenBereich = JSON.parse(localStorage.getItem('maschinenBereich'));

    if (!gespeicherterMaschinenBereich) {
        console.log("Keine Maschinendaten im Local Storage gefunden.");
    } else {
        gespeicherterMaschinenBereich.forEach((item, index) => {
            const faconInput = document.getElementById(`facon${index + 61}`);
            const toolCheckbox = document.getElementById(`tool-status${index + 61}`);
            const machineCheckbox = document.getElementById(`machine-status${index + 61}`);
            const infoTextarea = document.getElementById(`info${index + 61}`);
            const auftragInput = document.getElementById(`auftrag${index + 61}`);
            const adaptiertCheckbox = document.getElementById(`status${index + 61}-adaptiert`);
            const materialCheckbox = document.getElementById(`status${index + 61}-material`);

            // Überprüfe, ob die Elemente existieren, bevor sie gesetzt werden
            if (faconInput && toolCheckbox && machineCheckbox && infoTextarea && auftragInput && adaptiertCheckbox && materialCheckbox) {
                // Setze die abgerufenen Werte in die Felder
                faconInput.value = item.facon || '';
                toolCheckbox.checked = item.toolChecked || false;
                machineCheckbox.checked = item.machineChecked || false;
                infoTextarea.value = item.info || '';
                auftragInput.value = item.auftrag || '';
                adaptiertCheckbox.checked = item.adaptiert || false;
                materialCheckbox.checked = item.material || false;
            }
        });
    }
}

// Funktion zum Speichern des Maschinenbereichs im Local Storage
function speichereMaschinenbereich() {
    const maschinenStatus = [];

    for (let index = 0; index < 6; index++) {
        const faconInput = document.getElementById(`facon${index + 61}`);

        if (faconInput) {
            const toolChecked = document.getElementById(`tool-status${index + 61}`).checked || false;
            const machineChecked = document.getElementById(`machine-status${index + 61}`).checked || false;
            const info = document.getElementById(`info${index + 61}`).value || '';
            const auftrag = document.getElementById(`auftrag${index + 61}`).value || '';
            const adaptiert = document.getElementById(`status${index + 61}-adaptiert`).checked || false;
            const material = document.getElementById(`status${index + 61}-material`).checked || false;

            const maschinenData = {
                facon: faconInput.value || '',
                toolChecked: toolChecked,
                machineChecked: machineChecked,
                info: info,
                auftrag: auftrag,
                adaptiert: adaptiert,
                material: material
            };

            maschinenStatus.push(maschinenData);
        }
    }

    // Speichere die Daten im LocalStorage
    localStorage.setItem('maschinenBereich', JSON.stringify(maschinenStatus));
}

// Funktion zum Setzen von Event Listenern auf den Maschinenfeldern
function setzeEventListenerFuerMaschinen() {
    const inputs = document.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            speichereMaschinenbereich(); // Speichern bei jeder Änderung
        });
    });
}

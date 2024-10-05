// Array zur Speicherung der erledigten und unerledigten Aufgaben
let unerledigteAufgaben = [];
let erledigteAufgaben = [];

// Funktion zum Speichern der unerledigten Aufgaben in der Datenbank
function speichereUnerledigteAufgaben() {
    fetch('/.netlify/functions/speichereUnerledigteAufgaben', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(unerledigteAufgaben)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Unerledigte Aufgaben erfolgreich gespeichert:', data);
    })
    .catch((error) => {
        console.error('Fehler beim Speichern der unerledigten Aufgaben:', error);
    });
}

// Funktion zum Speichern der erledigten Aufgaben in der Datenbank
function speichereErledigteAufgaben() {
    fetch('/.netlify/functions/speichereErledigteAufgaben', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(erledigteAufgaben)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Erledigte Aufgaben erfolgreich gespeichert:', data);
    })
    .catch((error) => {
        console.error('Fehler beim Speichern der erledigten Aufgaben:', error);
    });
}

// Funktion zur Speicherung der Aufgabe mit Datum, Aufgabensteller und Erlediger in der Datenbank
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
    fetch('/.netlify/functions/leseUnerledigteAufgaben', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        unerledigteAufgaben = data;
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
    })
    .catch((error) => {
        console.error('Fehler beim Laden der unerledigten Aufgaben:', error);
    });
}

// Funktion zur Anzeige der erledigten Aufgaben im HTML
function zeigeErledigteAufgaben() {
    fetch('/.netlify/functions/leseErledigteAufgaben', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        erledigteAufgaben = data;
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
    })
    .catch((error) => {
        console.error('Fehler beim Laden der erledigten Aufgaben:', error);
    });
}

// Funktion zum Löschen einer erledigten Aufgabe aus der Liste und der Datenbank
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

// Beim Laden der Seite Aufgaben anzeigen
window.onload = function () {
    setDateToToday();
    ladeMaschinenbereichWennLeer();
    zeigeUnerledigteAufgaben();
    zeigeErledigteAufgaben();
    ladeSchichtUebergaben();
};

// Setze das heutige Datum im Datumsfeld
function setDateToToday() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    document.getElementById('date-display').value = `${year}-${month}-${day}`;
}

// Funktion zum Laden der Maschinen-HTML und Speichern in der Datenbank
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

// Funktion zum Laden der Maschinen.html und Speichern in der Datenbank
function ladeMaschinenbereichWennLeer() {
    fetch('/.netlify/functions/leseMaschinenBereich', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const gespeicherterMaschinenBereich = data;

        if (!gespeicherterMaschinenBereich) {
            ladeMaschinenHTML(() => {
                console.log('Maschinen-HTML geladen, speichere initialen Maschinenbereich.');
                speichereMaschinenbereich();
                setzeEventListenerFuerMaschinen();
            });
        } else {
            ladeMaschinenHTML(() => {
                console.log('Maschinen-HTML geladen, lade gespeicherte Daten.');
                ladeMaschinenbereich(gespeicherterMaschinenBereich);
                setzeEventListenerFuerMaschinen();
            });
        }
    })
    .catch((error) => {
        console.error('Fehler beim Laden des Maschinenbereichs:', error);
    });
}

// Funktion zum Laden des Maschinenbereichs aus der Datenbank
function ladeMaschinenbereich(gespeicherterMaschinenBereich) {
    gespeicherterMaschinenBereich.forEach((item, index) => {
        const faconInput = document.getElementById(`facon${index + 61}`);
        const toolCheckbox = document.getElementById(`tool-status${index + 61}`);
        const machineCheckbox = document.getElementById(`machine-status${index + 61}`);
        const infoTextarea = document.getElementById(`info${index + 61}`);
        const auftragInput = document.getElementById(`auftrag${index + 61}`);
        const adaptiertCheckbox = document.getElementById(`status${index + 61}-adaptiert`);
        const materialCheckbox = document.getElementById(`status${index + 61}-material`);

        if (faconInput && toolCheckbox && machineCheckbox && infoTextarea && auftragInput && adaptiertCheckbox && materialCheckbox) {
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

// Funktion zum Speichern des Maschinenbereichs in der Datenbank
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

    fetch('/.netlify/functions/speichereMaschinenBereich', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(maschinenStatus)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Maschinenbereich erfolgreich gespeichert:', data);
    })
    .catch((error) => {
        console.error('Fehler beim Speichern des Maschinenbereichs:', error);
    });
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

// Funktion zum Speichern der Schichtübergabe-Daten
function speichereSchichtUebergaben() {
    const uebergeber = document.getElementById('uebergeber').value;
    const uebernehmer = document.getElementById('uebernehmer').value;
    const datum = document.getElementById('date-display').value;

    // Überprüfen, ob alle Felder ausgefüllt sind
    if (!uebergeber || !uebernehmer || !datum) {
        console.error('Alle Felder müssen ausgefüllt werden.');
        alert('Bitte alle Felder (Übergeber, Übernehmer und Datum) ausfüllen.');
        return;
    }

    // Schichtübergabe-Objekt erstellen
    const schichtUebergabe = {
        uebergeber: uebergeber,
        uebernehmer: uebernehmer,
        datum: datum
    };

    // Fetch-Aufruf, um die Daten an die Netlify-Funktion zu senden
    fetch('/.netlify/functions/speichereSchichtUebergaben', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(schichtUebergabe) // Schichtübergabe-Daten senden
    })
    .then(response => {
        // Überprüfen, ob die Antwort erfolgreich war
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        return response.json(); // Antwort in JSON umwandeln
    })
    .then(data => {
        // Erfolgreiche Speicherung
        console.log('Schichtübergabe erfolgreich gespeichert:', data);
    })
    .catch((error) => {
        // Fehlerbehandlung
        console.error('Fehler beim Speichern der Schichtübergabe:', error);
    });
}

// Event-Listener für Änderungen an den Feldern
document.getElementById('uebergeber').addEventListener('change', speichereSchichtUebergaben);
document.getElementById('uebernehmer').addEventListener('change', speichereSchichtUebergaben);



// Funktion zum Laden der Schichtübergeber und Übernehmer aus der Datenbank
function ladeSchichtUebergaben() {
    fetch('/.netlify/functions/leseSchichtUebergaben', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            document.getElementById('uebergeber').value = data.uebergeber || '';
            document.getElementById('uebernehmer').value = data.uebernehmer || '';
            document.getElementById('date-display').value = data.datum || '';
        }
    })
    .catch((error) => {
        console.error('Fehler beim Laden der Schichtübergabe-Daten:', error);
    });
}
document.getElementById('save-btn').addEventListener('click', speichereSchichtUebergaben);
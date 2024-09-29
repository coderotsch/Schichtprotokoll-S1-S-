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
        // Überprüfen, ob die Aufgabe bereits existiert
        if (!erledigteAufgaben.some(aufgabe => aufgabe.task === aufgabenText)) {
            // Aufgabe zur Liste der erledigten Aufgaben hinzufügen
            erledigteAufgaben.push({ task: aufgabenText, datum: datum, steller: aufgabenSteller, erlediger: aufgabenErlediger });
            unerledigteAufgaben = unerledigteAufgaben.filter(aufgabe => aufgabe.task !== aufgabenText); // Entferne sie von unerledigten
        }
    } else {
        // Wenn Aufgabe abgewählt wird, zurück in unerledigte Aufgaben
        erledigteAufgaben = erledigteAufgaben.filter(aufgabe => aufgabe.task !== aufgabenText);
        unerledigteAufgaben.push({ task: aufgabenText, steller: aufgabenSteller, erlediger: aufgabenErlediger });
    }
    // Liste im Local Storage speichern und aktualisieren
    speichereErledigteAufgaben();
    speichereUnerledigteAufgaben();
    zeigeErledigteAufgaben();
    zeigeUnerledigteAufgaben();
}

// Funktion zur Anzeige der unerledigten Aufgaben im HTML
function zeigeUnerledigteAufgaben() {
    const taskContainer = document.getElementById('task-container');
    taskContainer.innerHTML = ''; // Container leeren

    unerledigteAufgaben.forEach(function(aufgabe) {
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

        // Event Listener für die Checkbox, um Aufgabe als erledigt zu markieren
        taskElement.querySelector('.mark-done').addEventListener('change', function() {
            taskErledigt(this, aufgabe.task, aufgabe.steller, aufgabe.erlediger);
            if (this.checked) {
                taskElement.classList.add('done');
            } else {
                taskElement.classList.remove('done');
            }
            updateProgress();
        });
    });
}

// Funktion zur Anzeige der erledigten Aufgaben im HTML
function zeigeErledigteAufgaben() {
    const erledigteAufgabenListe = document.getElementById('erledigte-aufgaben-liste');
    erledigteAufgabenListe.innerHTML = ''; // Liste leeren

    erledigteAufgaben.forEach(function(aufgabe, index) {
        const li = document.createElement('li');
        li.textContent = `${aufgabe.task} (Erledigt am: ${aufgabe.datum}, Steller: ${aufgabe.steller}, Erlediger: ${aufgabe.erlediger})`;

        // Erstelle einen Löschen-Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.classList.add('delete-btn');
        deleteButton.style.marginLeft = '10px';

        // Event Listener zum Löschen der Aufgabe
        deleteButton.addEventListener('click', function() {
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

// Funktion zum Anzeigen der unerledigten Aufgaben beim Laden der Seite
window.onload = function() {
    setDateToToday();  // Setze das heutige Datum
    loadMaschinen();   // Maschinen laden
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

// Fortschrittsbalken aktualisieren
function updateProgress() {
    const tasks = document.querySelectorAll('.task');
    const doneTasks = document.querySelectorAll('.task.done');
    const progress = tasks.length > 0 ? (doneTasks.length / tasks.length) * 100 : 0;

    const progressBarFill = document.getElementById('progress-bar-fill');
    progressBarFill.style.width = `${progress}%`;
    progressBarFill.textContent = `${Math.round(progress)}%`;
}

// Schichtprotokoll als Bild speichern
document.getElementById('save-btn').addEventListener('click', function () {
    const element = document.body;
    const dateInput = document.getElementById('date-display').value || 'default-date';
    const formattedDate = dateInput.replace(/-/g, '_');

    // Verwende html2canvas, um den Screenshot des Elements zu erstellen
    html2canvas(element).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `Schichtprotokoll_${formattedDate}.png`;
        link.click();
    });
});

// Funktion zum Exportieren der erledigten Aufgaben als Excel-Dokument
function exportiereAlsExcel() {
    if (erledigteAufgaben.length === 0) {
        alert("Keine erledigten Aufgaben zum Exportieren.");
        return;
    }

    // Erstelle ein neues Workbook
    const wb = XLSX.utils.book_new();
    const wsData = [['Aufgabe', 'Datum der Erledigung', 'Aufgabensteller', 'Erlediger']]; // Header

    // Füge die erledigten Aufgaben hinzu
    erledigteAufgaben.forEach(aufgabe => {
        wsData.push([aufgabe.task, aufgabe.datum, aufgabe.steller, aufgabe.erlediger]);
    });

    // Erstelle ein neues Worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Erledigte Aufgaben");

    // Speichere das Workbook als Excel-Datei
    XLSX.writeFile(wb, "erledigte_aufgaben.xlsx");
}

// Button für den Excel-Export
document.getElementById('export-btn').addEventListener('click', exportiereAlsExcel);

// Funktion zum Laden der Maschinen.html
function loadMaschinen() {
    fetch('maschinen.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok.');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('maschinen-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Es gab ein Problem mit dem Fetch-Vorgang:', error);
        });
}

// Überprüfen, ob beide Checkboxen aktiviert sind und dann die Zelle grün färben
document.querySelectorAll('.status-column').forEach(function (column) {
    const checkboxes = column.querySelectorAll('.status-checkbox');
    const statusCell = column.closest('.status-cell');

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const bothChecked = Array.from(checkboxes).every(chk => chk.checked);

            if (bothChecked) {
                statusCell.classList.add('green');
            } else {
                statusCell.classList.remove('green');
            }
        });
    });
});
// Modal öffnen und schließen
const modal = document.getElementById('taskModal');
const newTaskBtn = document.getElementById('new-task-btn');
const closeModal = document.getElementById('close-modal');

newTaskBtn.addEventListener('click', () => {
    modal.style.display = 'flex'; // Modal wird geöffnet
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none'; // Modal wird geschlossen
});

// Schließen des Modals, wenn außerhalb des Modals geklickt wird
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none'; // Modal wird geschlossen
    }

});

if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i)) {
    alert('Fügen Sie die App zum Startbildschirm hinzu, um sie wie eine native App zu nutzen.');
  }

// Load CSV data from GitHub repository on page load
document.addEventListener('DOMContentLoaded', () => {
    const csvUrl = 'https://raw.githubusercontent.com/your-username/your-repository-name/main/datable.csv';

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function(results) {
            displayTable(results.data);
            updateTotalRowCount(results.data.length); // Update total count after loading
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
        }
    });
});

function displayTable(rows) {
    const tbody = document.querySelector('#csvTable tbody');
    tbody.innerHTML = '';
    rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(cell => {
            const td = document.createElement('td');
            td.textContent = (cell || '').trim(); // Ensure trimming of whitespace
            tr.appendChild(td);
        });
        tr.addEventListener('click', function() {
            displayRowInNewWindow(Object.values(row));
        });
        tbody.appendChild(tr);
    });

    document.getElementById('csvTable').dataset.rows = JSON.stringify(rows); // Store original rows data
    updateTotalRowCount(rows.length);
}

function updateTotalRowCount(count) {
    const rowCountElement = document.getElementById('rowCount');
    rowCountElement.textContent = `Total Rows: ${count}`;
}

function updateVisibleRowCount(count) {
    const visibleRowCountElement = document.getElementById('visibleRowCount');
    if (visibleRowCountElement) {
        visibleRowCountElement.textContent = `Visible Rows: ${count}`;
    } else {
        const div = document.createElement('div');
        div.id = 'visibleRowCount';
        div.textContent = `Visible Rows: ${count}`;
        document.querySelector('.upload-container').appendChild(div);
    }
}

function displayRowInNewWindow(row) {
    const headers = [
        "Serial Number", "UP#", "Make", "Office", "Modality", "Status", "Room", "Tech",
        "Equipment", "Contract/Warranty Begin", "Contract/Warranty End Date", "Service Support",
        "Support Phone#", "Support Email", "Service Annual Fee", "Note", "Purchase From",
        "Purchase Date", "Delivery Date", "Install Date", "Remove By", "Remove Date", "Remove Description"
    ];
    const newWindow = window.open('', '_blank', 'width=600,height=800');
    newWindow.document.write('<html><head><title>Row Details</title></head><body>');
    newWindow.document.write('<div style="display: flex; flex-direction: column; gap: 10px;">');
    row.forEach((cell, index) => {
        newWindow.document.write(`<div><strong>${headers[index]}:</strong> ${cell}</div>`);
    });
    newWindow.document.write('</div>');
    newWindow.document.write('</body></html>');
}

document.querySelectorAll('.search-container input').forEach(input => {
    input.addEventListener('input', filterTable);
});

function filterTable() {
    const serialNumberValue = document.getElementById('serialNumber').value.toLowerCase();
    const makeValue = document.getElementById('make').value.toLowerCase();
    const officeValue = document.getElementById('office').value.toLowerCase();
    const modalityValue = document.getElementById('modality').value.toLowerCase();

    const rows = JSON.parse(document.getElementById('csvTable').dataset.rows);
    let visibleRowCount = 0;
    const tbody = document.querySelector('#csvTable tbody');
    tbody.innerHTML = '';

    rows.forEach((row) => {
        const serialNumberMatch = row["Serial Number"].toLowerCase().includes(serialNumberValue);
        const makeMatch = row["Make"].toLowerCase().includes(makeValue);
        const officeMatch = row["Office"].toLowerCase().includes(officeValue);
        const modalityMatch = row["Modality"].toLowerCase().includes(modalityValue);

        if (serialNumberMatch && makeMatch && officeMatch && modalityMatch) {
            const tr = document.createElement('tr');
            Object.values(row).forEach(cell => {
                const td = document.createElement('td');
                td.textContent = (cell || '').trim(); // Ensure trimming of whitespace
                tr.appendChild(td);
            });
            tr.addEventListener('click', function() {
                displayRowInNewWindow(Object.values(row));
            });
            tbody.appendChild(tr);
            visibleRowCount++;
        }
    });

    updateVisibleRowCount(visibleRowCount); // Update count based on filtered rows
}

              



       
                    
                    

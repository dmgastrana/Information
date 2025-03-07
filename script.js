document.getElementById('uploadButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        Papa.parse(file, {
            complete: function(results) {
                displayTable(results.data);
                updateTotalRowCount(results.data.length - 1); // Update total count after uploading
            }
        });
    }
});

function displayTable(rows) {
    const tbody = document.querySelector('#csvTable tbody');
    tbody.innerHTML = '';
    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell.trim(); // Ensure trimming of whitespace
            tr.appendChild(td);
        });
        tr.addEventListener('click', function() {
            displayRowInNewWindow(row);
        });
        tbody.appendChild(tr);
    });

    document.getElementById('csvTable').dataset.rows = JSON.stringify(rows.slice(1)); // Store original rows data, exclude header row
    updateTotalRowCount(rows.length - 1);
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
    const serialNumberValue = document.getElementById('serialNumberSearch').value.toLowerCase();
    const makeValue = document.getElementById('makeSearch').value.toLowerCase();
    const officeValue = document.getElementById('officeSearch').value.toLowerCase();
    const modalityValue = document.getElementById('modalitySearch').value.toLowerCase();

    const rows = JSON.parse(document.getElementById('csvTable').dataset.rows);
    let visibleRowCount = 0;
    const tbody = document.querySelector('#csvTable tbody');
    tbody.innerHTML = '';

    rows.forEach((row) => {
        const serialNumberMatch = row[0].toLowerCase().includes(serialNumberValue);
        const makeMatch = row[2].toLowerCase().includes(makeValue);
        const officeMatch = row[3].toLowerCase().includes(officeValue);
        const modalityMatch = row[4].toLowerCase().includes(modalityValue);

        if (serialNumberMatch && makeMatch && officeMatch && modalityMatch) {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell.trim(); // Ensure trimming of whitespace
                tr.appendChild(td);
            });
            tr.addEventListener('click', function() {
                displayRowInNewWindow(row);
            });
            tbody.appendChild(tr);
            visibleRowCount++;
        }
    });

    updateVisibleRowCount(visibleRowCount); // Update count based on filtered rows
}




       
                    
                    

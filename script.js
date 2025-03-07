document.addEventListener('DOMContentLoaded', () => {
    const csvUrl = 'https://raw.githubusercontent.com/dmgastrana/Information/main/datatable.csv';

    console.log('Fetching CSV from URL:', csvUrl); // Log the URL

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function(results) {
            console.log('Parsed CSV data:', results.data); // Log the parsed data
            equipmentData = results.data;
            localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
            displayResults(equipmentData);
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
        }
    });

    // Add event listeners to search input fields
    document.querySelectorAll('.search-container input').forEach(input => {
        input.addEventListener('input', filterTable);
    });
});

function displayResults(data) {
    console.log('Displaying results:', data); // Log the data to be displayed
    const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];

    resultTable.innerHTML = '';

    data.forEach((item, index) => {
        const row = resultTable.insertRow();
        Object.entries(item).forEach(([key, val]) => {
            if (key !== 'contractFile') {
                const cell = row.insertCell();
                cell.textContent = val;
                cell.setAttribute('tabindex', '0');
            }
        });
    });
    updateTotalRowCount(data.length); // Update total row count
}

function updateTotalRowCount(count) {
    const rowCountElement = document.getElementById('rowCount');
    rowCountElement.textContent = `Total Rows: ${count}`;
}

function filterTable() {
    const serialNumberValue = document.getElementById('serialNumber').value.toLowerCase();
    const makeValue = document.getElementById('make').value.toLowerCase();
    const officeValue = document.getElementById('office').value.toLowerCase();
    const modalityValue = document.getElementById('modality').value.toLowerCase();

    const filteredData = equipmentData.filter(item => {
        const serialNumberMatch = item['Serial Number'].toLowerCase().includes(serialNumberValue);
        const makeMatch = item['Make'].toLowerCase().includes(makeValue);
        const officeMatch = item['Office'].toLowerCase().includes(officeValue);
        const modalityMatch = item['Modality'].toLowerCase().includes(modalityValue);
        return serialNumberMatch && makeMatch && officeMatch && modalityMatch;
    });

    displayResults(filteredData);
}


         
   


   
                    
                    

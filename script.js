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
    console.log('Filtering table'); // Debug: Log when filtering starts

    const serialNumberValue = document.getElementById('serialNumber').value.toLowerCase();
    console.log('Serial Number filter:', serialNumberValue); // Debug: Log the value

    const makeValue = document.getElementById('make').value.toLowerCase();
    console.log('Make filter:', makeValue); // Debug: Log the value

    const officeValue = document.getElementById('office').value.toLowerCase();
    console.log('Office filter:', officeValue); // Debug: Log the value

    const modalityValue = document.getElementById('modality').value.toLowerCase();
    console.log('Modality filter:', modalityValue); // Debug: Log the value

    const filteredData = equipmentData.filter(item => {
        console.log('Checking item:', item); // Debug: Log each item being checked

        const serialNumberMatch = item['Serial Number'].toLowerCase().includes(serialNumberValue);
        const makeMatch = item['Make'].toLowerCase().includes(makeValue);
        const officeMatch = item['Office'].toLowerCase().includes(officeValue);
        const modalityMatch = item['Modality'].toLowerCase().includes(modalityValue);

        console.log('Matches:', serialNumberMatch, makeMatch, officeMatch, modalityMatch); // Debug: Log match results

        return serialNumberMatch && makeMatch && officeMatch && modalityMatch;
    });

    console.log('Filtered data:', filteredData); // Debug: Log the filtered data

    displayResults(filteredData);
}

       


         
   


   
                    
                    

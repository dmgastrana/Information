document.addEventListener('DOMContentLoaded', () => {
    const csvUrl = 'https://raw.githubusercontent.com/dmgastrana/Information/main/datatable.csv';
    let equipmentData = [];

    console.log('Fetching CSV from URL:', csvUrl);

    // Parse CSV data
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function(results) {
            console.log('Parsed CSV data:', results.data);
            equipmentData = results.data;
            localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
            displayResults(equipmentData);
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
        }
    });

    // Display results with Coverage Days calculation
    function displayResults(data) {
        console.log('Displaying results:', data);
        const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];

        resultTable.innerHTML = ''; // Clear previous rows

        data.forEach((item) => {
            const row = resultTable.insertRow();

            Object.entries(item).forEach(([key, val]) => {
                const cell = row.insertCell();
                cell.textContent = val || 'N/A'; // Handle missing values
            });

            // Add Coverage Days Calculation
            const beginDate = item['Contract/Warranty Begin'] ? new Date(item['Contract/Warranty Begin'].trim()) : null;
            const endDate = item['Contract/Warranty End Date'] ? new Date(item['Contract/Warranty End Date'].trim()) : null;
            const coverageCell = row.insertCell(); // Add a new cell for "Coverage Days left"

            console.log('Begin Date:', beginDate, 'End Date:', endDate);

            if (beginDate && endDate && !isNaN(beginDate) && !isNaN(endDate)) {
                const differenceInTime = endDate - beginDate;
                const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
                console.log('Coverage Days:', differenceInDays);
                coverageCell.textContent = differenceInDays; // Display calculated value
            } else {
                console.log('Invalid or missing dates, skipping calculation.');
                coverageCell.textContent = 'N/A'; // Display 'N/A' if dates are missing/invalid
            }
        });

        updateTotalRowCount(data.length);
    }

    // Update total row count
    function updateTotalRowCount(count) {
        const rowCountElement = document.getElementById('rowCount');
        rowCountElement.textContent = `Total Rows: ${count}`;
    }

    // Filter table dynamically
    document.querySelectorAll('.search-container input').forEach(input => {
        input.addEventListener('input', filterTable);
    });

    function filterTable() {
        const serialNumberValue = document.getElementById('serialNumber').value.toLowerCase();
        const makeValue = document.getElementById('make').value.toLowerCase();
        const officeValue = document.getElementById('office').value.toLowerCase();
        const modalityValue = document.getElementById('modality').value.toLowerCase();

        const filteredData = equipmentData.filter(item =>
            (item['Serial Number'] || '').toLowerCase().includes(serialNumberValue) &&
            (item['Make'] || '').toLowerCase().includes(makeValue) &&
            (item['Office'] || '').toLowerCase().includes(officeValue) &&
            (item['Modality'] || '').toLowerCase().includes(modalityValue)
        );

        displayResults(filteredData);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const csvUrl = 'https://raw.githubusercontent.com/dmgastrana/Information/main/datatable.csv';
    let equipmentData = [];

    console.log('Fetching CSV from URL:', csvUrl); // Log the URL

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function(results) {
            console.log('Parsed CSV data:', results.data); // Log the parsed data
            equipmentData = results.data.map(item => {
                if (item['Contract/Warranty End Date']) {
                    item['Coverage Days Left'] = calculateCoverageDaysLeft(item['Contract/Warranty End Date']);
                } else {
                    item['Coverage Days Left'] = 'N/A';
                }
                return item;
            });
            console.log('Updated equipment data:', equipmentData); // Debug: Log updated data
            localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
            displayResults(equipmentData);
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
        }
    });

    function parseDate(dateString) {
        const parts = dateString.split('/');
        const month = parseInt(parts[0], 10) - 1; // Months are zero-based in JS Date
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }

    function calculateCoverageDaysLeft(endDate) {
        console.log('Calculating coverage days left for:', endDate); // Debug: Log end date
        const endDateObj = parseDate(endDate);
        if (isNaN(endDateObj)) {
            console.error('Invalid date:', endDate);
            return 'Invalid date';
        }
        const today = new Date();
        const timeDiff = endDateObj - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

        console.log('Coverage days left:', daysDiff); // Debug: Log coverage days left
        return daysDiff > 0 ? daysDiff : 0; // If negative, return 0
    }

    function displayResults(data) {
        console.log('Displaying results:', data); // Log the data to be displayed
        const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];

        resultTable.innerHTML = '';

        data.forEach((item) => {
            const row = resultTable.insertRow();
            Object.entries(item).forEach(([key, val]) => {
                if (key !== 'contractFile') {
                    const cell = row.insertCell();
                    cell.textContent = val;
                    cell.setAttribute('tabindex', '0');
                }
            });

            row.addEventListener("click", handleRowClick); // Add click event listener to each row
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
        const makeValue = document.getElementById('make').value.toLowerCase();
        const officeValue = document.getElementById('office').value.toLowerCase();
        const modalityValue = document.getElementById('modality').value.toLowerCase();

        console.log('Filter values:', serialNumberValue, makeValue, officeValue, modalityValue); // Debug: Log filter values

        const filteredData = equipmentData.filter(item => {
            console.log('Checking item:', item); // Debug: Log each item being checked

            const serialNumberMatch = item['Serial Number'] && item['Serial Number'].toLowerCase().includes(serialNumberValue);
            const makeMatch = item['Make'] && item['Make'].toLowerCase().includes(makeValue);
            const officeMatch = item['Office'] && item['Office'].toLowerCase().includes(officeValue);
            const modalityMatch = item['Modality'] && item['Modality'].toLowerCase().includes(modalityValue);

            console.log('Matches:', serialNumberMatch, makeMatch, officeMatch, modalityMatch); // Debug: Log match results

            return serialNumberMatch && makeMatch && officeMatch && modalityMatch;
        });

        console.log('Filtered data:', filteredData); // Debug: Log the filtered data

        displayResults(filteredData);
    }

    function handleRowClick(event) {
        const row = event.target.closest("tr");
        const headers = Array.from(document.querySelectorAll("#resultTable th"));
        const data = Array.from(row.children);
        const verticalDataContainer = document.getElementById("verticalData");

        verticalDataContainer.innerHTML = "";

        headers.forEach((header, index) => {
            const headerText = header.textContent;
            const dataText = data[index].textContent;

            verticalDataContainer.innerHTML += `
                <tr class="${headerText === 'Office' ? 'office-row' : ''}">
                    <th>${headerText}</th>
                    <td>${dataText}</td>
                </tr>
            `;
        });

        document.getElementById("verticalView").style.display = "block";
        document.getElementById("modalOverlay").style.display = "block";
    }

    // Close modal function
    document.getElementById("closeModal").addEventListener("click", function () {
        document.getElementById("verticalView").style.display = "none";
        document.getElementById("modalOverlay").style.display = "none";
    });
});

    
      

document.addEventListener('DOMContentLoaded', () => {
    const csvUrl = 'https://raw.githubusercontent.com/dmgastrana/Information/main/datatable.csv';
    let equipmentData = [];

    console.log('Fetching CSV from URL:', csvUrl); // Log the URL

    // Parse CSV data
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

    // Display results function
    function displayResults(data) {
        console.log('Displaying results:', data); // Log the data to be displayed
        const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];

        resultTable.innerHTML = ''; // Clear previous rows

        // Populate table with data
        data.forEach((item) => {
            const row = resultTable.insertRow();

            Object.entries(item).forEach(([key, val]) => {
                if (key !== 'contractFile') {
                    const cell = row.insertCell();
                    cell.textContent = val;
                    cell.setAttribute('tabindex', '0');
                }
            });

            // Add Coverage Days Left Calculation
            const beginDate = item['Contract/Warranty Begin'] ? new Date(item['Contract/Warranty Begin'].trim()) : null;
            const endDate = item['Contract/Warranty End Date'] ? new Date(item['Contract/Warranty End Date'].trim()) : null;
            const coverageCell = row.insertCell(); // Add a new cell for "Coverage Days left"

            if (beginDate && endDate && !isNaN(beginDate) && !isNaN(endDate)) {
                const differenceInTime = endDate - beginDate;
                const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
                coverageCell.textContent = differenceInDays; // Set calculated value
            } else {
                coverageCell.textContent = 'N/A'; // Display "N/A" if dates are missing or invalid
            }

            row.addEventListener("click", handleRowClick); // Add click event listener to each row
        });

        updateTotalRowCount(data.length); // Update total row count
    }

    // Update total row count
    function updateTotalRowCount(count) {
        const rowCountElement = document.getElementById('rowCount');
        rowCountElement.textContent = `Total Rows: ${count}`;
    }

    // Filter table based on search inputs
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

    // Handle row click for modal display
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


           

document.addEventListener('DOMContentLoaded', () => {
    const csvUrl = 'https://raw.githubusercontent.com/dmgastrana/Information/main/datatable.csv';
    let equipmentData = [];

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

    function displayResults(data) {
        const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
        resultTable.innerHTML = ''; // Clear existing rows

        data.forEach((item) => {
            const row = resultTable.insertRow();

            // Insert cells in the correct column order
            row.insertCell().textContent = item['Serial Number'] || ''; // Column 1
            row.insertCell().textContent = item['UP#'] || ''; // Column 2
            row.insertCell().textContent = item['Make'] || ''; // Column 3
            row.insertCell().textContent = item['Office'] || ''; // Column 4
            row.insertCell().textContent = item['Modality'] || ''; // Column 5
            row.insertCell().textContent = item['Status'] || ''; // Column 6
            row.insertCell().textContent = item['Room'] || ''; // Column 7
            row.insertCell().textContent = item['Tech'] || ''; // Column 8
            row.insertCell().textContent = item['Equipment'] || ''; // Column 9
            row.insertCell().textContent = item['Contract/Warranty Begin'] || ''; // Column 10
            row.insertCell().textContent = item['Contract/Warranty End'] || ''; // Column 11
             row.insertCell().textContent = item['Service Contract'] || ''; // Column 12

            // Insert a cell for the Service Contract column with a clickable link
            const serviceContractCell = row.insertCell();
            if (item['Service Contract']) {
                const link = document.createElement('a');
                // Construct the full URL for the Service Contract
                link.href = `https://raw.githubusercontent.com/dmgastrana/Information/main/${item['Service Contract']}`;
                link.textContent = 'View Contract';
                link.target = '_blank'; // Open in a new tab
                serviceContractCell.appendChild(link);
            } else {
                serviceContractCell.textContent = ''; // Leave blank if no contract
            }

            row.insertCell().textContent = item['Service Support'] || ''; // Column 13
            row.insertCell().textContent = item['Support Phone#'] || ''; // Column 14
            row.insertCell().textContent = item['Support Email'] || ''; // Column 15
            row.insertCell().textContent = item['Coverage Days Left'] || ''; // Column 16
            row.insertCell().textContent = item['Service Annual Fee'] || ''; // Column 17
            row.insertCell().textContent = item['Note'] || ''; // Column 18
            row.insertCell().textContent = item['Purchase From'] || ''; // Column 19
            row.insertCell().textContent = item['Purchase Date'] || ''; // Column 20
            row.insertCell().textContent = item['Delivery Date'] || ''; // Column 21
            row.insertCell().textContent = item['Install Date'] || ''; // Column 22
            row.insertCell().textContent = item['Remove By'] || ''; // Column 23
            row.insertCell().textContent = item['Remove Date'] || ''; // Column 24
            row.insertCell().textContent = item['Remove Description'] || ''; // Column 25

            // Add click event listener for each row (for vertical view modal)
            row.addEventListener("click", handleRowClick);
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

        verticalDataContainer.innerHTML = ""; // Clear the modal content

        headers.forEach((header, index) => {
            const headerText = header.textContent;
            const dataText = data[index] ? data[index].textContent : ''; // Get cell data or fallback to empty

            verticalDataContainer.innerHTML += `
                <tr>
                    <th>${headerText}</th>
                    <td>${dataText}</td>
                </tr>
            `;
        });

        // Show the modal
        document.getElementById("verticalView").style.display = "block";
        document.getElementById("modalOverlay").style.display = "block";
    }

    // Close modal function
    document.getElementById("closeModal").addEventListener("click", function () {
        document.getElementById("verticalView").style.display = "none";
        document.getElementById("modalOverlay").style.display = "none";
    });
});


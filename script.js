document.addEventListener('DOMContentLoaded', () => {
    const csvUrl = 'https://raw.githubusercontent.com/dmgastrana/Information/main/datatable.csv'; // URL of your CSV file
    let equipmentData = [];

    console.log('Fetching CSV from URL:', csvUrl); // Log the URL being fetched

    // Parse the CSV using PapaParse
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function(results) {
            console.log('Parsed CSV data:', results.data); // Log the parsed CSV data
            equipmentData = results.data; // Store parsed data
            localStorage.setItem('equipmentData', JSON.stringify(equipmentData)); // Cache the data locally
            displayResults(equipmentData); // Display the table rows
        },
        error: function(error) {
            console.error('Error parsing CSV:', error); // Log errors during CSV parsing
        }
    });

    // Add input event listeners to all search fields
    document.querySelectorAll('.search-container input').forEach(input => {
        input.addEventListener('input', filterTable);
    });

    // Function to display table rows
    function displayResults(data) {
        console.log('Displaying results:', data); // Debugging log
        const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
        resultTable.innerHTML = ''; // Clear existing rows

        data.forEach(item => {
            const row = resultTable.insertRow(); // Create a new row

            Object.entries(item).forEach(([key, val]) => {
                const cell = row.insertCell();

                // Dynamically create "View PDF" links for the Service Contract column
                if (key === 'Service Contract') {
                    const serialNumber = item['Serial Number'] || ''; // Get the Serial Number
                    const pdfUrl = `https://raw.githubusercontent.com/dmgastrana/Information/main/${serialNumber}.pdf`; // Construct the PDF URL
                    
                    cell.innerHTML = `<a href="${pdfUrl}" target="_blank" class="service-contract-link">View PDF</a>`;
                    cell.querySelector('a').addEventListener('click', (e) => e.stopPropagation()); // Prevent row click when clicking the link
                } else {
                    cell.textContent = val || ''; // Populate other cells with data
                    cell.setAttribute('tabindex', '0'); // Add tab indexing for accessibility
                }
            });

            row.addEventListener("click", handleRowClick); // Add row click event for showing details
        });

        updateTotalRowCount(data.length); // Update the row count
    }

    // Update the total row count display
    function updateTotalRowCount(count) {
        const rowCountElement = document.getElementById('rowCount');
        rowCountElement.textContent = `Total Rows: ${count}`;
    }

    // Filter the table rows based on search inputs
    function filterTable() {
        const serialNumberValue = document.getElementById('serialNumber').value.toLowerCase();
        const makeValue = document.getElementById('make').value.toLowerCase();
        const officeValue = document.getElementById('office').value.toLowerCase();
        const modalityValue = document.getElementById('modality').value.toLowerCase();

        const filteredData = equipmentData.filter(item => {
            return (
                (item['Serial Number'] || '').toLowerCase().includes(serialNumberValue) &&
                (item['Make'] || '').toLowerCase().includes(makeValue) &&
                (item['Office'] || '').toLowerCase().includes(officeValue) &&
                (item['Modality'] || '').toLowerCase().includes(modalityValue)
            );
        });

        displayResults(filteredData); // Display the filtered rows
    }

    // Handle row click to show vertical details view
    function handleRowClick(event) {
        const row = event.target.closest("tr");
        const headers = Array.from(document.querySelectorAll("#resultTable th"));
        const data = Array.from(row.children);
        const verticalDataContainer = document.getElementById("verticalData");

        verticalDataContainer.innerHTML = ""; // Clear previous data

        headers.forEach((header, index) => {
            const headerText = header.textContent;
            const dataCell = data[index];

            // Special handling for Service Contract column
            if (headerText === 'Service Contract' && dataCell.querySelector('a')) {
                verticalDataContainer.innerHTML += `
                    <tr>
                        <th>${headerText}</th>
                        <td><a href="${dataCell.querySelector('a').href}" target="_blank" class="service-contract-link">View PDF</a></td>
                    </tr>
                `;
            } else {
                verticalDataContainer.innerHTML += `
                    <tr>
                        <th>${headerText}</th>
                        <td>${dataCell.textContent}</td>
                    </tr>
                `;
            }
        });

        // Show the modal for vertical details
        document.getElementById("verticalView").style.display = "block";
        document.getElementById("modalOverlay").style.display = "block";
    }

    // Close the vertical details modal
    document.getElementById("closeModal").addEventListener("click", function () {
        document.getElementById("verticalView").style.display = "none";
        document.getElementById("modalOverlay").style.display = "none";
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const csvUrl = 'https://raw.githubusercontent.com/dmgastrana/Information/main/datatable.csv';
    let equipmentData = [];

    console.log('Fetching CSV from URL:', csvUrl);

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

    // Event listeners for search fields
    document.querySelectorAll('.search-container input').forEach(input => {
        input.addEventListener('input', filterTable);
    });

    function displayResults(data) {
        console.log('Displaying results:', data);
        const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];

        resultTable.innerHTML = ''; // Clear previous rows

        data.forEach((item) => {
            const row = resultTable.insertRow();

            Object.entries(item).forEach(([key, val]) => {
                const cell = row.insertCell();

                if (key === 'Service Contract') {
                    // Generate "View PDF" link dynamically based on the Serial Number
                    const serialNumber = item['Serial Number'] || '';
                    const pdfUrl = `https://raw.githubusercontent.com/dmgastrana/Information/main/${serialNumber}.pdf`;

                    cell.innerHTML = `<a href="${pdfUrl}" target="_blank" class="service-contract-link">View PDF</a>`;
                    // Prevent row click event when clicking the link
                    cell.querySelector('a').addEventListener('click', (e) => e.stopPropagation());
                } else {
                    // Populate other cells normally
                    cell.textContent = val || '';
                    cell.setAttribute('tabindex', '0');
                }
            });

            row.addEventListener("click", handleRowClick);
        });

        updateTotalRowCount(data.length);
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
            return (
                (item['Serial Number'] || '').toLowerCase().includes(serialNumberValue) &&
                (item['Make'] || '').toLowerCase().includes(makeValue) &&
                (item['Office'] || '').toLowerCase().includes(officeValue) &&
                (item['Modality'] || '').toLowerCase().includes(modalityValue)
            );
        });

        displayResults(filteredData);
    }

    function handleRowClick(event) {
        const row = event.target.closest("tr");
        const headers = Array.from(document.querySelectorAll("#resultTable th"));
        const data = Array.from(row.children);
        const verticalDataContainer = document.getElementById("verticalData");

        verticalDataContainer.innerHTML = ""; // Clear previous data

        headers.forEach((header, index) => {
            const headerText = header.textContent;
            const dataCell = data[index];

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

        document.getElementById("verticalView").style.display = "block";
        document.getElementById("modalOverlay").style.display = "block";
    }

    // Close modal function
    document.getElementById("closeModal").addEventListener("click", function () {
        document.getElementById("verticalView").style.display = "none";
        document.getElementById("modalOverlay").style.display = "none";
    });
});



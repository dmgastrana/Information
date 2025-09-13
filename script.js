
document.addEventListener('DOMContentLoaded', () => {
    const csvUrl = 'https://raw.githubusercontent.com/dmgastrana/Information/main/datatable.csv';
    let equipmentData = [];

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        transformHeader: header => header.trim(),
        complete: function(results) {
            equipmentData = results.data;
            localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
            displayResults(equipmentData);
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
        }
    });

    document.querySelectorAll('.search-container input').forEach(input => {
        input.addEventListener('input', filterTable);
    });

    function displayResults(data) {
        const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
        resultTable.innerHTML = '';

        data.forEach((item) => {
            const row = resultTable.insertRow();
            Object.entries(item).forEach(([key, val]) => {
                const cell = row.insertCell();
                cell.textContent = val || '';
                cell.setAttribute('tabindex', '0');
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
        const servicesupportValue = document.getElementById('servicesupport').value.toLowerCase();

        const filteredData = equipmentData.filter(item => {
            const serialNumberMatch = item['Serial Number'] && item['Serial Number'].toLowerCase().includes(serialNumberValue);
            const makeMatch = item['Make'] && item['Make'].toLowerCase().includes(makeValue);
            const officeMatch = item['Office'] && item['Office'].toLowerCase().includes(officeValue);
            const modalityMatch = item['Modality'] && item['Modality'].toLowerCase().includes(modalityValue);
            const serviceSupportMatch = item['Service Support'] && item['Service Support'].toLowerCase().includes(servicesupportValue);

            return serialNumberMatch && makeMatch && officeMatch && modalityMatch && serviceSupportMatch;
        });

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

    document.getElementById("closeModal").addEventListener("click", function () {
        document.getElementById("verticalView").style.display = "none";
        document.getElementById("modalOverlay").style.display = "none";
    });

    const password = "dmg1129";
    const





document.addEventListener('DOMContentLoaded', () => {
    const csvUrl = 'https://raw.githubusercontent.com/dmgastrana/Information/main/datatable.csv';
    let equipmentData = [];

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function(results) {
            equipmentData = results.data;
            localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
            displayResults(equipmentData);

            // Run alert AFTER table loads
            checkExpiringContracts(equipmentData);
        }
    });

    document.querySelectorAll('.search-container input').forEach(input => {
        input.addEventListener('input', filterTable);
    });

    function displayResults(data) {
        const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
        resultTable.innerHTML = '';

        data.forEach(item => {
            const row = resultTable.insertRow();
            Object.entries(item).forEach(([key, val]) => {
                const cell = row.insertCell();

                if (key === 'Service Contract') {
                    const serialNumber = item['Serial Number']?.trim() || '';
                    const pdfUrl = `https://raw.githubusercontent.com/dmgastrana/Information/main/${serialNumber}.pdf`;

                    if (serialNumber) {
                        fetch(pdfUrl, { method: 'HEAD' })
                            .then(response => {
                                if (response.ok) {
                                    cell.innerHTML = `<a href="${pdfUrl}" target="_blank">View PDF</a>`;
                                } else {
                                    cell.textContent = "";
                                }
                            });
                    } else {
                        cell.textContent = "";
                    }
                } else {
                    cell.textContent = val || '';
                }
            });

            row.addEventListener("click", handleRowClick);
        });

        updateTotalRowCount(data.length);
    }

    function updateTotalRowCount(count) {
        document.getElementById('rowCount').textContent = `Total Rows: ${count}`;
    }

    function filterTable() {
        const serialNumberValue = document.getElementById('serialNumber').value.toLowerCase();
        const makeValue = document.getElementById('make').value.toLowerCase();
        const officeValue = document.getElementById('office').value.toLowerCase();
        const modalityValue = document.getElementById('modality').value.toLowerCase();
        const servicesupportValue = document.getElementById('servicesupport').value.toLowerCase();

        const filteredData = equipmentData.filter(item => {
            return (
                (item['Serial Number'] || '').toLowerCase().includes(serialNumberValue) &&
                (item['Make'] || '').toLowerCase().includes(makeValue) &&
                (item['Office'] || '').toLowerCase().includes(officeValue) &&
                (item['Modality'] || '').toLowerCase().includes(modalityValue) &&
                (item['Service Support'] || '').toLowerCase().includes(servicesupportValue)
            );
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
            const dataCell = data[index];

            if (headerText === 'Service Contract' && dataCell.querySelector('a')) {
                verticalDataContainer.innerHTML += `
                    <tr>
                        <th>${headerText}</th>
                        <td><a href="${dataCell.querySelector('a').href}" target="_blank">View PDF</a></td>
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

    document.getElementById("closeModal").addEventListener("click", function () {
        document.getElementById("verticalView").style.display = "none";
        document.getElementById("modalOverlay").style.display = "none";
    });

    // 🔔 CONTRACT EXPIRATION ALERT FUNCTION
    function checkExpiringContracts(data) {
        const today = new Date();
        const ninetyDays = 90 * 24 * 60 * 60 * 1000;

        let expiringSoon = [];

        data.forEach(item => {
            const endDateStr = item['Contract/Warranty End']; // ✅ CORRECT COLUMN NAME
            if (!endDateStr || endDateStr.toLowerCase() === "n/a" || endDateStr.toLowerCase() === "no contract") return;

            const endDate = new Date(endDateStr);
            if (isNaN(endDate)) return;

            const timeDiff = endDate - today;

            if (timeDiff > 0 && timeDiff <= ninetyDays) {
                expiringSoon.push({
                    serial: item['Serial Number'],
                    office: item['Office'],
                    modality: item['Modality'],
                    endDate: endDateStr
                });
            }
        });

        if (expiringSoon.length > 0) {
            let message = `⚠️ ${expiringSoon.length} contract(s) expire within 90 days:\n\n`;

            expiringSoon.forEach(item => {
                message += `• ${item.serial} (${item.modality}, ${item.office}) — Ends: ${item.endDate}\n`;
            });

            alert(message);
        }
    }
});






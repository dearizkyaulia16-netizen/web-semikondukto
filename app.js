
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("uploadForm");
    const fileInput = document.getElementById("datasetFile");
    const tableBody = document.querySelector("#dataTable tbody");

    let resistivityChart = null;
    let conductivityChart = null;

 // FITUR PENCARIAN TABEL
const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        const keyword = this.value.toLowerCase();
        const rows = tableBody.querySelectorAll("tr");

        rows.forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(keyword)
                ? ""
                : "none";
        });
    });
}

    // MEMBACA DATA CSV
    function readCSV(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: result => resolve(result.data),
                error: error => reject(error)
            });
        });
    }

    // MEMBACA DATA EXCEL
    function readExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function (event) {
                try {
                    const workbook = XLSX.read(event.target.result, {
                        type: "array"
                    });

                    const sheet = workbook.Sheets[workbook.SheetNames[0]];

                    resolve(XLSX.utils.sheet_to_json(sheet));
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // FORMAT ANGKA
    function formatNumber(value, digits = 6) {
        return Number(value).toExponential(digits);
    }

    // MENAMPILKAN STATISTIK
    function updateStatistics(data) {
        const values = data.map(row => row.Resistivitas_Ohm_cm);

        const average = values.reduce((a, b) => a + b, 0) / values.length;
        const minimum = Math.min(...values);
        const maximum = Math.max(...values);

        document.getElementById("statCount").textContent = data.length;
        document.getElementById("statAverage").textContent = formatNumber(average, 4);
        document.getElementById("statMinimum").textContent = formatNumber(minimum, 4);
        document.getElementById("statMaximum").textContent = formatNumber(maximum, 4);
    }

    // MENAMPILKAN TABEL
    function updateTable(data) {
        tableBody.innerHTML = "";

        data.forEach(row => {
            const tr = document.createElement("tr");

            const values = [
                row.Temperatur_C.toFixed(2),
                row.Temperatur_K.toFixed(2),
                formatNumber(row.Resistivitas_Ohm_cm),
                formatNumber(row.Resistivitas_Ohm_m),
                formatNumber(row.Konduktivitas_S_m)
            ];

            values.forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });

            tableBody.appendChild(tr);
        });
    }

    // MENAMPILKAN GRAFIK
    function updateCharts(data) {
        const temperatures = data.map(row => row.Temperatur_C);
        const resistivities = data.map(row => row.Resistivitas_Ohm_cm);
        const conductivities = data.map(row => row.Konduktivitas_S_m);

        if (resistivityChart) resistivityChart.destroy();
        if (conductivityChart) conductivityChart.destroy();

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: "#cbd5e1" }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Temperatur (°C)",
                        color: "#94a3b8"
                    },
                    ticks: { color: "#94a3b8" }
                },
                y: {
                    ticks: { color: "#94a3b8" }
                }
            }
        };

        resistivityChart = new Chart(
            document.getElementById("chartResistivity"),
            {
                type: "line",
                data: {
                    labels: temperatures,
                    datasets: [{
                        label: "Resistivitas (Ω cm)",
                        data: resistivities,
                        borderColor: "#38bdf8",
                        backgroundColor: "rgba(56,189,248,0.15)",
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: options
            }
        );

        conductivityChart = new Chart(
            document.getElementById("chartConductivity"),
            {
                type: "line",
                data: {
                    labels: temperatures,
                    datasets: [{
                        label: "Konduktivitas (S/m)",
                        data: conductivities,
                        borderColor: "#4ade80",
                        backgroundColor: "rgba(74,222,128,0.15)",
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: options
            }
        );
    }

    // PROSES ANALISIS DATA
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const file = fileInput.files[0];

            if (!file) {
                alert("Silakan pilih dataset terlebih dahulu.");
                return;
            }

            try {
                let rawData;

                if (file.name.toLowerCase().endsWith(".csv")) {
                    rawData = await readCSV(file);
                } else if (file.name.toLowerCase().endsWith(".xlsx")) {
                    rawData = await readExcel(file);
                } else {
                    throw new Error("Format file harus CSV atau XLSX.");
                }

                const data = rawData.map(row => {
                    const temperature = Number(row.Temperatur_C);
                    const resistivity = Number(row.Resistivitas_Ohm_cm);

                    if (!Number.isFinite(temperature) ||
                        !Number.isFinite(resistivity) ||
                        resistivity <= 0) {
                        throw new Error("Dataset memiliki nilai yang tidak valid.");
                    }

                    const resistivityOhmM = resistivity * 0.01;

                    return {
                        Temperatur_C: temperature,
                        Temperatur_K: temperature + 273.15,
                        Resistivitas_Ohm_cm: resistivity,
                        Resistivitas_Ohm_m: resistivityOhmM,
                        Konduktivitas_S_m: 1 / resistivityOhmM
                    };
                });

                if (data.length === 0) {
                    throw new Error("Dataset tidak memiliki data.");
                }

                updateStatistics(data);
                updateTable(data);
                updateCharts(data);

                document.getElementById("analysisStatus").textContent =
                    "✓ Dataset berhasil dianalisis.";

            } catch (error) {
                alert("Gagal menganalisis data: " + error.message);
            }
        });
    }

});

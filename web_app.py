
from flask import Flask, render_template, request
import csv
from io import StringIO
from openpyxl import load_workbook

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analisis", methods=["POST"])
def analisis():
    file = request.files.get("file")

    if file is None or file.filename == "":
        return render_template(
            "index.html",
            error="Silakan pilih file dataset terlebih dahulu."
        )

    try:
        nama_file = file.filename.lower()

        # MEMBACA FILE CSV
        if nama_file.endswith(".csv"):
            isi_file = file.stream.read().decode("utf-8-sig")
            pembaca = csv.DictReader(StringIO(isi_file))
            baris_data = list(pembaca)

        # MEMBACA FILE EXCEL
        elif nama_file.endswith(".xlsx"):
            workbook = load_workbook(file, data_only=True)
            sheet = workbook.active

            baris = list(sheet.values)

            if not baris:
                return render_template(
                    "index.html",
                    error="Dataset kosong."
                )

            header = [
                str(nama).strip() if nama is not None else ""
                for nama in baris[0]
            ]

            baris_data = [
                dict(zip(header, row))
                for row in baris[1:]
            ]

        else:
            return render_template(
                "index.html",
                error="Format file harus CSV atau Excel (.xlsx)."
            )

        # MEMERIKSA KOLOM
        if not baris_data:
            return render_template(
                "index.html",
                error="Dataset tidak memiliki data."
            )

        kolom = list(baris_data[0].keys())

        if (
            "Temperatur_C" not in kolom
            or "Resistivitas_Ohm_cm" not in kolom
        ):
            return render_template(
                "index.html",
                error="Kolom harus bernama Temperatur_C dan Resistivitas_Ohm_cm."
            )

        # MENGOLAH DATA
        data = []

        for row in baris_data:
            temperatur = float(row["Temperatur_C"])
            resistivitas = float(row["Resistivitas_Ohm_cm"])

            if resistivitas <= 0:
                raise ValueError(
                    "Resistivitas harus lebih besar dari nol."
                )

            temperatur_k = temperatur + 273.15
            resistivitas_ohm_m = resistivitas * 0.01
            konduktivitas = 1 / resistivitas_ohm_m

            data.append({
                "Temperatur_C": temperatur,
                "Temperatur_K": temperatur_k,
                "Resistivitas_Ohm_cm": resistivitas,
                "Resistivitas_Ohm_m": resistivitas_ohm_m,
                "Konduktivitas_S_m": konduktivitas
            })

        if not data:
            return render_template(
                "index.html",
                error="Dataset kosong."
            )

        # STATISTIK
        nilai_resistivitas = [
            row["Resistivitas_Ohm_cm"] for row in data
        ]

        rata_rata = sum(nilai_resistivitas) / len(nilai_resistivitas)
        minimum = min(nilai_resistivitas)
        maksimum = max(nilai_resistivitas)

        return render_template(
            "index.html",
            data=data,
            rata_rata=rata_rata,
            minimum=minimum,
            maksimum=maksimum,
            jumlah=len(data),
            hasil=True
        )

    except Exception as e:
        return render_template(
            "index.html",
            error=f"Data gagal dianalisis: {e}"
        )


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )

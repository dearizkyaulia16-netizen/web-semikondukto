# Web Semikondukto – Semiconductor Analyzer

## Deskripsi Proyek
Web Semikondukto merupakan aplikasi berbasis web yang dikembangkan untuk membantu menganalisis karakteristik listrik material semikonduktor berdasarkan data temperatur dan resistivitas.

Aplikasi ini dibuat menggunakan Python dan Flask dengan tampilan dashboard interaktif.

## Tujuan
1. Memahami hubungan temperatur dengan resistivitas semikonduktor.
2. Mengolah dataset secara otomatis.
3. Menghitung nilai konduktivitas material.
4. Menampilkan hasil analisis dalam bentuk grafik dan tabel.

## Fitur Utama
- Upload dataset berformat CSV dan Excel (.xlsx).
- Validasi format dan kolom dataset.
- Konversi temperatur Celsius ke Kelvin.
- Konversi resistivitas Ω·cm ke Ω·m.
- Perhitungan konduktivitas listrik.
- Perhitungan statistik data.
- Visualisasi grafik dan tabel hasil analisis.

## Teknologi yang Digunakan
- Python
- Flask
- HTML
- CSS
- JavaScript
- Chart.js
- OpenPyXL

## Format Dataset
Dataset harus memiliki kolom:
- `Temperatur_C`
- `Resistivitas_Ohm_cm`

## Rumus Perhitungan

Konversi temperatur:

T(K) = T(°C) + 273,15

Konversi resistivitas:

ρ(Ω·m) = ρ(Ω·cm) × 0,01

Konduktivitas:

σ = 1/ρ

## Struktur Proyek
- `web_app.py` – Program backend Flask.
- `templates/` – Folder halaman HTML.
- `requirements.txt` – Daftar dependensi Python.
- `dataset_silikon_p_type.csv` – Dataset analisis.

## Sumber Data
Sumber dan referensi ilmiah dataset akan dicantumkan setelah proses verifikasi asal data selesai.

## Pengembang
Proyek ini dikembangkan sebagai bagian dari tugas UAS kelompok pada bidang Fisika.

**Nama Proyek:** Web Semikondukto  
**Nama Aplikasi:** Semiconductor Analyzer

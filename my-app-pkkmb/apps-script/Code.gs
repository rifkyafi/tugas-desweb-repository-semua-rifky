/**
 * Backend Apps Script untuk "TANDAI TUGAS" — MABA QUEST PKKMB Amaryllis-7
 *
 * NOTE: Ini referensi kontrak API yang HARUS dimiliki skrip yang ter-deploy di
 * URL NEXT_PUBLIC_APPS_SCRIPT_URL (versi lama sudah mengikuti kontrak ini).
 * Jika ingin mengganti skrip, pastikan doPost mengikuti kontrak di bawah ini.
 *
 * Kontrak API (POST, Content-Type: text/plain, body JSON):
 *   { "name": "<nama anggota>", "taskCol": "<judul tugas>", "done": <bool> }
 * - name    : nama persis di kolom B
 * - taskCol : judul tugas persis di baris header (kolom C dst)
 * - done    : true → tulis "SUDAH", false → kosongkan sel
 * Respons sukses: {"success":true, ...}
 * Respons error  : {"error":"<pesan>"}
 *
 * Struktur sheet:
 * - Baris 1 : header, kolom B = NAMA, kolom C dst = judul tugas
 * - Baris 2+: data anggota
 * - Nilai "SUDAH" = selesai, kosong/"BELUM" = belum
 */

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ success: true, message: 'TANDAI TUGAS API is running' })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { name, taskCol, done } = body;

    if (!name || !taskCol || done === undefined) {
      return err('Field name, taskCol, done wajib');
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow < 1) return err('Sheet kosong');

    // Cari kolom tugas berdasarkan judul di baris header (baris 1)
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    let taskColIdx = -1;
    for (let c = 2; c < headers.length; c++) {
      if (String(headers[c]).trim() === String(taskCol).trim()) {
        taskColIdx = c + 1;
        break;
      }
    }
    if (taskColIdx === -1) return err('Kolom "' + taskCol + '" tidak ditemukan');

    // Cari baris anggota berdasarkan nama di kolom B (indeks 2)
    const names = sheet.getRange(2, 2, Math.max(lastRow - 1, 1), 1).getValues();
    let memberRow = -1;
    for (let r = 0; r < names.length; r++) {
      if (String(names[r][0]).trim() === String(name).trim()) {
        memberRow = r + 2;
        break;
      }
    }
    if (memberRow === -1) return err('Nama "' + name + '" tidak ditemukan');

    sheet.getRange(memberRow, taskColIdx).setValue(done ? 'SUDAH' : '');

    return ok({ name, taskCol, done });
  } catch (error) {
    return err(String(error));
  }
}

function ok(data) {
  return ContentService.createTextOutput(
    JSON.stringify({ success: true, ...data })
  ).setMimeType(ContentService.MimeType.JSON);
}

function err(message) {
  return ContentService.createTextOutput(
    JSON.stringify({ error: message })
  ).setMimeType(ContentService.MimeType.JSON);
}

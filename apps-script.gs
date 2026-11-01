/**
 * Google Apps Script – saves agent registrations into the Google Sheet
 * this script is bound to. See README.md for setup steps.
 */
const SHEET_NAME = "Registrations";
const HEADERS = ["Timestamp", "Name", "Position", "Company Name", "Email", "WhatsApp Number"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return ok_(); // honeypot filled → bot, ignore

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      clean_(p.name),
      clean_(p.position),
      clean_(p.company),
      clean_(p.email),
      // leading apostrophe keeps "+44..." as text instead of a formula/number
      "'" + String(p.whatsapp || "").trim().slice(0, 30)
    ]);
    return ok_();
  } finally {
    lock.releaseLock();
  }
}

function clean_(v) {
  let s = String(v || "").trim().slice(0, 200);
  // block spreadsheet formula injection
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

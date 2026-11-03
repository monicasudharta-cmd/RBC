/**
 * Google Apps Script – saves agent registrations into the Google Sheet
 * this script is bound to. See README.md for setup steps.
 */
const SHEET_NAME = "Registrations";
const HEADERS = ["Timestamp", "Name", "Position", "Company Name", "Email", "WhatsApp Number", "Industry", "Country / Market"];

// Optional: get an email for every new registration. Comma-separated, or leave "" to disable.
const NOTIFY_EMAIL = "";

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
    // write/refresh the header row (also adds new columns to an existing sheet)
    const header = sheet.getRange(1, 1, 1, HEADERS.length);
    if (header.getValues()[0].join("|") !== HEADERS.join("|")) {
      header.setValues([HEADERS]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      clean_(p.name),
      clean_(p.position),
      clean_(p.company),
      clean_(p.email),
      // leading apostrophe keeps "+44..." as text instead of a formula/number
      p.whatsapp ? "'" + String(p.whatsapp).trim().slice(0, 30) : "",
      clean_(p.industry),
      clean_(p.country)
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "WTM London – New agent: " + clean_(p.name) + " (" + clean_(p.company) + ")",
        body: [
          "Name: " + clean_(p.name),
          "Position: " + clean_(p.position),
          "Company: " + clean_(p.company),
          "Industry: " + clean_(p.industry),
          "Country / Market: " + clean_(p.country),
          "Email: " + clean_(p.email),
          "WhatsApp: " + (p.whatsapp || "-"),
          "",
          "All registrations: " + ss.getUrl()
        ].join("\n")
      });
    }
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

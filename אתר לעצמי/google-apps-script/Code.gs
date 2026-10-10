/**
 * מקבל לידים מהטופס באתר, שומר אותם בגיליון ושולח מייל התראה.
 * ההדבקה וההגדרה מוסברות ב-README.md
 */

var NOTIFY_EMAIL = "amit.roxas@gmail.com";
var SHEET_NAME = "לידים";

function doPost(e) {
  var p = (e && e.parameter) || {};
  var name = String(p.name || "").trim().slice(0, 200);
  var phone = String(p.phone || "").trim().slice(0, 40);
  var message = String(p.message || "").trim().slice(0, 3000);
  var page = String(p.page || "").slice(0, 300);

  if (!name || !phone || p.website) {
    return ContentService.createTextOutput("ignored");
  }

  var sheet = getSheet_();
  sheet.appendRow([new Date(), name, "'" + phone, message, page]);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: "ליד חדש מהאתר: " + name,
    body:
      "שם: " + name + "\n" +
      "טלפון: " + phone + "\n" +
      "מה הביא אותם: " + (message || "-") + "\n\n" +
      "כל הלידים בגיליון: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()
  });

  return ContentService.createTextOutput("ok");
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["תאריך", "שם מלא", "טלפון", "מה הביא אותם", "עמוד"]);
    sheet.setFrozenRows(1);
    sheet.setRightToLeft(true);
  }
  return sheet;
}

// להרצה ידנית פעם אחת מתוך העורך – מאשר הרשאות ושולח ליד ניסיון
function testLead() {
  doPost({ parameter: { name: "ליד ניסיון", phone: "050-0000000", message: "בדיקה", page: "test" } });
}

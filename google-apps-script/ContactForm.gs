/**
 * Google Apps Script: Contact form backend for "פניה אל אורנית שטרנהיים"
 *
 * 1. Paste this entire file into script.google.com (New project).
 * 2. Set RECIPIENT_EMAIL below to the address that should receive submissions.
 * 3. (Optional) Create a Google Sheet, copy its ID from the URL, set SHEET_ID below.
 * 4. Deploy: Deploy → New deployment → Web app → Execute as "Me", Who has access "Anyone".
 * 5. Copy the deployment URL ( .../exec ) into cbt-landing/js/main.js as CONTACT_FORM_SCRIPT_URL.
 */

var RECIPIENT_EMAIL = 'your-email@example.com'; // Change to the email that should receive form submissions
var SHEET_ID = ''; // Optional: Google Sheet ID from the URL (e.g. https://docs.google.com/spreadsheets/d/SHEET_ID/edit). Leave '' to skip logging to sheet.

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return response(400, { success: false, error: 'No data' });
    }
    var params = e.parameter;

    // Honeypot: treat as spam if bot-field was filled
    if (params['bot-field'] && String(params['bot-field']).trim() !== '') {
      return response(200, { success: true });
    }

    var name = (params.name && String(params.name).trim()) || '';
    var phone = (params.phone && String(params.phone).trim()) || '';
    var email = (params.email && String(params.email).trim()) || '';
    var body = (params.body && String(params.body).trim()) || '';

    if (!name || !email) {
      return response(400, { success: false, error: 'Missing name or email' });
    }

    // Optional: append to Google Sheet
    if (SHEET_ID) {
      try {
        var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
        var headers = sheet.getLastRow() === 0;
        if (headers) {
          sheet.appendRow(['תאריך', 'שם', 'טלפון', 'אימייל', 'תוכן הפניה']);
        }
        sheet.appendRow([new Date(), name, phone, email, body]);
      } catch (err) {
        // Log but don't fail the request
        console.error('Sheet append failed: ' + err);
      }
    }

    // Send email via GmailApp (better deliverability) with Reply-To so recipient can reply to submitter
    var subject = 'פניה מאתר – ' + name;
    var emailBody = 'שם: ' + name + '\nטלפון: ' + phone + '\nאימייל: ' + email + '\n\nתוכן הפניה:\n' + (body || '(ללא תוכן)');
    GmailApp.sendEmail(RECIPIENT_EMAIL, subject, emailBody, {
      replyTo: email,
      name: 'טפס יצירת קשר – האתר'
    });

    return response(200, { success: true });
  } catch (err) {
    console.error(err);
    return response(500, { success: false, error: 'Server error' });
  }
}

function response(statusCode, obj) {
  var output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

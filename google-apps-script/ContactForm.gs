/**
 * Google Apps Script: Contact form backend for "פניה אל אורנית שטרנהיים"
 *
 * 1. Paste this entire file into script.google.com (New project).
 * 2. Set RECIPIENT_EMAIL below to the address that should receive submissions.
 * 3. (Optional) Create a Google Sheet, copy its ID from the URL, set SHEET_ID below.
 * 4. Deploy: Deploy → New deployment → Web app → Execute as "Me", Who has access "Anyone".
 * 5. Copy the deployment URL ( .../exec ) into cbt-landing/js/main.js as CONTACT_FORM_SCRIPT_URL.
 */

// Set these in script.google.com only — do not commit real values to the repo.
var RECIPIENT_EMAIL = ''; // Email that should receive form submissions (set in GAS project).
var SHEET_ID = ''; // Optional: Google Sheet ID from the URL (e.g. https://docs.google.com/spreadsheets/d/SHEET_ID/edit). Leave '' to skip logging to sheet.

var MAX_NAME = 200;
var MAX_PHONE = 30;
var MAX_EMAIL = 254;
var MAX_BODY = 5000;
var RATE_LIMIT_MAX = 10;
var RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour
var FORM_TIME_MAX_AGE_SEC = 900;   // 15 minutes
var FORM_TIME_FUTURE_TOLERANCE_SEC = 60;

/** Strip CR, LF, NUL to prevent header/body injection */
function sanitize(str) {
  if (str == null || typeof str !== 'string') return '';
  return str.replace(/[\r\n\u0000]/g, '');
}

/** Basic email format and length (RFC 5321 max local+domain = 254) */
function isValidEmail(email) {
  if (!email || email.length > MAX_EMAIL) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Global rate limit: max RATE_LIMIT_MAX submissions per RATE_LIMIT_WINDOW_MS */
function checkRateLimit() {
  var props = PropertiesService.getScriptProperties();
  var key = 'contact_form_timestamps';
  var now = Date.now();
  var cutoff = now - RATE_LIMIT_WINDOW_MS;
  var data = props.getProperty(key);
  var timestamps;
  try {
    timestamps = data ? JSON.parse(data) : [];
    if (!Array.isArray(timestamps)) timestamps = [];
  } catch (e) {
    timestamps = [];
  }
  timestamps = timestamps.filter(function (t) { return t > cutoff; });
  if (timestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }
  timestamps.push(now);
  props.setProperty(key, JSON.stringify(timestamps));
  return true;
}

/** Validate form-time is within allowed window (reduces old/forged submissions) */
function isValidFormTime(formTimeStr) {
  if (!formTimeStr) return false;
  var t = parseInt(formTimeStr, 10);
  if (isNaN(t)) return false;
  var nowSec = Math.floor(Date.now() / 1000);
  if (t > nowSec + FORM_TIME_FUTURE_TOLERANCE_SEC) return false;
  if (t < nowSec - FORM_TIME_MAX_AGE_SEC) return false;
  return true;
}

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return response(400, { success: false, error: 'Invalid request' });
    }
    var params = e.parameter;

    // Honeypot: treat as spam if bot-field was filled
    if (params['bot-field'] && String(params['bot-field']).trim() !== '') {
      return response(200, { success: true });
    }

    // Rate limit (global)
    if (!checkRateLimit()) {
      return response(429, { success: false, error: 'Invalid request' });
    }

    // Form-time: must be present and within window (reduces non-JS bots and old forms)
    var formTimeStr = params['form-time'] && String(params['form-time']).trim();
    if (!formTimeStr || !isValidFormTime(formTimeStr)) {
      return response(400, { success: false, error: 'Invalid request' });
    }

    var name = sanitize((params.name && String(params.name).trim()) || '');
    var phone = sanitize((params.phone && String(params.phone).trim()) || '');
    var email = sanitize((params.email && String(params.email).trim()) || '');
    var body = sanitize((params.body && String(params.body).trim()) || '');

    if (!name || !email) {
      return response(400, { success: false, error: 'Invalid request' });
    }
    if (!isValidEmail(email)) {
      return response(400, { success: false, error: 'Invalid request' });
    }
    if (name.length > MAX_NAME || phone.length > MAX_PHONE || email.length > MAX_EMAIL || body.length > MAX_BODY) {
      return response(400, { success: false, error: 'Invalid request' });
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

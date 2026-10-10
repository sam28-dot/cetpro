/**
 * Google Apps Script Gmail bridge for CET Predictor Pro.
 * Deploy as a Web App executing as the owner, accessible to anyone.
 * Set Script Property SHARED_SECRET to the same secret as Render's
 * GOOGLE_APPS_SCRIPT_SECRET. This sends via Google's Gmail service over HTTPS,
 * avoiding Render Free's blocked outbound SMTP ports.
 */
function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const expected = props.getProperty('SHARED_SECRET');
    if (!expected) return json_({ ok: false, error: 'Server not configured' }, 500);

    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!payload.secret || payload.secret !== expected) {
      return json_({ ok: false, error: 'Unauthorized' }, 401);
    }
    if (!payload.to || !payload.subject || !payload.text) {
      return json_({ ok: false, error: 'Missing email fields' }, 400);
    }

    const options = { htmlBody: payload.html || payload.text };
    if (payload.fromName) options.name = payload.fromName;
    GmailApp.sendEmail(payload.to, payload.subject, payload.text, options);
    return json_({ ok: true }, 200);
  } catch (err) {
    console.error('Gmail bridge send failed: ' + (err && err.message ? err.message : err));
    return json_({ ok: false, error: 'Email delivery failed' }, 500);
  }
}

function json_(body, statusCode) {
  // Apps Script ContentService does not let web apps set arbitrary HTTP status
  // codes, so callers must check the JSON "ok" field.
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

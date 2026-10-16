/**
 * Public site configuration for Mission Ready Medical Staffing.
 *
 * FORM SUBMISSION
 * ---------------
 * This static site has no built-in backend. To accept facility requests and
 * clinician applications (including resume files), set the endpoint URLs below
 * to a form service that accepts multipart POST (for example Formspree,
 * Netlify Forms, or a private worker that emails the team).
 *
 * Example (Formspree):
 *   facilityFormEndpoint: 'https://formspree.io/f/xxxxxxxx'
 *   clinicianFormEndpoint: 'https://formspree.io/f/yyyyyyyy'
 *
 * Until an endpoint is set, the forms validate in the browser and then tell
 * the visitor to email info@missionreadymedicalstaffing.com. They will NOT
 * show a success message that implies delivery.
 *
 * Resume files are sent only through the clinician endpoint as multipart
 * FormData. Do not point either endpoint at a public directory.
 *
 * OPTIONAL FLAGS
 * --------------
 * showSdvosbBadge — hide the SDVOSB hero/footer badge if designation is pending.
 * phone — leave blank to keep the phone number off public pages.
 */
window.MRMS = {
  email: 'info@missionreadymedicalstaffing.com',
  serviceArea: 'Southern California / San Diego County',
  phone: '',
  showSdvosbBadge: true,
  facilityFormEndpoint: '',
  clinicianFormEndpoint: '',
  maxResumeBytes: 5 * 1024 * 1024
};

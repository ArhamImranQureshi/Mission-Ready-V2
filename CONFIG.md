# Form delivery configuration

This site is static HTML/CSS/JS. There is no server in the repo.

Edit `js/config.js`:

```js
facilityFormEndpoint: 'https://formspree.io/f/your-facility-id',
clinicianFormEndpoint: 'https://formspree.io/f/your-clinician-id',
```

Requirements for production:

1. The endpoint must accept `POST` with `FormData` (multipart) so resume files can be attached.
2. Do not store resumes in a public folder such as `/uploads`.
3. Do not put API keys or mailbox passwords in frontend code. Use a form provider or a server-side worker.
4. Until endpoints are set, forms validate in the browser and then tell the visitor to email `info@missionreadymedicalstaffing.com`. They will not show a false success message.

Optional:

- `phone`: set a public number to show phone in the footer. Leave blank to keep it hidden.
- `showSdvosbBadge`: set `false` to hide the SDVOSB badge if designation is still pending confirmation.

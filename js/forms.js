(function(){
  var cfg = window.MRMS || {};
  var email = cfg.email || 'info@missionreadymedicalstaffing.com';
  var maxResume = cfg.maxResumeBytes || (5 * 1024 * 1024);
  var resumeExt = { pdf:1, doc:1, docx:1 };
  var resumeMime = {
    'application/pdf':1,
    'application/msword':1,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':1
  };

  var US_STATES = [
    'Alabama','Alaska','Arizona','Arkansas','Colorado','Connecticut','Delaware',
    'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas',
    'Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
    'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
    'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
    'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
    'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming'
  ];

  function $(sel, root){ return (root || document).querySelector(sel); }
  function $$(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); }

  function fillStates(select){
    if (!select) return;
    var html = '<option value="">Select state</option>';
    html += '<option value="California">California</option>';
    US_STATES.forEach(function(s){ html += '<option value="'+s+'">'+s+'</option>'; });
    select.innerHTML = html;
  }

  function setErr(input, msg){
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var err = input.parentNode && input.parentNode.querySelector('.field-err');
    if (err){
      err.hidden = !msg;
      err.textContent = msg || '';
    }
  }

  function showMsg(el, type, text){
    if (!el) return;
    el.hidden = false;
    el.classList.remove('is-ok','is-error');
    el.classList.add(type === 'ok' ? 'is-ok' : 'is-error');
    el.textContent = text;
  }

  function emailOk(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function phoneOk(v){
    var digits = (v || '').replace(/\D/g,'');
    return digits.length >= 10;
  }

  function validateResume(input){
    var file = input.files && input.files[0];
    if (!file) return '';
    var ext = (file.name.split('.').pop() || '').toLowerCase();
    var typeOk = resumeExt[ext] || resumeMime[file.type];
    if (!typeOk) return 'Please upload a PDF or Word document (.pdf, .doc, .docx).';
    if (file.size > maxResume) return 'The resume must be 5 MB or smaller.';
    return '';
  }

  function bindFileName(input){
    if (!input) return;
    var nameEl = input.parentNode.querySelector('.file-name');
    input.addEventListener('change', function(){
      var file = input.files && input.files[0];
      if (nameEl) nameEl.textContent = file ? file.name : 'No file selected';
      setErr(input, file ? validateResume(input) : '');
    });
  }

  function serialize(form){
    var fd = new FormData(form);
    fd.append('_subject', form.getAttribute('data-subject') || 'Mission Ready website form');
    return fd;
  }

  function submitForm(form, endpoint, msg){
    var btn = form.querySelector('[type="submit"]');
    if (btn){
      btn.disabled = true;
      btn.setAttribute('aria-busy','true');
    }
    showMsg(msg, 'ok', 'Sending…');

    return fetch(endpoint, {
      method: 'POST',
      body: serialize(form),
      headers: { 'Accept': 'application/json' }
    }).then(function(res){
      if (!res.ok) throw new Error('not-ok');
      showMsg(msg, 'ok', form.getAttribute('data-success') || 'Thank you. Your submission was received.');
      form.reset();
      var nameEl = form.querySelector('.file-name');
      if (nameEl) nameEl.textContent = 'No file selected';
      $$('[aria-invalid]', form).forEach(function(i){ setErr(i, ''); });
    }).catch(function(){
      showMsg(msg, 'error', 'We could not deliver this submission. Please email '+email+' and try again later.');
    }).then(function(){
      if (btn){
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
      }
    });
  }

  function notConfigured(form, msg){
    showMsg(msg, 'error',
      'Online delivery is not connected yet, so this request was not sent. Please email '+email+' with the same details.');
    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.disabled = false;
  }

  function bindFacility(form){
    var msg = form.querySelector('.form-msg');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = true;
      var contact = form.elements.contactName;
      var facility = form.elements.facilityName;
      var phone = form.elements.phone;
      var mail = form.elements.email;
      var count = form.elements.staffNeeded;
      var staffing = form.elements.staffingType;
      var staff = form.elements.staffType;
      var urgency = form.elements.urgency;

      setErr(contact, contact.value.trim() ? '' : 'Enter a contact name.');
      setErr(facility, facility.value.trim() ? '' : 'Enter the facility name.');
      setErr(phone, phoneOk(phone.value) ? '' : 'Enter a phone number with at least 10 digits.');
      setErr(mail, emailOk(mail.value.trim()) ? '' : 'Enter a valid email address.');
      var n = parseInt(count.value, 10);
      setErr(count, (n > 0) ? '' : 'Enter a positive number of staff needed.');
      setErr(staffing, staffing.value ? '' : 'Select a staffing type.');
      setErr(staff, staff.value ? '' : 'Select CNA, RN, or Both.');
      setErr(urgency, urgency.value ? '' : 'Select an urgency level.');

      ok = !form.querySelector('[aria-invalid="true"]');
      if (!ok){
        showMsg(msg, 'error', 'Please correct the highlighted fields.');
        return;
      }
      if (!cfg.facilityFormEndpoint){ notConfigured(form, msg); return; }
      submitForm(form, cfg.facilityFormEndpoint, msg);
    });
  }

  function bindClinician(form){
    var msg = form.querySelector('.form-msg');
    var resume = form.elements.resume;
    bindFileName(resume);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.elements.fullName;
      var mail = form.elements.email;
      var phone = form.elements.phone;
      var license = form.elements.licenseType;
      var state = form.elements.licenseState;
      var avail = form.elements.availability;

      setErr(name, name.value.trim() ? '' : 'Enter your full name.');
      setErr(mail, emailOk(mail.value.trim()) ? '' : 'Enter a valid email address.');
      setErr(phone, phoneOk(phone.value) ? '' : 'Enter a phone number with at least 10 digits.');
      setErr(license, license.value ? '' : 'Select CNA or RN.');
      setErr(state, state.value ? '' : 'Select your license state.');
      setErr(avail, avail.value ? '' : 'Select your availability.');
      if (resume) setErr(resume, validateResume(resume));

      if (form.querySelector('[aria-invalid="true"]')){
        showMsg(msg, 'error', 'Please correct the highlighted fields.');
        return;
      }
      if (!cfg.clinicianFormEndpoint){ notConfigured(form, msg); return; }
      submitForm(form, cfg.clinicianFormEndpoint, msg);
    });
  }

  fillStates(document.getElementById('license-state'));
  fillStates(document.getElementById('a-state'));

  $$('form[data-form="facility"]').forEach(bindFacility);
  $$('form[data-form="clinician"]').forEach(bindClinician);

  $$('[data-mrms="email"]').forEach(function(el){
    if (el.tagName === 'A'){
      el.href = 'mailto:'+email;
      if (!el.textContent.trim() || el.getAttribute('data-fill') === 'true') el.textContent = email;
    } else {
      el.textContent = email;
    }
  });
  $$('[data-mrms="service-area"]').forEach(function(el){ el.textContent = cfg.serviceArea || ''; });
  $$('[data-phone-wrap]').forEach(function(el){
    if (!cfg.phone) el.hidden = true;
    else {
      var a = el.querySelector('a') || el;
      if (a.tagName === 'A'){ a.href = 'tel:'+cfg.phone.replace(/\s/g,''); a.textContent = cfg.phone; }
      else a.textContent = cfg.phone;
    }
  });
  if (!cfg.showSdvosbBadge) $$('[data-sdvosb]').forEach(function(el){ el.hidden = true; });
})();

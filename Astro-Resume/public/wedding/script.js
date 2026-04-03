// =========================================================
// CONFIGURATION — update this to your actual pickup location
// =========================================================
const BUSINESS_COORDS = { lat: 52.3676, lon: 4.9041 }; // Default: Amsterdam

const BASE_PRICE = 79.99;
const KM_RATE   = 0.20;

// =========================================================
// STICKY NAV
// =========================================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// =========================================================
// MOBILE MENU
// =========================================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// =========================================================
// DELIVERY CALCULATOR
// =========================================================
let currentDeliveryKm = 0;

const deliveryRadios      = document.querySelectorAll('input[name="delivery"]');
const deliveryAddressWrap = document.getElementById('deliveryAddressWrap');
const addressInput        = document.getElementById('addressInput');
const calcBtn             = document.getElementById('calcDistance');
const calcBtnText         = document.getElementById('calcBtnText');
const deliveryResult      = document.getElementById('deliveryResult');

deliveryRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const isDelivery = radio.value === 'delivery';
    deliveryAddressWrap.classList.toggle('open', isDelivery);
    if (!isDelivery) {
      currentDeliveryKm = 0;
      deliveryResult.className = 'delivery-result';
      deliveryResult.textContent = '';
      updatePriceDisplay();
    }
  });
});

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res  = await fetch(url, { headers: { 'Accept-Language': 'nl,en' } });
  const data = await res.json();
  if (!data.length) throw new Error('Address not found. Try adding your city or postal code.');
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

async function getRoadDistanceKm(from, to) {
  const url  = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`;
  const res  = await fetch(url);
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.length) throw new Error('Could not calculate route. Please check the address.');
  return data.routes[0].distance / 1000;
}

function formatPrice(amount) {
  return '€' + amount.toFixed(2).replace('.', ',');
}

function updatePriceDisplay() {
  const deliveryCost    = currentDeliveryKm * KM_RATE;
  const total           = BASE_PRICE + deliveryCost;
  const deliveryCostRow = document.getElementById('deliveryCostRow');
  const grandTotalEl    = document.getElementById('grandTotal');
  const bookBtn         = document.getElementById('bookBtn');

  if (currentDeliveryKm > 0) {
    deliveryCostRow.style.display = 'flex';
    document.getElementById('deliveryKm').textContent         = Math.round(currentDeliveryKm);
    document.getElementById('deliveryCostAmount').textContent = formatPrice(deliveryCost);
  } else {
    deliveryCostRow.style.display = 'none';
  }

  grandTotalEl.textContent = formatPrice(total);
  bookBtn.textContent      = `Book for ${formatPrice(total)}`;
}

calcBtn.addEventListener('click', async () => {
  const address = addressInput.value.trim();
  if (!address) {
    setDeliveryResult('error', 'Please enter a delivery address first.');
    return;
  }

  calcBtnText.textContent = '…';
  calcBtn.disabled = true;
  deliveryResult.className = 'delivery-result';
  deliveryResult.textContent = '';

  try {
    const dest = await geocodeAddress(address);
    const km   = await getRoadDistanceKm(BUSINESS_COORDS, dest);
    currentDeliveryKm = km;
    const cost = km * KM_RATE;
    setDeliveryResult('success', `📍 ${Math.round(km)} km — delivery costs ${formatPrice(cost)}`);
    updatePriceDisplay();
  } catch (err) {
    setDeliveryResult('error', err.message);
  } finally {
    calcBtnText.textContent = 'Calculate';
    calcBtn.disabled = false;
  }
});

addressInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); calcBtn.click(); }
});

function setDeliveryResult(type, msg) {
  deliveryResult.className = `delivery-result ${type}`;
  deliveryResult.textContent = msg;
}

// =========================================================
// BOOKING FORM VALIDATION
// =========================================================
const form       = document.getElementById('bookingForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: 'name',  errorId: 'nameError',  msg: 'Please enter your name.' },
    { id: 'email', errorId: 'emailError', msg: 'Please enter a valid email.' },
    { id: 'date',  errorId: 'dateError',  msg: 'Please pick your wedding date.' },
  ];

  fields.forEach(({ id, errorId, msg }) => {
    const input          = document.getElementById(id);
    const error          = document.getElementById(errorId);
    const isEmpty        = !input.value.trim();
    const isInvalidEmail = id === 'email' && !isEmpty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    const isPastDate     = id === 'date'  && !isEmpty && new Date(input.value) < new Date();

    if (isEmpty || isInvalidEmail || isPastDate) {
      input.classList.add('invalid');
      error.textContent = isInvalidEmail ? 'Please enter a valid email address.'
                        : isPastDate     ? 'Wedding date must be in the future.'
                        : msg;
      valid = false;
    } else {
      input.classList.remove('invalid');
      error.textContent = '';
    }
  });

  if (!valid) return;

  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    form.reset();
    submitBtn.style.display = 'none';
    successMsg.classList.add('visible');
  }, 900);
});

form.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('invalid');
    const errorEl = document.getElementById(input.id + 'Error');
    if (errorEl) errorEl.textContent = '';
  });
});

// =========================================================
// SCROLL REVEAL
// =========================================================
const revealEls = document.querySelectorAll('.step, .feature, .pricing__card, .quote, .portal-step, .portal-coming-soon');
const observer  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});


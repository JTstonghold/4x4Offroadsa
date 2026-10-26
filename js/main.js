const quoteForm = document.getElementById('quote-form');

quoteForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const message = 'Hi 4x4 Offroad SA, I would like a quote.\nName: ' + document.getElementById('quote-name').value +
    '\nVehicle: ' + document.getElementById('quote-vehicle').value +
    '\nLooking for: ' + document.getElementById('quote-category').value +
    '\n' + document.getElementById('quote-message').value;
  window.open('https://wa.me/27618398991?text=' + encodeURIComponent(message), '_blank');
});

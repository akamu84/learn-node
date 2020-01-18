/* eslint-disable no-param-reassign */
function autocomplete(input, latInput, lngInput) {
  if (!input) return; // skip this function if no input on page

  // eslint-disable-next-line no-undef
  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    if (place.geometry) {
      latInput.value = place.geometry.location.lat();
      lngInput.value = place.geometry.location.lng();
    }
  });

  // Don't submit form when enter pressed
  input.on('keydown', (e) => e.keyCode === 13 && e.preventDefault());
}

export default autocomplete;

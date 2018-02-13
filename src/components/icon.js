const html = require('choo/html')

export default function icon (progress, size = 128) {
  return html`
    <svg height=${size + 'px'} width=${size + 'px'} viewBox="0 0 24 24">
      <polygon id="arrow" fill=${progress ? '#3367d6' : '#666666'} points="21.884692 8.472682 16.236297 8.472682 16.236297 8.9e-05 7.763704 8.9e-05 7.763704 8.472682 2.115309 8.472682 12.000001 18.357374 21.884693 8.472682"/>
      <rect id="meter" fill="#666666" x="0.7" y="21.2" width="22.6" height="2.8"/>
      <rect id="bar" fill=${progress / (100 / 22.6)} x="0.7" y="21.2" width="0" height="2.8"/>
    </svg>
  `
}

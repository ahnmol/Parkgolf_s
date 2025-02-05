export default `
@media print {
  .print-hide {
    display: none !important;
  }
  
  body {
    margin: 0 !important;
    padding: 0 !important;
  }

  #printArea {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }

  /* 조 용지 인쇄 스타일 */
  @page {
    size: A4 landscape;
    margin: 8mm;
  }

  #groupSheetContainer {
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  #groupSheetContainer .group-title {
    margin-top: 12mm !important;
    margin-bottom: 15mm !important;
    font-size: 32pt !important;
    font-weight: bold !important;
  }

  #groupSheetContainer > div:last-child {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    justify-content: space-between !important;
    width: 92% !important;
    margin: 0 auto !important;
    padding: 0 10mm !important;
  }

  #groupSheetContainer > div:last-child > div {
    width: 43% !important;
    margin-bottom: 22mm !important;
    transform: scale(1.15) !important;
    transform-origin: top center !important;
  }

  #groupSheetContainer table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 15pt !important;
    page-break-inside: avoid !important;
  }

  #groupSheetContainer th,
  #groupSheetContainer td {
    padding: 2.8mm !important;
    height: 9mm !important;
  }

  #groupSheetContainer .course-title {
    font-size: 24pt !important;
    padding: 3.5mm !important;
    height: 11mm !important;
  }

  #groupSheetContainer .player-name {
    font-size: 17pt !important;
    padding: 3mm !important;
    height: 10mm !important;
  }

  body * {
    visibility: hidden;
  }
  
  #printArea, #printArea * {
    visibility: visible;
  }
  
  #printArea {
    position: absolute;
    left: 0;
    top: 0;
  }
  
  .print-hide {
    display: none !important;
  }
  
  .action-column {
    display: none !important;
  }

  /* 명함 인쇄 스타일 */
  [data-component="BusinessCardSheet"] {
    visibility: visible !important;
    position: absolute;
    left: 0;
    top: 0;
  }
  
  [data-component="BusinessCardSheet"] * {
    visibility: visible !important;
  }
  
  [data-component="BusinessCardModal"] > div:first-child {
    background-color: white !important;
  }
  
  [data-component="BusinessCardModal"] button {
    display: none !important;
  }
}
`; 
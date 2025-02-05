export const businessCardStyles = {
  page: {
    width: '297mm',
    height: '210mm',
    padding: '10mm',
    margin: '0',
    background: 'white',
    boxSizing: 'border-box',
    pageBreakAfter: 'always',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainer: {
    width: '277mm',
    height: '190mm',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 90mm)',
    gridTemplateRows: 'repeat(3, 60mm)',
    gap: '5mm'
  },
  card: {
    border: '1px solid black',
    padding: '3mm',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    height: '60mm',
    boxSizing: 'border-box'
  },
  cardHeader: {
    marginBottom: '2mm',
    padding: '1mm 0',
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    borderBottom: '1px solid black',
    letterSpacing: '1px'
  },
  cardContent: {
    display: 'grid',
    gridTemplateColumns: '25mm 1fr',
    gridTemplateRows: '14mm 22mm',
    gap: '0',
    border: '1px solid black',
    flex: 1,
    overflow: 'hidden'
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
    fontSize: '26px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    margin: '0',
    boxSizing: 'border-box'
  },
  printStyles: `
    @page {
      size: A4 landscape;
      margin: 0;
    }
    html {
      background: #eee;
    }
    body {
      margin: 0;
      padding: 0;
      background: #eee;
    }
    @media print {
      html, body {
        background: white;
        height: auto;
      }
      .page {
        margin: 0;
        padding: 10mm;
        height: 210mm;
        page-break-after: always;
      }
      .page:last-child {
        page-break-after: auto;
      }
    }
  `
}; 
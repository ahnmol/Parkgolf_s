export const styles = {
  container: {
    width: '100%',
    margin: '10px 0',
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen',
    color: '#333'
  },
  header: {
    textAlign: 'center',
    marginBottom: '15px',
    color: 'green',
    fontSize: '24px',
    cursor: 'text',
    fontWeight: 'bold',
    width: '100%'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: '15px',
    minWidth: '150px',
    position: 'fixed',
    top: '80px',
    left: '15px',
    width: '150px'
  },
  button: {
    padding: '6px 12px',
    margin: '3px 0',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007aff',
    color: '#fff',
    fontSize: '13px',
    width: '130px',
    transition: 'all 0.2s ease-in-out',
    transform: 'scale(1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  th: {
    padding: '8px',
    backgroundColor: '#f1f1f1',
    borderBottom: '2px solid #ddd',
    cursor: 'pointer',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  td: {
    padding: '6px',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    height: '32px',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  modal: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: {
      backgroundColor: '#fff',
      padding: '15px',
      borderRadius: '12px',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      minWidth: '300px'
    }
  },
  input: {
    width: '50px',
    padding: '4px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  printModeToggle: {
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: 1000,
    opacity: 0.6,
    transition: 'opacity 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px',
    borderRadius: '20px',
    backgroundColor: '#f5f5f5'
  },
  toggleButton: (isPrintMode) => ({
    width: '28px',
    height: '16px',
    backgroundColor: isPrintMode ? '#4CAF50' : '#ddd',
    borderRadius: '8px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }),
  toggleKnob: (isPrintMode) => ({
    width: '12px',
    height: '12px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: isPrintMode ? '14px' : '2px',
    transition: 'left 0.3s',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
  }),
  toggleLabel: {
    fontSize: '12px',
    color: '#666'
  }
};

export default styles; 
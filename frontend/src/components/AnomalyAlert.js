import React from 'react';

const AnomalyAlert = ({ anomaly }) => {
  if (!anomaly) return null;

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      border: '1px solid #ffecb5',
      color: '#664d03',
      borderRadius: '8px',
      padding: '10px',
      marginBottom: '10px',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span style={{ fontSize: '1.2rem' }}>⚠️</span>
      <div>
        <strong>Unusual Expense:</strong> {anomaly.description} ({anomaly.amount}) - {anomaly.category}
      </div>
    </div>
  );
};

export default AnomalyAlert;

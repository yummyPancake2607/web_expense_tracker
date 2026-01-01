import React from 'react';

const InsightCard = ({ insight }) => {
  if (!insight) return null;

  // Define colors based on type
  let bgColor = '#f8f9fa';
  let borderColor = '#dee2e6';
  
  if (insight.type === 'increase') {
    bgColor = '#fff3cd';
    borderColor = '#ffecb5';
  } else if (insight.type === 'concentration') {
    bgColor = '#d1e7dd';
    borderColor = '#badbcc';
  } else if (insight.type === 'weekend') {
    bgColor = '#e0cffc';
    borderColor = '#c4b5fd';
  } else if (insight.type === 'habit') {
    bgColor = '#cfe2ff';
    borderColor = '#b6d4fe';
  }

  return (
    <div style={{
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.95rem'
    }}>
      <span style={{ fontSize: '1.2rem' }}>{insight.icon || '💡'}</span>
      <span>{insight.text}</span>
    </div>
  );
};

export default InsightCard;

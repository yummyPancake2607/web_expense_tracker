import React from 'react';

const SpendingProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{ fontSize: '3rem', background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50%' }}>
        {profile.icon || '👤'}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{profile.profile}</h3>
        <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>{profile.description}</p>
      </div>
    </div>
  );
};

export default SpendingProfileCard;

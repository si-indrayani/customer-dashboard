import React from 'react';

const TrafficAnalyticsSimple: React.FC = () => {
  console.log('🔥 Simple TrafficAnalytics rendering...');
  
  return (
    <div style={{ 
      minHeight: '400px', 
      background: '#e3f2fd', 
      border: '2px solid #2196f3', 
      padding: '20px',
      margin: '20px',
      borderRadius: '8px'
    }}>
      <h2 style={{ color: '#1976d2', margin: '0 0 20px 0' }}>Traffic Analytics - Simple Test</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Visits</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2196f3' }}>8</div>
        </div>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Unique Visitors</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>8</div>
        </div>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Avg Daily</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>3</div>
        </div>
      </div>
      
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#666' }}>Chart Placeholder</h3>
        <div style={{
          height: '200px',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1976d2',
          fontSize: '1.2rem'
        }}>
          📊 Traffic Chart Would Go Here
        </div>
      </div>
    </div>
  );
};

export default TrafficAnalyticsSimple;

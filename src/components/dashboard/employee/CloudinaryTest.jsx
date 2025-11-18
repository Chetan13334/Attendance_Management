import React, { useEffect, useState } from 'react';

const CloudinaryTest = () => {
  const [envVars, setEnvVars] = useState({});
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Test environment variables
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;
    
    setEnvVars({ cloudName, preset });
    
    console.log('Cloudinary environment variables:', { cloudName, preset });
  }, []);

  const testCloudinaryConnection = async () => {
    try {
      const { cloudName, preset } = envVars;
      
      if (!cloudName || !preset) {
        setTestResult('❌ Environment variables are missing');
        return;
      }
      
      // Test if we can access the Cloudinary API
      const testUrl = `https://api.cloudinary.com/v1_1/${cloudName}/ping`;
      
      setTestResult('🔄 Testing Cloudinary connection...');
      
      const response = await fetch(testUrl);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Cloudinary connection successful! Cloud: ${data.cloud_name}`);
      } else {
        setTestResult(`❌ Cloudinary connection failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Cloudinary test error:', error);
      setTestResult(`❌ Cloudinary test error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Cloudinary Configuration Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Environment Variables:</h3>
        <p>Cloud Name: {envVars.cloudName || 'Not set'}</p>
        <p>Upload Preset: {envVars.preset || 'Not set'}</p>
      </div>
      
      <button 
        onClick={testCloudinaryConnection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Cloudinary Connection
      </button>
      
      {testResult && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>Test Result:</h3>
          <p>{testResult}</p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryTest;
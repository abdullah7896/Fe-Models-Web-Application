import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function HealthCheck() {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy' | 'error'>('checking');
  const [details, setDetails] = useState('');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const checkHealth = async () => {
    setStatus('checking');
    setDetails('Checking server health...');
    const results: string[] = [];

    try {
      // Test 1: Try the correct endpoint with prefix
      results.push('Test 1: Testing /server/make-server-53cfc738/health endpoint...');
      try {
        const response1 = await fetch(`https://${projectId}.supabase.co/functions/v1/server/make-server-53cfc738/health`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (response1.ok) {
          const result = await response1.json();
          setStatus('healthy');
          setDetails(`✅ Server is healthy! Response: ${JSON.stringify(result)}`);
          results.push(`✅ Success: ${response1.status} ${response1.statusText}`);
          results.push(`Response: ${JSON.stringify(result)}`);
          setTestResults(results);
          setLastChecked(new Date());
          return;
        } else {
          results.push(`❌ Failed: ${response1.status} ${response1.statusText}`);
          const text = await response1.text();
          results.push(`Response body: ${text}`);
        }
      } catch (err) {
        results.push(`❌ Error: ${err.message}`);
      }

      // Test 2: Try without the prefix
      results.push('\nTest 2: Testing /server endpoint without prefix...');
      try {
        const response2 = await fetch(`https://${projectId}.supabase.co/functions/v1/server`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        results.push(`Status: ${response2.status} ${response2.statusText}`);
        const text = await response2.text();
        results.push(`Response: ${text.substring(0, 200)}`);
      } catch (err) {
        results.push(`❌ Error: ${err.message}`);
      }

      // Test 3: Check if function exists
      results.push('\nTest 3: Checking if edge function is deployed...');
      results.push(`Project ID: ${projectId}`);
      results.push(`Expected URL: https://${projectId}.supabase.co/functions/v1/server/make-server-53cfc738/health`);
      
      setStatus('error');
      setDetails('❌ Server is not responding correctly. See test results below.');
      setTestResults(results);
    } catch (error) {
      setStatus('error');
      setDetails(`❌ Connection error: ${error.message}`);
      results.push(`Fatal error: ${error.message}`);
      setTestResults(results);
    }
    
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Clock className="w-6 h-6 text-yellow-500 animate-spin" />;
      case 'healthy':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'unhealthy':
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'border-yellow-500/30 bg-yellow-900/20';
      case 'healthy':
        return 'border-green-500/30 bg-green-900/20';
      case 'unhealthy':
        return 'border-orange-500/30 bg-orange-900/20';
      case 'error':
        return 'border-red-500/30 bg-red-900/20';
    }
  };

  return (
    <Card className={`${getStatusColor()} max-w-md mx-auto`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          {getStatusIcon()}
          <span>Backend Health Check</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-white/70 text-sm">Status:</p>
          <p className="text-white font-medium capitalize">{status}</p>
        </div>
        
        <div>
          <p className="text-white/70 text-sm">Details:</p>
          <p className="text-white text-sm">{details}</p>
        </div>
        
        {lastChecked && (
          <div>
            <p className="text-white/70 text-sm">Last checked:</p>
            <p className="text-white text-sm">{lastChecked.toLocaleTimeString()}</p>
          </div>
        )}
        
        <Button 
          onClick={checkHealth}
          disabled={status === 'checking'}
          className="w-full bg-white/10 hover:bg-white/20 text-white"
        >
          {status === 'checking' ? 'Checking...' : 'Check Again'}
        </Button>
        
        {status !== 'healthy' && (
          <div className="text-sm text-white/60 space-y-2">
            <p><strong>Troubleshooting tips:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Deploy the server function with: <code>supabase functions deploy server</code></li>
              <li>Set environment variables in Supabase dashboard</li>
              <li>Check project ID and keys in /utils/supabase/info.tsx</li>
            </ul>
          </div>
        )}
        
        {testResults.length > 0 && (
          <div className="text-sm text-white/60 space-y-2">
            <p><strong>Test Results:</strong></p>
            <div className="bg-black/30 p-3 rounded mt-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <p key={index} className="text-white text-xs font-mono mb-1">
                  {result}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
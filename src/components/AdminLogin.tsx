import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import { supabase, makeServerRequest } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { HealthCheck } from './HealthCheck';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Login failed. Please check your credentials.');
        return;
      }

      if (data.session) {
        // Verify admin role
        if (data.user.user_metadata?.role !== 'admin') {
          setError('Access denied. Admin privileges required.');
          await supabase.auth.signOut();
          return;
        }
        
        onLoginSuccess(data.session.access_token);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await makeServerRequest('/admin/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          adminCode: formData.adminCode
        }),
      });

      if (!result.success) {
        setError(result.message || 'Signup failed');
        return;
      }

      // Auto login after successful signup
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError('Signup successful, but login failed. Please try logging in.');
        setLoginMode('login');
        return;
      }

      if (data.session) {
        onLoginSuccess(data.session.access_token);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gray-900 border-white/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-black" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            Admin {loginMode === 'login' ? 'Login' : 'Signup'}
          </CardTitle>
          <p className="text-white/70">
            {loginMode === 'login' 
              ? 'Access the administration panel' 
              : 'Create an admin account'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={loginMode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <Label className="text-white">Email Address</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginMode === 'signup' && (
              <>
                <div>
                  <Label className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Admin Code</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Enter admin signup code"
                      value={formData.adminCode}
                      onChange={(e) => handleInputChange('adminCode', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Contact system administrator for the signup code
                  </p>
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
              {loading ? 'Please wait...' : loginMode === 'login' ? 'Login' : 'Create Account'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginMode(loginMode === 'login' ? 'signup' : 'login');
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    adminCode: ''
                  });
                }}
                className="text-yellow-400 hover:text-yellow-300 text-sm focus:outline-none"
              >
                {loginMode === 'login' 
                  ? 'Need to create an admin account?' 
                  : 'Already have an admin account?'
                }
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
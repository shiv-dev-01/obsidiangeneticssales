import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../lib/api/services/auth';
import { LoginForm } from '../components/auth/LoginForm';
import { LoginLogos } from '../components/auth/LoginLogos';
import { LoginFormData } from '../types/auth';
import toast from 'react-hot-toast';
import logo from '../../src/assets/logo.png';


export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<string>();

  const handleSubmit = async (formData: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (response.status === 1) {
        setPermission(response.is_permission);
        login({
          id: response.admin_id,
          admin_id: response.admin_id,
          name: response.name || '',
          email: response.email || '',
          is_permission: response.is_permission
        });
        
        toast.success('Login successful');
        navigate('/');
      } else {
        throw new Error(response.message || 'Invalid login credentials');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/10 to-secondary-50/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <center>
      <img
        src={logo}
        alt="WhiteLabelMD Logo"
        className="h-18 w-auto logo_my w-12"
      />
      </center>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LoginLogos permission={permission} />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-soft rounded-xl border border-primary-100/50 sm:px-10
                      transition-all duration-300 hover:shadow-lg hover:border-primary-200/80">
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
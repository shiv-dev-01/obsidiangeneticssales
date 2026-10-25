import React, { useState } from 'react';
import { KeyRound, Mail, Loader2 } from 'lucide-react';
import { LoginError } from './LoginError';
import { LoginFormData } from '../../types/auth';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && <LoginError message={error} />}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1 relative">
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="email"
            required
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg
                     shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                     focus:border-primary-500 transition-all duration-200"
            placeholder="Enter your email"
          />
          <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="current-password"
            required
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg
                     shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                     focus:border-primary-500 transition-all duration-200"
            placeholder="••••••••"
          />
          <KeyRound className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm
                 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600
                 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2
                 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200
                 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
}
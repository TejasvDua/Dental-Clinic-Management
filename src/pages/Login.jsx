import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toast } from '../components/ui/Toast';
import { Stethoscope } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        setToast({
          show: true,
          message: 'Login successful!',
          type: 'success'
        });
        
        // Navigate based on role
        if (result.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/my-profile');
        }
      } else {
        setToast({
          show: true,
          message: result.error,
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: 'An error occurred during login',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      email: 'admin@dentalclinic.com',
      password: 'admin123',
      role: 'Admin (Dr. Sarah Johnson)',
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      email: 'john.doe@email.com',
      password: 'patient123',
      role: 'Patient (John Doe)',
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-700'
    },
    {
      email: 'jane.smith@email.com',
      password: 'patient123',
      role: 'Patient (Jane Smith)',
      bgColor: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700'
    }
  ];

  const fillDemoAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Stethoscope className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            DentalCare Clinic
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Demo Accounts:
            </h3>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover:shadow-md ${account.bgColor}`}
                  onClick={() => fillDemoAccount(account)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-sm font-medium ${account.textColor}`}>
                        {account.role}
                      </p>
                      <p className="text-xs text-gray-600">
                        {account.email}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      Click to use
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Login;
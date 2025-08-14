'use client';

import { Toaster } from 'react-hot-toast';
import { useUdyamForm } from '@/hooks/useUdyamForm';
import ProgressTracker from './ProgressTracker';
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';

const UdyamRegistrationForm = () => {
  const formHook = useUdyamForm();
  const { currentStep, isOTPVerified } = formHook;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Udyam Registration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your business registration with our step-by-step process
          </p>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker 
          currentStep={currentStep} 
          isOTPVerified={isOTPVerified} 
        />

        {/* Form Steps */}
        <div className="mt-8">
          {currentStep === 1 && <Step1Form formHook={formHook} />}
          {currentStep === 2 && <Step2Form formHook={formHook} />}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            This is a demo application replicating the Udyam Registration portal
          </p>
          <p className="mt-1">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default UdyamRegistrationForm;
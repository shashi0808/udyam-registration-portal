'use client';

import { Check, Circle } from 'lucide-react';

interface ProgressStep {
  step: number;
  title: string;
  status: 'completed' | 'active' | 'pending';
}

interface ProgressTrackerProps {
  currentStep: number;
  isOTPVerified?: boolean;
}

const ProgressTracker = ({ currentStep, isOTPVerified = false }: ProgressTrackerProps) => {
  const steps: ProgressStep[] = [
    {
      step: 1,
      title: 'Aadhaar Verification',
      status: currentStep === 1 ? 'active' : isOTPVerified ? 'completed' : 'pending',
    },
    {
      step: 2,
      title: 'PAN Details',
      status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm
                  ${
                    step.status === 'completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : step.status === 'active'
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }
                  transition-all duration-300 ease-in-out
                `}
              >
                {step.status === 'completed' ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{step.step}</span>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-4
                  ${
                    step.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }
                  transition-colors duration-300 ease-in-out
                `}
                style={{ minWidth: '120px' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex items-center justify-between mt-3">
        {steps.map((step) => (
          <div key={step.step} className="flex flex-col items-center text-center max-w-[140px]">
            <span
              className={`
                text-sm font-medium
                ${
                  step.status === 'active'
                    ? 'text-blue-600'
                    : step.status === 'completed'
                    ? 'text-green-600'
                    : 'text-gray-500'
                }
                transition-colors duration-300 ease-in-out
              `}
            >
              {step.title}
            </span>
            <span
              className={`
                text-xs mt-1
                ${
                  step.status === 'active'
                    ? 'text-blue-500'
                    : step.status === 'completed'
                    ? 'text-green-500'
                    : 'text-gray-400'
                }
              `}
            >
              {step.status === 'active' && 'In Progress'}
              {step.status === 'completed' && 'Completed'}
              {step.status === 'pending' && 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
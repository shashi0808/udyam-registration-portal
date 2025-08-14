'use client';

import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Phone, Shield, CheckCircle } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import { UseUdyamFormReturn } from '@/hooks/useUdyamForm';
import { formatAadhaar, formatOTP } from '@/lib/validations';

interface Step1FormProps {
  formHook: UseUdyamFormReturn;
}

const Step1Form = ({ formHook }: Step1FormProps) => {
  const {
    step1Form,
    isOTPSent,
    isOTPVerified,
    sendOTP,
    verifyOTP,
    loadingStates
  } = formHook;

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = step1Form;

  const aadhaarValue = watch('aadhaarNumber');
  const otpValue = watch('otpNumber');

  // Format Aadhaar number as user types
  useEffect(() => {
    if (aadhaarValue) {
      const formatted = formatAadhaar(aadhaarValue);
      if (formatted !== aadhaarValue) {
        setValue('aadhaarNumber', formatted);
      }
    }
  }, [aadhaarValue, setValue]);

  // Format OTP as user types
  useEffect(() => {
    if (otpValue) {
      const formatted = formatOTP(otpValue);
      if (formatted !== otpValue) {
        setValue('otpNumber', formatted);
      }
    }
  }, [otpValue, setValue]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Aadhaar Verification
        </h2>
        <p className="text-gray-600">
          Enter your Aadhaar number to receive an OTP for verification
        </p>
      </div>

      <div className="space-y-6">
        {/* Aadhaar Number Input */}
        <Controller
          name="aadhaarNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="aadhaarNumber"
              type="text"
              label="Aadhaar Number"
              placeholder="Enter 12-digit Aadhaar number (e.g., 123456789012)"
              error={errors.aadhaarNumber?.message}
              disabled={isOTPVerified}
              maxLength={12}
              className="text-lg font-mono"
            />
          )}
        />

        {/* Send OTP Button */}
        <Button
          type="button"
          onClick={sendOTP}
          loading={loadingStates.sendingOTP}
          disabled={!aadhaarValue || aadhaarValue.length !== 12 || isOTPSent || isOTPVerified}
          className="w-full"
          leftIcon={<Phone className="w-5 h-5" />}
        >
          {isOTPSent ? 'OTP Sent' : 'Send OTP'}
        </Button>

        {/* OTP Success Message */}
        {isOTPSent && !isOTPVerified && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-800">
                OTP has been sent to your registered mobile number
              </p>
            </div>
          </div>
        )}

        {/* OTP Input */}
        {isOTPSent && (
          <Controller
            name="otpNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="otpNumber"
                type="text"
                label="Enter OTP"
                placeholder="Enter 6-digit OTP"
                error={errors.otpNumber?.message}
                disabled={isOTPVerified}
                maxLength={6}
              />
            )}
          />
        )}

        {/* Verify OTP Button */}
        {isOTPSent && !isOTPVerified && (
          <Button
            type="button"
            onClick={verifyOTP}
            loading={loadingStates.verifyingOTP}
            disabled={!otpValue || otpValue.length !== 6}
            variant="success"
            className="w-full"
            leftIcon={<CheckCircle className="w-5 h-5" />}
          >
            Verify OTP & Continue
          </Button>
        )}

        {/* Verification Success */}
        {isOTPVerified && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">
                Aadhaar verified successfully!
              </p>
            </div>
            <p className="text-sm text-green-600 text-center mt-2">
              Proceeding to next step...
            </p>
          </div>
        )}

        {/* Resend OTP */}
        {isOTPSent && !isOTPVerified && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn&apos;t receive the OTP?
            </p>
            <Button
              type="button"
              onClick={sendOTP}
              variant="outline"
              size="sm"
              disabled={loadingStates.sendingOTP}
            >
              Resend OTP
            </Button>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          For Demo Purposes:
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Use any valid 12-digit Aadhaar number format</li>
          <li>• OTP will be sent to registered mobile</li>
          <li>• Use OTP: <strong>123456</strong> for demo</li>
        </ul>
      </div>
    </div>
  );
};

export default Step1Form;
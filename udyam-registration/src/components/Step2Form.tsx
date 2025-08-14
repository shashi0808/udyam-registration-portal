'use client';

import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { CreditCard, User, Send, MapPin } from 'lucide-react';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import { UseUdyamFormReturn } from '@/hooks/useUdyamForm';
import { formatPAN, formatMobile, formatPinCode } from '@/lib/validations';

interface Step2FormProps {
  formHook: UseUdyamFormReturn;
}

const Step2Form = ({ formHook }: Step2FormProps) => {
  const {
    step2Form,
    lookupPin,
    submitForm,
    loadingStates
  } = formHook;

  const {
    control,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = step2Form;

  const panValue = watch('panNumber');
  const mobileValue = watch('mobileNumber');
  const pinCodeValue = watch('pinCode');
  const cityValue = watch('city');
  const stateValue = watch('state');

  // Format PAN as user types
  useEffect(() => {
    if (panValue) {
      const formatted = formatPAN(panValue);
      if (formatted !== panValue) {
        setValue('panNumber', formatted);
      }
    }
  }, [panValue, setValue]);

  // Format mobile as user types
  useEffect(() => {
    if (mobileValue) {
      const formatted = formatMobile(mobileValue);
      if (formatted !== mobileValue) {
        setValue('mobileNumber', formatted);
      }
    }
  }, [mobileValue, setValue]);

  // Format PIN code and lookup city/state
  useEffect(() => {
    if (pinCodeValue) {
      const formatted = formatPinCode(pinCodeValue);
      if (formatted !== pinCodeValue) {
        setValue('pinCode', formatted);
      }
      
      // Lookup city and state when PIN code is 6 digits
      if (formatted.length === 6) {
        lookupPin(formatted);
      } else {
        // Clear city and state if PIN code is incomplete
        setValue('city', '');
        setValue('state', '');
      }
    }
  }, [pinCodeValue, setValue, lookupPin]);

  const genderOptions = [
    { value: '', text: 'Select Gender' },
    { value: 'male', text: 'Male' },
    { value: 'female', text: 'Female' },
    { value: 'other', text: 'Other' },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          PAN Details & Personal Information
        </h2>
        <p className="text-gray-600">
          Enter your PAN details and personal information for registration
        </p>
      </div>

      <form onSubmit={step2Form.handleSubmit(submitForm)} className="space-y-6">
        {/* PAN Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            PAN Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="panNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="panNumber"
                  type="text"
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  error={errors.panNumber?.message}
                  maxLength={10}
                />
              )}
            />
            
            <Controller
              name="applicantName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="applicantName"
                  type="text"
                  label="Name as per PAN Card"
                  placeholder="Full name as mentioned in PAN"
                  error={errors.applicantName?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="gender"
                  label="Gender"
                  options={genderOptions}
                  error={errors.gender?.message}
                />
              )}
            />
            
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="dateOfBirth"
                  type="date"
                  label="Date of Birth"
                  error={errors.dateOfBirth?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="mobileNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="mobileNumber"
                  type="tel"
                  label="Mobile Number"
                  placeholder="10-digit mobile number"
                  error={errors.mobileNumber?.message}
                  maxLength={10}
                />
              )}
            />
            
            <Controller
              name="emailAddress"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="emailAddress"
                  type="email"
                  label="Email Address"
                  placeholder="your.email@example.com"
                  error={errors.emailAddress?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Address Information
          </h3>
          
          <div className="space-y-6">
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="address"
                  label="Complete Address"
                  placeholder="Enter your complete address"
                  error={errors.address?.message}
                  rows={3}
                />
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name="pinCode"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="pinCode"
                    type="text"
                    label="PIN Code"
                    placeholder="6-digit PIN code"
                    error={errors.pinCode?.message}
                    maxLength={6}
                    loading={loadingStates.lookingUpPin}
                  />
                )}
              />
              
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="city"
                    type="text"
                    label="City"
                    placeholder="City (auto-filled)"
                    error={errors.city?.message}
                    readOnly={!!cityValue}
                  />
                )}
              />
              
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="state"
                    type="text"
                    label="State"
                    placeholder="State (auto-filled)"
                    error={errors.state?.message}
                    readOnly={!!stateValue}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => formHook.setCurrentStep(1)}
            className="sm:w-auto"
          >
            Back to Step 1
          </Button>
          
          <Button
            type="submit"
            variant="success"
            loading={loadingStates.submittingForm}
            disabled={!isValid}
            className="flex-1"
            leftIcon={<Send className="w-5 h-5" />}
          >
            Submit Registration
          </Button>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          Tips:
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• PAN format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)</li>
          <li>• Mobile number should start with 6, 7, 8, or 9</li>
          <li>• PIN code will auto-fill city and state information</li>
          <li>• All fields marked with * are mandatory</li>
        </ul>
      </div>
    </div>
  );
};

export default Step2Form;
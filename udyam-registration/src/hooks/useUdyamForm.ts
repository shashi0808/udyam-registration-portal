'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { step1Schema, step2Schema, Step1FormData, Step2FormData } from '@/lib/validations';
import { 
  sendOTP as apiSendOTP, 
  verifyOTP as apiVerifyOTP, 
  validatePAN as apiValidatePAN, 
  submitRegistration as apiSubmitRegistration,
  lookupPinCode 
} from '@/lib/api';

export interface UseUdyamFormReturn {
  // Current step
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  // Step 1 form
  step1Form: ReturnType<typeof useForm<Step1FormData>>;
  isOTPSent: boolean;
  isOTPVerified: boolean;
  sendOTP: () => Promise<void>;
  verifyOTP: () => Promise<void>;
  
  // Step 2 form
  step2Form: ReturnType<typeof useForm<Step2FormData>>;
  lookupPin: (pinCode: string) => Promise<void>;
  
  // Form submission
  submitForm: () => Promise<void>;
  
  // Loading states
  isLoading: boolean;
  loadingStates: {
    sendingOTP: boolean;
    verifyingOTP: boolean;
    validatingPAN: boolean;
    lookingUpPin: boolean;
    submittingForm: boolean;
  };
}

export const useUdyamForm = (): UseUdyamFormReturn => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  
  const [loadingStates, setLoadingStates] = useState({
    sendingOTP: false,
    verifyingOTP: false,
    validatingPAN: false,
    lookingUpPin: false,
    submittingForm: false,
  });
  
  // Step 1 form
  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: 'onBlur',
    defaultValues: {
      aadhaarNumber: '',
      otpNumber: '',
    },
  });
  
  // Step 2 form
  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
    defaultValues: {
      panNumber: '',
      applicantName: '',
      gender: undefined,
      dateOfBirth: '',
      mobileNumber: '',
      emailAddress: '',
      address: '',
      pinCode: '',
      city: '',
      state: '',
    },
  });
  
  const isLoading = Object.values(loadingStates).some(state => state);
  
  const setLoadingState = useCallback((key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const sendOTP = useCallback(async () => {
    const aadhaarNumber = step1Form.getValues('aadhaarNumber');
    
    
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      await step1Form.trigger('aadhaarNumber');
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    setLoadingState('sendingOTP', true);
    try {
      await apiSendOTP(aadhaarNumber);
      setIsOTPSent(true);
      
      // Enable OTP field
      step1Form.setValue('otpNumber', '');
      
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setLoadingState('sendingOTP', false);
    }
  }, [step1Form, setLoadingState]);
  
  const verifyOTP = useCallback(async () => {
    const { aadhaarNumber, otpNumber } = step1Form.getValues();
    
    if (!otpNumber || !step1Form.formState.isValid) {
      await step1Form.trigger();
      return;
    }
    
    setLoadingState('verifyingOTP', true);
    try {
      await apiVerifyOTP(aadhaarNumber, otpNumber);
      setIsOTPVerified(true);
      toast.success('OTP verified successfully!');
      
      // Move to next step after a short delay
      setTimeout(() => {
        setCurrentStep(2);
      }, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'OTP verification failed');
    } finally {
      setLoadingState('verifyingOTP', false);
    }
  }, [step1Form, setLoadingState]);
  
  const lookupPin = useCallback(async (pinCode: string) => {
    if (!/^[0-9]{6}$/.test(pinCode)) {
      return;
    }
    
    setLoadingState('lookingUpPin', true);
    try {
      const result = await lookupPinCode(pinCode);
      if (result) {
        step2Form.setValue('city', result.city);
        step2Form.setValue('state', result.state);
        toast.success('Location details filled automatically!');
      } else {
        toast.error('Invalid PIN code. Please enter manually.');
      }
    } catch (error) {
      console.error('PIN lookup error:', error);
    } finally {
      setLoadingState('lookingUpPin', false);
    }
  }, [step2Form, setLoadingState]);
  
  const submitForm = useCallback(async () => {
    // Validate step 2 form
    const isValid = await step2Form.trigger();
    if (!isValid) {
      return;
    }
    
    setLoadingState('submittingForm', true);
    try {
      const step1Data = step1Form.getValues();
      const step2Data = step2Form.getValues();
      
      const formData = {
        ...step1Data,
        ...step2Data,
        submittedAt: new Date().toISOString(),
      };
      
      const result = await apiSubmitRegistration(formData);
      
      if (result.success) {
        toast.success(`Registration submitted successfully! ID: ${(result.data as { registrationId?: string })?.registrationId || 'UNKNOWN'}`);
        
        // Reset forms
        step1Form.reset();
        step2Form.reset();
        setCurrentStep(1);
        setIsOTPSent(false);
        setIsOTPVerified(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setLoadingState('submittingForm', false);
    }
  }, [step1Form, step2Form, setLoadingState]);
  
  return {
    currentStep,
    setCurrentStep,
    step1Form,
    step2Form,
    isOTPSent,
    isOTPVerified,
    sendOTP,
    verifyOTP,
    lookupPin,
    submitForm,
    isLoading,
    loadingStates,
  };
};
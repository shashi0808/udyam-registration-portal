import axios from 'axios';
import { ApiResponse, PinCodeResponse } from '@/types/form';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers or request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
    }
    return Promise.reject(error);
  }
);

// API functions
export const sendOTP = async (aadhaarNumber: string): Promise<ApiResponse> => {
  try {
    const response = await api.post('/v1/send-otp', {
      aadhaarNumber,
    });
    return response.data;
  } catch (error) {
    console.error('Send OTP error:', error);
    throw new Error('Failed to send OTP. Please try again.');
  }
};

export const verifyOTP = async (aadhaarNumber: string, otp: string): Promise<ApiResponse> => {
  try {
    const response = await api.post('/v1/verify-otp', {
      aadhaarNumber,
      otp,
    });
    return response.data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw new Error('Invalid OTP. Please try again.');
  }
};

export const validatePAN = async (panNumber: string): Promise<ApiResponse> => {
  try {
    const response = await api.post('/v1/validate-pan', {
      panNumber,
    });
    return response.data;
  } catch (error) {
    console.error('PAN validation error:', error);
    throw new Error('PAN validation failed. Please check the PAN number.');
  }
};

export const submitRegistration = async (formData: Record<string, unknown>): Promise<ApiResponse> => {
  try {
    const response = await api.post('/v1/submit-registration', formData);
    return response.data;
  } catch (error) {
    console.error('Form submission error:', error);
    throw new Error('Failed to submit registration. Please try again.');
  }
};

// PIN code lookup using a free API service
export const lookupPinCode = async (pinCode: string): Promise<PinCodeResponse | null> => {
  try {
    // Using a free PIN code API service
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pinCode}`);
    
    if (response.data && response.data[0] && response.data[0].Status === 'Success') {
      const postOffice = response.data[0].PostOffice[0];
      return {
        city: postOffice.District,
        state: postOffice.State,
        country: postOffice.Country,
        pincode: pinCode,
      };
    }
    
    return null;
  } catch (error) {
    console.error('PIN code lookup error:', error);
    return null;
  }
};

// Mock API functions for development (remove in production)
export const mockSendOTP = async (aadhaarNumber: string): Promise<ApiResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation
  if (!/^[0-9]{12}$/.test(aadhaarNumber)) {
    throw new Error('Invalid Aadhaar number format');
  }
  
  return {
    success: true,
    message: 'OTP sent successfully to your registered mobile number',
    data: { otpSent: true }
  };
};

export const mockVerifyOTP = async (aadhaarNumber: string, otp: string): Promise<ApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock OTP verification (accept 123456 as valid OTP)
  if (otp === '123456') {
    return {
      success: true,
      message: 'OTP verified successfully',
      data: { verified: true }
    };
  }
  
  throw new Error('Invalid OTP. Please try again.');
};

export const mockValidatePAN = async (panNumber: string): Promise<ApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
    throw new Error('Invalid PAN format');
  }
  
  return {
    success: true,
    message: 'PAN validated successfully',
    data: { valid: true }
  };
};

export const mockSubmitRegistration = async (_formData: Record<string, unknown>): Promise<ApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    message: 'Registration submitted successfully',
    data: { 
      registrationId: 'UDYAM-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      submittedAt: new Date().toISOString()
    }
  };
};

export default api;
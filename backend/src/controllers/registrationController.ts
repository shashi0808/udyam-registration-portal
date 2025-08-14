import { Request, Response, NextFunction } from 'express';
import { createError } from '../middleware/errorHandler';
import axios from 'axios';

// In-memory storage for demo (use database in production)
const otpStore: { [key: string]: { otp: string; timestamp: number; verified: boolean } } = {};
const registrations: any[] = [];

export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { aadhaarNumber } = req.body;
    
    // Generate OTP (in demo mode, use fixed OTP)
    const otp = process.env.DEMO_MODE === 'true' ? process.env.MOCK_OTP || '123456' : generateOTP();
    
    // Store OTP (expires in 10 minutes)
    otpStore[aadhaarNumber] = {
      otp,
      timestamp: Date.now(),
      verified: false
    };
    
    // In real implementation, send SMS here
    console.log(`OTP for ${aadhaarNumber}: ${otp}`);
    
    res.json({
      success: true,
      message: 'OTP sent successfully to your registered mobile number',
      data: {
        otpSent: true,
        expiresIn: 600 // 10 minutes in seconds
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { aadhaarNumber, otp } = req.body;
    
    const storedData = otpStore[aadhaarNumber];
    
    if (!storedData) {
      return next(createError('OTP not found. Please request a new OTP.', 400));
    }
    
    // Check if OTP expired (10 minutes)
    const isExpired = Date.now() - storedData.timestamp > 10 * 60 * 1000;
    if (isExpired) {
      delete otpStore[aadhaarNumber];
      return next(createError('OTP has expired. Please request a new OTP.', 400));
    }
    
    // Verify OTP
    if (storedData.otp !== otp) {
      return next(createError('Invalid OTP. Please try again.', 400));
    }
    
    // Mark as verified
    storedData.verified = true;
    
    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        verified: true,
        aadhaarVerified: true
      }
    });
  } catch (error) {
    next(error);
  }
};

export const validatePAN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { panNumber } = req.body;
    
    // In real implementation, validate with government API
    // For demo, accept any valid format PAN
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    res.json({
      success: true,
      message: 'PAN validated successfully',
      data: {
        valid: true,
        panNumber,
        status: 'VALID'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const submitRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;
    
    // Check if Aadhaar OTP was verified
    const otpData = otpStore[formData.aadhaarNumber];
    if (!otpData || !otpData.verified) {
      return next(createError('Aadhaar OTP verification required before submission.', 400));
    }
    
    // Validate age (must be 18+)
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    
    if (age < 18) {
      return next(createError('Applicant must be at least 18 years old.', 400));
    }
    
    // Generate registration ID
    const registrationId = 'UDYAM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Store registration (in database in production)
    const registration = {
      id: registrationId,
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
      createdBy: 'SYSTEM'
    };
    
    registrations.push(registration);
    
    // Clean up OTP data
    delete otpStore[formData.aadhaarNumber];
    
    console.log(`New registration submitted: ${registrationId}`);
    
    res.json({
      success: true,
      message: 'Registration submitted successfully',
      data: {
        registrationId,
        submittedAt: registration.submittedAt,
        status: 'PENDING',
        estimatedProcessingTime: '7-10 business days'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const lookupPinCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pincode } = req.params;
    
    // Validate pincode format
    if (!/^[0-9]{6}$/.test(pincode)) {
      return next(createError('Invalid PIN code format', 400));
    }
    
    try {
      // Use free API for PIN code lookup
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`, {
        timeout: 5000
      });
      
      if (response.data && response.data[0] && response.data[0].Status === 'Success') {
        const postOffice = response.data[0].PostOffice[0];
        
        res.json({
          success: true,
          data: {
            city: postOffice.District,
            state: postOffice.State,
            country: postOffice.Country,
            pincode: pincode,
            postOffice: postOffice.Name
          }
        });
      } else {
        return next(createError('Invalid PIN code or no data found', 404));
      }
    } catch (apiError) {
      // Fallback to mock data for demo
      const mockData = getMockPinData(pincode);
      if (mockData) {
        res.json({
          success: true,
          data: mockData
        });
      } else {
        return next(createError('PIN code lookup service temporarily unavailable', 503));
      }
    }
  } catch (error) {
    next(error);
  }
};

// Utility functions
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getMockPinData = (pincode: string) => {
  // Mock data for common PIN codes
  const mockPinData: { [key: string]: any } = {
    '110001': { city: 'New Delhi', state: 'Delhi', country: 'India', pincode, postOffice: 'Connaught Place' },
    '400001': { city: 'Mumbai', state: 'Maharashtra', country: 'India', pincode, postOffice: 'Fort' },
    '560001': { city: 'Bangalore', state: 'Karnataka', country: 'India', pincode, postOffice: 'Bangalore GPO' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu', country: 'India', pincode, postOffice: 'Chennai GPO' },
    '700001': { city: 'Kolkata', state: 'West Bengal', country: 'India', pincode, postOffice: 'Kolkata GPO' },
    '500001': { city: 'Hyderabad', state: 'Telangana', country: 'India', pincode, postOffice: 'Hyderabad GPO' }
  };
  
  return mockPinData[pincode] || null;
};

// Get all registrations (admin endpoint)
export const getAllRegistrations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: registrations,
      total: registrations.length
    });
  } catch (error) {
    next(error);
  }
};
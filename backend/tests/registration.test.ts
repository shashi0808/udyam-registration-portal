import request from 'supertest';
import app from '../src/index';

describe('Registration API Tests', () => {
  const validAadhaar = '123456789012';
  const validOTP = '123456';
  const validPAN = 'ABCDE1234F';
  
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
        
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('API Info', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api/v1')
        .expect(200);
        
      expect(response.body).toHaveProperty('message', 'Udyam Registration API v1');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('Send OTP', () => {
    it('should send OTP for valid Aadhaar', async () => {
      const response = await request(app)
        .post('/api/v1/send-otp')
        .send({ aadhaarNumber: validAadhaar })
        .expect(200);
        
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP sent successfully');
      expect(response.body.data).toHaveProperty('otpSent', true);
    });

    it('should reject invalid Aadhaar format', async () => {
      const response = await request(app)
        .post('/api/v1/send-otp')
        .send({ aadhaarNumber: '12345' })
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });

    it('should require Aadhaar number', async () => {
      const response = await request(app)
        .post('/api/v1/send-otp')
        .send({})
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });
  });

  describe('Verify OTP', () => {
    beforeEach(async () => {
      // Send OTP first
      await request(app)
        .post('/api/v1/send-otp')
        .send({ aadhaarNumber: validAadhaar });
    });

    it('should verify valid OTP', async () => {
      const response = await request(app)
        .post('/api/v1/verify-otp')
        .send({ 
          aadhaarNumber: validAadhaar,
          otp: validOTP
        })
        .expect(200);
        
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('verified successfully');
    });

    it('should reject invalid OTP', async () => {
      const response = await request(app)
        .post('/api/v1/verify-otp')
        .send({ 
          aadhaarNumber: validAadhaar,
          otp: '999999'
        })
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });

    it('should reject OTP verification without sending OTP first', async () => {
      const response = await request(app)
        .post('/api/v1/verify-otp')
        .send({ 
          aadhaarNumber: '999999999999',
          otp: validOTP
        })
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });
  });

  describe('Validate PAN', () => {
    it('should validate correct PAN format', async () => {
      const response = await request(app)
        .post('/api/v1/validate-pan')
        .send({ panNumber: validPAN })
        .expect(200);
        
      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
    });

    it('should reject invalid PAN format', async () => {
      const response = await request(app)
        .post('/api/v1/validate-pan')
        .send({ panNumber: 'INVALID123' })
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });
  });

  describe('PIN Code Lookup', () => {
    it('should lookup valid PIN code', async () => {
      const response = await request(app)
        .get('/api/v1/pin-lookup/110001')
        .expect(200);
        
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('city');
      expect(response.body.data).toHaveProperty('state');
    });

    it('should handle invalid PIN code format', async () => {
      const response = await request(app)
        .get('/api/v1/pin-lookup/123')
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });
  });

  describe('Submit Registration', () => {
    const validRegistrationData = {
      aadhaarNumber: validAadhaar,
      otpNumber: validOTP,
      panNumber: validPAN,
      applicantName: 'John Doe',
      gender: 'male',
      dateOfBirth: '1990-01-01',
      mobileNumber: '9876543210',
      emailAddress: 'john.doe@example.com',
      address: '123 Main Street, Test City',
      pinCode: '110001',
      city: 'New Delhi',
      state: 'Delhi'
    };

    beforeEach(async () => {
      // Send and verify OTP first
      await request(app)
        .post('/api/v1/send-otp')
        .send({ aadhaarNumber: validAadhaar });
        
      await request(app)
        .post('/api/v1/verify-otp')
        .send({ 
          aadhaarNumber: validAadhaar,
          otp: validOTP
        });
    });

    it('should submit valid registration', async () => {
      const response = await request(app)
        .post('/api/v1/submit-registration')
        .send(validRegistrationData)
        .expect(200);
        
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('registrationId');
      expect(response.body.data.registrationId).toMatch(/^UDYAM-/);
    });

    it('should reject registration with invalid email', async () => {
      const invalidData = {
        ...validRegistrationData,
        emailAddress: 'invalid-email'
      };
      
      const response = await request(app)
        .post('/api/v1/submit-registration')
        .send(invalidData)
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });

    it('should reject registration without OTP verification', async () => {
      const response = await request(app)
        .post('/api/v1/submit-registration')
        .send({
          ...validRegistrationData,
          aadhaarNumber: '999999999999'
        })
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });

    it('should reject underage applicant', async () => {
      const underage = {
        ...validRegistrationData,
        dateOfBirth: new Date().toISOString().split('T')[0] // Today's date
      };
      
      const response = await request(app)
        .post('/api/v1/submit-registration')
        .send(underage)
        .expect(400);
        
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('18 years old');
    });
  });

  describe('Rate Limiting', () => {
    it('should handle rate limiting', async () => {
      // Make multiple requests quickly
      const promises = Array(15).fill(0).map(() =>
        request(app).get('/health')
      );
      
      const responses = await Promise.all(promises);
      const statusCodes = responses.map(r => r.status);
      
      // All should be successful since rate limit is quite high for health check
      expect(statusCodes.every(code => code === 200)).toBe(true);
    });
  });
});
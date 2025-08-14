const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testAPI() {
  console.log('🧪 Testing Udyam Registration API...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check passed:', health.data.status);
    console.log();

    // Test 2: API info
    console.log('2️⃣ Testing API info...');
    const apiInfo = await axios.get(BASE_URL);
    console.log('✅ API info:', apiInfo.data.message);
    console.log();

    // Test 3: Send OTP
    console.log('3️⃣ Testing send OTP...');
    const sendOTPResponse = await axios.post(`${BASE_URL}/send-otp`, {
      aadhaarNumber: '123456789012'
    });
    console.log('✅ Send OTP:', sendOTPResponse.data.message);
    console.log();

    // Test 4: Verify OTP
    console.log('4️⃣ Testing verify OTP...');
    const verifyOTPResponse = await axios.post(`${BASE_URL}/verify-otp`, {
      aadhaarNumber: '123456789012',
      otp: '123456'
    });
    console.log('✅ Verify OTP:', verifyOTPResponse.data.message);
    console.log();

    // Test 5: Validate PAN
    console.log('5️⃣ Testing validate PAN...');
    const validatePANResponse = await axios.post(`${BASE_URL}/validate-pan`, {
      panNumber: 'ABCDE1234F'
    });
    console.log('✅ Validate PAN:', validatePANResponse.data.message);
    console.log();

    // Test 6: PIN code lookup
    console.log('6️⃣ Testing PIN code lookup...');
    const pinLookupResponse = await axios.get(`${BASE_URL}/pin-lookup/110001`);
    console.log('✅ PIN lookup:', pinLookupResponse.data.data);
    console.log();

    // Test 7: Submit registration
    console.log('7️⃣ Testing submit registration...');
    const submitResponse = await axios.post(`${BASE_URL}/submit-registration`, {
      aadhaarNumber: '123456789012',
      otpNumber: '123456',
      panNumber: 'ABCDE1234F',
      applicantName: 'John Doe',
      gender: 'male',
      dateOfBirth: '1990-01-01',
      mobileNumber: '9876543210',
      emailAddress: 'john.doe@example.com',
      address: '123 Main Street, City',
      pinCode: '110001',
      city: 'New Delhi',
      state: 'Delhi'
    });
    console.log('✅ Submit registration:', submitResponse.data.message);
    console.log('📋 Registration ID:', submitResponse.data.data.registrationId);
    console.log();

    console.log('🎉 All API tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testAPI();
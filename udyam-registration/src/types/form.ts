export interface FormField {
  id: string;
  name?: string;
  type: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  maxlength?: number;
  pattern?: string;
  validation_message?: string;
  disabled?: boolean;
  readonly?: boolean;
  transform?: string;
  text?: string;
  action?: string;
  className?: string;
  rows?: number;
  autocomplete?: string;
  options?: { value: string; text: string }[];
}

export interface FormStep {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface ValidationRule {
  pattern: string;
  message: string;
}

export interface ProgressStep {
  step: number;
  title: string;
  status: 'completed' | 'active' | 'pending';
}

export interface UIConfig {
  progress_steps: ProgressStep[];
  theme: {
    primary_color: string;
    secondary_color: string;
    success_color: string;
    error_color: string;
    warning_color: string;
    info_color: string;
  };
  responsive_breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export interface FormStructure {
  step1: FormStep;
  step2: FormStep;
  validation_rules: Record<string, ValidationRule>;
  ui_config: UIConfig;
  api_endpoints: Record<string, string>;
}

export interface FormData {
  // Step 1
  aadhaarNumber?: string;
  otpNumber?: string;
  
  // Step 2
  panNumber?: string;
  applicantName?: string;
  gender?: string;
  dateOfBirth?: string;
  mobileNumber?: string;
  emailAddress?: string;
  address?: string;
  pinCode?: string;
  city?: string;
  state?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PinCodeResponse {
  city: string;
  state: string;
  country: string;
  pincode: string;
}
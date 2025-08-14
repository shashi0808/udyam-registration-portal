import requests
from bs4 import BeautifulSoup
import json
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

class UdyamScraper:
    def __init__(self):
        self.base_url = "https://udyamregistration.gov.in/UdyamRegistration.aspx"
        self.form_data = {
            "step1": {},
            "step2": {},
            "validation_rules": {},
            "ui_elements": {}
        }
    
    def setup_driver(self):
        """Setup Chrome driver with options"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in background
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        try:
            driver = webdriver.Chrome(options=chrome_options)
            return driver
        except Exception as e:
            print(f"Error setting up Chrome driver: {e}")
            return None
    
    def scrape_udyam_portal(self):
        """Scrape the Udyam portal for form structure"""
        driver = self.setup_driver()
        if not driver:
            print("Failed to setup web driver")
            return None
        
        try:
            driver.get(self.base_url)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Extract Step 1 elements (Aadhaar + OTP validation)
            self.extract_step1_elements(driver)
            
            # Extract Step 2 elements (PAN validation)
            self.extract_step2_elements(driver)
            
            # Extract validation rules from JavaScript
            self.extract_validation_rules(driver)
            
            return self.form_data
            
        except Exception as e:
            print(f"Error scraping portal: {e}")
            return None
        finally:
            driver.quit()
    
    def extract_step1_elements(self, driver):
        """Extract Step 1 form elements (Aadhaar + OTP)"""
        step1_elements = []
        
        # Common selectors for Step 1
        selectors = [
            "input[type='text']",
            "input[type='number']",
            "input[type='tel']",
            "select",
            "textarea",
            "button",
            ".form-control",
            ".input-group"
        ]
        
        for selector in selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                for element in elements:
                    element_data = self.extract_element_data(element)
                    if element_data:
                        step1_elements.append(element_data)
            except Exception as e:
                print(f"Error extracting elements with selector {selector}: {e}")
        
        self.form_data["step1"]["elements"] = step1_elements
    
    def extract_step2_elements(self, driver):
        """Extract Step 2 form elements (PAN validation)"""
        # Try to navigate to step 2 or find step 2 elements
        step2_elements = []
        
        # Look for PAN-related elements
        pan_selectors = [
            "input[placeholder*='PAN']",
            "input[id*='pan']",
            "input[name*='pan']",
            ".pan-input",
            "#panCard"
        ]
        
        for selector in pan_selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                for element in elements:
                    element_data = self.extract_element_data(element)
                    if element_data:
                        step2_elements.append(element_data)
            except Exception as e:
                print(f"Error extracting PAN elements: {e}")
        
        self.form_data["step2"]["elements"] = step2_elements
    
    def extract_element_data(self, element):
        """Extract detailed data from a web element"""
        try:
            data = {
                "tag": element.tag_name,
                "type": element.get_attribute("type"),
                "id": element.get_attribute("id"),
                "name": element.get_attribute("name"),
                "class": element.get_attribute("class"),
                "placeholder": element.get_attribute("placeholder"),
                "value": element.get_attribute("value"),
                "required": element.get_attribute("required"),
                "maxlength": element.get_attribute("maxlength"),
                "pattern": element.get_attribute("pattern"),
                "text": element.text.strip() if element.text else None
            }
            
            # Filter out empty values
            return {k: v for k, v in data.items() if v is not None and v != ""}
            
        except Exception as e:
            print(f"Error extracting element data: {e}")
            return None
    
    def extract_validation_rules(self, driver):
        """Extract JavaScript validation rules"""
        try:
            # Get all script tags
            scripts = driver.find_elements(By.TAG_NAME, "script")
            validation_patterns = {}
            
            for script in scripts:
                script_content = script.get_attribute("innerHTML")
                if script_content:
                    # Look for common validation patterns
                    pan_pattern = re.search(r'["\']([A-Za-z]{5}[0-9]{4}[A-Za-z]{1})["\']', script_content)
                    aadhaar_pattern = re.search(r'["\'](\d{4}\s?\d{4}\s?\d{4})["\']', script_content)
                    
                    if pan_pattern:
                        validation_patterns["pan"] = pan_pattern.group(1)
                    if aadhaar_pattern:
                        validation_patterns["aadhaar"] = aadhaar_pattern.group(1)
            
            # Add standard patterns if not found
            if "pan" not in validation_patterns:
                validation_patterns["pan"] = "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}"
            if "aadhaar" not in validation_patterns:
                validation_patterns["aadhaar"] = "^\d{4}\s?\d{4}\s?\d{4}$"
            
            self.form_data["validation_rules"] = validation_patterns
            
        except Exception as e:
            print(f"Error extracting validation rules: {e}")
    
    def save_scraped_data(self, filename="udyam_form_structure.json"):
        """Save scraped data to JSON file"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.form_data, f, indent=2, ensure_ascii=False)
            print(f"Scraped data saved to {filename}")
        except Exception as e:
            print(f"Error saving data: {e}")

def main():
    scraper = UdyamScraper()
    
    # First, create a mock structure based on typical Udyam form
    mock_data = {
        "step1": {
            "title": "Aadhaar Validation & OTP Verification",
            "elements": [
                {
                    "tag": "input",
                    "type": "text",
                    "id": "aadhaarNumber",
                    "name": "aadhaarNumber",
                    "placeholder": "Enter 12-digit Aadhaar Number",
                    "required": True,
                    "maxlength": "12",
                    "pattern": "^\d{12}$"
                },
                {
                    "tag": "button",
                    "type": "button",
                    "id": "sendOTP",
                    "text": "Send OTP",
                    "class": "btn btn-primary"
                },
                {
                    "tag": "input",
                    "type": "text",
                    "id": "otpNumber",
                    "name": "otpNumber",
                    "placeholder": "Enter 6-digit OTP",
                    "maxlength": "6",
                    "pattern": "^\d{6}$"
                },
                {
                    "tag": "button",
                    "type": "submit",
                    "id": "verifyOTP",
                    "text": "Verify OTP",
                    "class": "btn btn-success"
                }
            ]
        },
        "step2": {
            "title": "PAN Validation",
            "elements": [
                {
                    "tag": "input",
                    "type": "text",
                    "id": "panNumber",
                    "name": "panNumber",
                    "placeholder": "Enter PAN Number (e.g., ABCDE1234F)",
                    "required": True,
                    "maxlength": "10",
                    "pattern": "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}"
                },
                {
                    "tag": "input",
                    "type": "text",
                    "id": "applicantName",
                    "name": "applicantName",
                    "placeholder": "Name as per PAN Card",
                    "required": True
                },
                {
                    "tag": "select",
                    "id": "gender",
                    "name": "gender",
                    "required": True,
                    "options": ["Male", "Female", "Other"]
                },
                {
                    "tag": "input",
                    "type": "date",
                    "id": "dateOfBirth",
                    "name": "dateOfBirth",
                    "required": True
                }
            ]
        },
        "validation_rules": {
            "pan": "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}",
            "aadhaar": "^\d{12}$",
            "otp": "^\d{6}$"
        },
        "ui_elements": {
            "progress_steps": ["Aadhaar Validation", "PAN Validation"],
            "theme": {
                "primary_color": "#0066cc",
                "secondary_color": "#f8f9fa",
                "success_color": "#28a745",
                "error_color": "#dc3545"
            }
        }
    }
    
    # Save mock data first
    scraper.form_data = mock_data
    scraper.save_scraped_data("C:/Users/91766/Downloads/Openbiz/udyam_form_structure.json")
    
    # Try to scrape actual data
    print("Attempting to scrape actual Udyam portal...")
    actual_data = scraper.scrape_udyam_portal()
    
    if actual_data:
        scraper.save_scraped_data("C:/Users/91766/Downloads/Openbiz/udyam_actual_structure.json")
        print("Successfully scraped actual portal data")
    else:
        print("Using mock data structure for development")

if __name__ == "__main__":
    main()
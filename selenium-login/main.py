import os
import logging
from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configure logging
logging.basicConfig(level=logging.ERROR, filename="selenium_errors.log", filemode="a",
                    format="%(asctime)s - %(levelname)s - %(message)s")

# Login function
def login_shopee(driver, username, password):
    try:
        wait = WebDriverWait(driver, 10)

        username_field = wait.until(EC.presence_of_element_located((By.NAME, "loginKey")))
        username_field.clear()
        username_field.send_keys(username)
        print("Entered username.")

        password_field = wait.until(EC.presence_of_element_located((By.NAME, "password")))
        password_field.clear()
        password_field.send_keys(password)
        print("Entered password.")

        login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".b5aVaf")))
        ActionChains(driver).move_to_element(login_button).click().perform()
        print("Clicked login button.")

        wait.until(EC.url_contains("user"))

        if "user" in driver.current_url:
            print("Login successful.")
        else:
            try:
                error_message = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".HyEuQL")))
                print("Login failed: "+error_message)
            except:
                print("Unknown error occurred during login.")
    except Exception as e:
        logging.error("Error during login:", exc_info=True)
        print("Error during login:", e)

# Main execution
if __name__ == "__main__":
    # Ask for username and password interactively
    username = input("Enter your Shopee username: ")
    password = input("Enter your Shopee password: ")
    url = "https://shopee.co.id/buyer/login"

    # Setup WebDriver
    driver_path = os.path.abspath("edgedriver_win64/msedgedriver.exe")

    user_data_dir = r"C:\Users\Hp\AppData\Local\Microsoft\Edge\User Data"
    profile_directory = "Default"
    options = webdriver.EdgeOptions()
    options.add_argument(f"--user-data-dir={user_data_dir}")
    options.add_argument(f"--profile-directory={profile_directory}")
    options.add_argument("--disable-blink-features=AutomationControlled")  # Helps avoid detection
    options.add_argument("--no-sandbox")  # Disable sandboxing
    options.add_argument("--disable-gpu")  # Disable GPU hardware acceleration
    options.add_argument("--remote-debugging-port=9222")  # Set remote debugging port

    service = Service(executable_path=driver_path)
    driver = webdriver.Edge(service=service, options=options)

    # Open the login page
    driver.get(url)

    # Perform login
    login_shopee(driver, username, password)

    # Wait for user action to close the browser
    input("Press Enter to close the browser...")
    driver.quit()

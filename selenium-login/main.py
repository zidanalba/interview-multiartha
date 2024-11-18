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
        print("Logged in successfully")
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
    service = Service(executable_path=driver_path)
    driver = webdriver.Edge(service=service)

    # Open the login page
    driver.get(url)

    # Perform login
    login_shopee(driver, username, password)

    # Wait for user action to close the browser
    input("Press Enter to close the browser...")
    driver.quit()

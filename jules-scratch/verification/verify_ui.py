import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Get the absolute path to the index.html file
        # The script is in jules-scratch/verification, so we go up two directories
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, '..', '..', 'index.html')

        # Use a file:// URL to open the local file
        page.goto(f'file://{file_path}')

        # Give the page a moment to render the fonts and styles
        page.wait_for_timeout(1000)

        # Take a screenshot of the full page
        screenshot_path = os.path.join(current_dir, 'ui_preview.png')
        page.screenshot(path=screenshot_path, full_page=True)

        browser.close()
        print(f"Screenshot saved to {screenshot_path}")

if __name__ == "__main__":
    run()

from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local server
        page.goto("http://localhost:8080")

        # Wait for the title to be correct
        if "NoteFlow - Notes & Tasks" not in page.title():
            print(f"Wrong title: {page.title()}")
            return

        # Check for key elements
        # "New" button
        page.wait_for_selector("#btn-add-new")

        # Take a screenshot of the main dashboard
        page.screenshot(path="verification/dashboard.png")
        print("Dashboard screenshot taken.")

        # Click on "New" to open modal
        page.click("#btn-add-new")
        page.wait_for_selector("#modal-content")

        # Take a screenshot of the modal
        page.screenshot(path="verification/modal.png")
        print("Modal screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_frontend()

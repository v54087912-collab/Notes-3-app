from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate a mobile device
        iphone_12 = p.devices['iPhone 12']
        context = browser.new_context(**iphone_12)
        page = context.new_page()

        # Navigate to the app
        page.goto("http://localhost:8080/index.html")

        # Wait for spinner to disappear
        page.wait_for_selector("#loading-spinner.hidden")

        # Wait for content to load
        page.wait_for_selector(".song-item")

        # Take screenshot of Home
        page.screenshot(path="verification/home.png")
        print("Captured Home")

        # Click on a song to start playing (this updates the player state)
        page.click(".song-item >> nth=0")

        # Wait a bit for state update
        page.wait_for_timeout(1000)

        # Now click the mini player to open the full player
        page.click("#mini-player")

        # Wait for full player animation/class
        page.wait_for_selector("#full-player.active")

        # Take screenshot of Player
        page.screenshot(path="verification/player.png")
        print("Captured Player")

        # Close player
        page.click(".player-header .fa-chevron-down")
        page.wait_for_selector("#full-player:not(.active)")

        # Navigate to Profile
        page.click(".nav-item >> text=Profile")
        page.wait_for_selector("#profile")

        # Take screenshot of Profile
        page.screenshot(path="verification/profile.png")
        print("Captured Profile")

        browser.close()

if __name__ == "__main__":
    verify_app()

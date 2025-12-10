from playwright.sync_api import sync_playwright

def verify_tabs_state():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:8080")

        # 1. Notes Tab Active?
        # Check if tab button has class 'active'
        if "active" in page.get_attribute("#tab-notes", "class"):
            print("Notes tab is active")
        else:
            print("Error: Notes tab NOT active")

        # Check Empty State visible
        if page.is_visible("#empty-state"):
             print("Empty state visible (Correct for empty notes)")

        # 2. Click Tasks
        page.click("#tab-tasks")
        if "active" in page.get_attribute("#tab-tasks", "class"):
            print("Tasks tab is active")
        else:
             print("Error: Tasks tab NOT active")

        # 3. Click Habits
        page.click("#tab-habits")
        if "active" in page.get_attribute("#tab-habits", "class"):
            print("Habits tab is active")
        else:
             print("Error: Habits tab NOT active")

        # 4. Click Calendar
        page.click("#tab-calendar")
        if "active" in page.get_attribute("#tab-calendar", "class"):
            print("Calendar tab is active")
        else:
             print("Error: Calendar tab NOT active")

        # Check Calendar Grid is visible (it has content)
        if page.is_visible("#calendar-grid"):
            print("Calendar grid is visible")

        browser.close()

if __name__ == "__main__":
    verify_tabs_state()

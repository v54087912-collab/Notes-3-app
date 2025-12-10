from playwright.sync_api import sync_playwright

def verify_tabs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate
        page.goto("http://localhost:8080")

        # 1. Default: Notes View
        if not page.is_visible("#notes-view"):
            print("Error: Notes view not visible by default")
        else:
            print("Notes view visible")

        # 2. Switch to Tasks
        page.click("#tab-tasks")
        if not page.is_visible("#tasks-view"):
            print("Error: Tasks view not visible after click")
        else:
            print("Tasks view visible")
            page.screenshot(path="verification/view_tasks.png")

        # 3. Switch to Habits
        page.click("#tab-habits")
        if not page.is_visible("#habits-view"):
            print("Error: Habits view not visible after click")
        else:
            print("Habits view visible")
            page.screenshot(path="verification/view_habits.png")

        # 4. Switch to Calendar
        page.click("#tab-calendar")
        if not page.is_visible("#calendar-view"):
            print("Error: Calendar view not visible after click")
        else:
            print("Calendar view visible")
            page.screenshot(path="verification/view_calendar.png")

        browser.close()

if __name__ == "__main__":
    verify_tabs()

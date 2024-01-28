import { test, expect } from "@playwright/test"

test("Login form works correctly", async ({ page }) => {
  // Navigate to the login page
  await page.goto("/login")

  // Fill in the login form
  await page.fill("input[name=email]", "test@example.com")
  await page.fill("input[name=password]", "password")

  // Submit the form
  await page.click("button")

  // Wait for the page to navigate to the profile page
  await page.waitForURL("/profile")

  // Verify that the profile page is loaded
  expect(page.url()).toBe("http://localhost:3000/profile")
})

// You can add more tests as needed

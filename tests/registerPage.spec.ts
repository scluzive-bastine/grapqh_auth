import { test, expect } from "@playwright/test"

test("Register form works correctly", async ({ page }) => {
  // Navigate to the login page
  await page.goto("/register")

  // Fill in the login form
  await page.fill("input[name=username]", "doe")
  await page.fill("input[name=email]", "johndoe@example.com")
  await page.fill("input[name=password]", "password")

  // Submit the form
  await page.click("button")

  // Wait for the page to navigate to the profile page
  await page.waitForURL("/login")

  // Verify that the profile page is loaded
  expect(page.url()).toBe("http://localhost:3000/login")
})

// You can add more tests as needed

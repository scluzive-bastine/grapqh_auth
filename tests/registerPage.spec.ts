import { test, expect } from "@playwright/test"
import { faker } from "@faker-js/faker"

const username = faker.internet.userName()
const email = faker.internet.email()
const password = "password"

test("Register form works correctly", async ({ page }) => {
  // Navigate to the login page
  await page.goto("/register")

  // Fill in the login form
  await page.fill("input[name=username]", username)
  await page.fill("input[name=email]", email)
  await page.fill("input[name=password]", password)

  // Submit the form
  await page.click("button")

  // Wait for the page to navigate to the profile page
  await page.waitForURL("/login")

  // Verify that the profile page is loaded
  expect(page.url()).toBe("http://localhost:3000/login")
})

// You can add more tests as needed

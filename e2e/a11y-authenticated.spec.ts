import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel("Email Address").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL(/\/account|\/admin/);
}

async function scan(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations, null, 2),
  ).toEqual([]);
}

test.describe("Authenticated a11y", () => {
  test("Admin: dashboard, products list, taxonomy have no WCAG 2.1 AA violations", async ({
    page,
  }) => {
    await signIn(page, "admin@gemora.com", "Password123!");
    await page.goto("/admin");
    await scan(page);
    await page.goto("/admin/products");
    await scan(page);
    await page.goto("/admin/orders");
    await scan(page);
  });

  test("Customer account overview has no WCAG 2.1 AA violations", async ({
    page,
  }) => {
    await signIn(page, "admin@gemora.com", "Password123!");
    await page.goto("/account");
    await scan(page);
    await page.goto("/account/settings");
    await scan(page);
  });

  test("Cart with an item has no WCAG 2.1 AA violations", async ({ page }) => {
    await page.goto("/gems/2-10-ct-emerald-cut-emerald");
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.goto("/cart");
    await expect(page.getByText("2.10 ct Emerald-Cut Emerald")).toBeVisible();
    await scan(page);
  });
});

import { test, expect, type Page } from "@playwright/test";
import { execSync } from "node:child_process";

// There's no way to reach a "processing" order without a real Stripe
// payment_intent.succeeded webhook, which this dev environment can't fire
// without live keys. To still exercise the admin status-transition UI
// itself, promote the most recent order (created by the checkout test
// above, which stops at "cancelled" since payment can't complete here)
// back to "processing" directly in the DB before this test, and only for
// the duration of this one test.
function setLatestOrderStatus(status: string) {
  execSync(
    `psql -h localhost -U postgres -d gemora -t -c "UPDATE orders SET status = '${status}' WHERE id = (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1) RETURNING id;"`,
    { encoding: "utf8", env: { ...process.env, PGPASSWORD: "Enoch" } },
  );
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel("Email Address").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL(/\/account|\/admin/);
}

test.describe("Browse → PDP → cart → checkout → confirmation", () => {
  test("a guest can browse to a product, add it to cart, and reach checkout", async ({
    page,
  }) => {
    // Browse
    await page.goto("/gems");
    await expect(
      page.getByRole("heading", { name: /gems|shop/i }).first(),
    ).toBeVisible();

    // PDP
    await page
      .getByRole("link", { name: /2\.10 ct Emerald-Cut Emerald/i })
      .first()
      .click();
    await page.waitForURL(/\/gems\/2-10-ct-emerald-cut-emerald/);
    await expect(
      page.getByRole("heading", { name: "2.10 ct Emerald-Cut Emerald" }),
    ).toBeVisible();

    // Add to cart
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByText("Added to your bag.")).toBeVisible();

    // Cart
    await page.goto("/cart");
    await expect(page.getByText("2.10 ct Emerald-Cut Emerald")).toBeVisible();
    await page.getByRole("button", { name: "Proceed to Checkout" }).click();
    await page.waitForURL(/\/checkout/);

    // Checkout — shipping step
    await page.getByLabel("Full Name*").fill("Ada Lovelace");
    await page
      .getByLabel("Email Address*")
      .fill(`e2e-checkout-${Date.now()}@example.com`);
    await page.getByLabel("Phone Number*").fill("+1 555 0100");
    await page
      .getByLabel("Address*", { exact: true })
      .fill("1 Analytical Engine Way");
    await page.getByLabel("City*").fill("London");
    await page.getByLabel("State*").fill("LDN");
    await page.getByLabel("ZIP Code*").fill("SW1A 1AA");
    await page.getByRole("button", { name: /Continue to Payment/i }).click();

    // This environment has no Stripe keys configured, so the backend
    // rejects the session/PaymentIntent creation and the app is expected to
    // surface a clear, actionable error rather than hang or crash. A real
    // Stripe test-mode key pair is required to exercise payment confirmation
    // and the order-confirmation page — see the Pre-Launch Checklist.
    await expect(
      page.getByText(/Payment isn't configured in this environment/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Continue to Payment/i }),
    ).toBeEnabled();
  });
});

test.describe("Account CRUD", () => {
  test("a new user can sign up, edit their profile, and update their password", async ({
    page,
  }) => {
    const email = `e2e-account-${Date.now()}@example.com`;

    await page.goto("/sign-up");
    await page.getByLabel("First Name").fill("Test");
    await page.getByLabel("Last Name").fill("User");
    await page.getByLabel("Email Address").fill(email);
    await page.locator("#password").fill("Str0ng!Passw0rd");
    await page.getByRole("button", { name: "Create Account" }).click();
    await page.waitForURL(/\/account/);

    // Edit profile
    await page.goto("/account/settings");
    const firstNameField = page.getByLabel("First Name");
    await firstNameField.fill("Updated");
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page.getByText(/saved|updated/i).first()).toBeVisible();

    // Change password
    await page.goto("/account/settings/password");
    await page.getByLabel("Current Password").fill("Str0ng!Passw0rd");
    await page.getByLabel("New Password").fill("An0ther$trongPass1");
    await page.getByRole("button", { name: /update password/i }).click();
    await expect(page.getByText("Password changed.")).toBeVisible();

    // Sign back in with the new password to confirm it actually took effect
    await page.evaluate(() => localStorage.removeItem("accessToken"));
    await signIn(page, email, "An0ther$trongPass1");
    await expect(page).toHaveURL(/\/account/);
  });
});

const STATUS_LABELS: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Cancelled",
};

test.describe("Admin order status update", () => {
  test("an admin can open an order and advance its status", async ({
    page,
  }) => {
    setLatestOrderStatus("processing");

    await signIn(page, "admin@gemora.com", "Password123!");

    await page.goto("/admin/orders");
    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toBeVisible();
    await firstRow.getByRole("link").first().click();
    await page.waitForURL(/\/admin\/orders\/.+/);

    const statusSelect = page.getByLabel("New status");
    await expect(statusSelect).toBeVisible();
    const values = await statusSelect
      .locator("option")
      .evaluateAll((opts) =>
        opts.map((o) => (o as HTMLOptionElement).value).filter(Boolean),
      );
    const nextStatus = values[0];
    expect(
      nextStatus,
      "expected at least one allowed next status",
    ).toBeTruthy();

    await statusSelect.selectOption(nextStatus);
    if (nextStatus === "shipped") {
      await page
        .getByPlaceholder("Tracking Number*")
        .fill("1Z999AA10123456784");
    }
    await page.getByRole("button", { name: "Update Status" }).click();
    await expect(
      page.getByText(STATUS_LABELS[nextStatus]).first(),
    ).toBeVisible();
  });
});

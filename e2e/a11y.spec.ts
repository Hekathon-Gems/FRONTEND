import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PUBLIC_PAGES = [
  ["/", "Home"],
  ["/gems", "Gems listing"],
  ["/gems/2-10-ct-emerald-cut-emerald", "Product detail"],
  ["/blog", "Blog listing"],
  ["/blog/how-to-choose-the-right-gemstone", "Blog post"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/cart", "Cart (empty)"],
  ["/sign-in", "Sign in"],
  ["/sign-up", "Sign up"],
  ["/forgot-password", "Forgot password"],
] as const;

for (const [path, label] of PUBLIC_PAGES) {
  test(`a11y: ${label} (${path}) has no WCAG 2.1 AA violations`, async ({
    page,
  }) => {
    await page.goto(path);
    // Let entrance/scroll-reveal animations settle before scanning — axe
    // evaluates the DOM at the instant it runs, and a card mid-fade-in
    // (opacity: 0) reads as a false-positive contrast violation.
    await page.waitForTimeout(1500);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
  });
}

import { test, expect } from "@playwright/test";

// Breakpoints from 03-design-tokens.md §11: sm 375, md 768, lg 1024, xl 1280 / 2xl 1440+.
const BREAKPOINTS = [
  { width: 375, height: 812, label: "sm-375" },
  { width: 768, height: 1024, label: "md-768" },
  { width: 1024, height: 800, label: "lg-1024" },
  { width: 1440, height: 900, label: "xl-1440" },
];

const PAGES = [
  ["/", "Home"],
  ["/gems", "Gems listing"],
  ["/gems/2-10-ct-emerald-cut-emerald", "Product detail"],
  ["/blog", "Blog listing"],
  ["/blog/how-to-choose-the-right-gemstone", "Blog post"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/cart", "Cart"],
  ["/sign-in", "Sign in"],
] as const;

for (const bp of BREAKPOINTS) {
  test.describe(`Responsive @ ${bp.label}`, () => {
    test.use({ viewport: { width: bp.width, height: bp.height } });

    for (const [path, label] of PAGES) {
      test(`${label} (${path}) has no horizontal overflow`, async ({
        page,
      }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");

        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        expect(
          scrollWidth,
          `Page is ${scrollWidth}px wide but viewport is ${clientWidth}px — something overflows horizontally.`,
        ).toBeLessThanOrEqual(clientWidth);
      });
    }
  });
}

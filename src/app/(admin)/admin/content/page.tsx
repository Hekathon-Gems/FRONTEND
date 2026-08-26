"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getAdminContentBlocks, updateContentBlock } from "@/lib/admin-client";
import type {
  AboutCommitmentBlock,
  AboutHeroBlock,
  AboutStatsBlock,
  AboutStoryBlock,
  AboutValuesBlock,
} from "@/lib/types";

const FIELD_CLASSES =
  "h-11 w-full rounded-sm border border-border bg-bg-white px-3 text-sm text-text-primary-dark focus:border-accent-gold focus:outline-none";
const LABEL_CLASSES = "text-xs font-medium text-text-muted";
const TEXTAREA_CLASSES =
  "w-full rounded-sm border border-border bg-bg-white px-3 py-2 text-sm focus:border-accent-gold focus:outline-none";

function SaveButton({
  onClick,
  saved,
}: {
  onClick: () => void;
  saved: boolean;
}) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <Button type="button" variant="primary" onClick={onClick}>
        Save Block
      </Button>
      {saved && <span className="text-sm text-success">Saved.</span>}
    </div>
  );
}

export default function AdminContentPage() {
  const [hero, setHero] = useState<AboutHeroBlock>({
    heading: "",
    body: "",
    ctaLabel: "",
    ctaHref: "",
  });
  const [story, setStory] = useState<AboutStoryBlock>({
    eyebrow: "",
    heading: "",
    body: "",
    ctaLabel: "",
    ctaHref: "",
    statBadge: "",
  });
  const [values, setValues] = useState<AboutValuesBlock>({
    eyebrow: "",
    heading: "",
    items: [],
  });
  const [stats, setStats] = useState<AboutStatsBlock>({ items: [] });
  const [commitment, setCommitment] = useState<AboutCommitmentBlock>({
    eyebrow: "",
    heading: "",
    body: "",
    checklist: [],
    ctaLabel: "",
    ctaHref: "",
  });
  const [savedBlock, setSavedBlock] = useState<string | null>(null);

  useEffect(() => {
    getAdminContentBlocks("about").then((blocks) => {
      if (blocks.hero) setHero(blocks.hero as AboutHeroBlock);
      if (blocks.our_story) setStory(blocks.our_story as AboutStoryBlock);
      if (blocks.values) setValues(blocks.values as AboutValuesBlock);
      if (blocks.stats) setStats(blocks.stats as AboutStatsBlock);
      if (blocks.commitment)
        setCommitment(blocks.commitment as AboutCommitmentBlock);
    });
  }, []);

  async function save(blockKey: string, content: object) {
    await updateContentBlock(
      "about",
      blockKey,
      content as Record<string, unknown>,
    );
    setSavedBlock(blockKey);
    setTimeout(() => setSavedBlock(null), 2000);
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-text-primary-dark">
        Site Content
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Editable blocks for the About page. Changes revalidate the storefront
        immediately.
      </p>

      <div className="mt-6 space-y-6">
        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">Hero</h2>
          <div className="mt-4 space-y-3">
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Heading</span>
              <input
                value={hero.heading}
                onChange={(e) => setHero({ ...hero, heading: e.target.value })}
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Body</span>
              <textarea
                rows={3}
                value={hero.body}
                onChange={(e) => setHero({ ...hero, body: e.target.value })}
                className={TEXTAREA_CLASSES}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>CTA Label</span>
                <input
                  value={hero.ctaLabel}
                  onChange={(e) =>
                    setHero({ ...hero, ctaLabel: e.target.value })
                  }
                  className={FIELD_CLASSES}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>CTA Href</span>
                <input
                  value={hero.ctaHref}
                  onChange={(e) =>
                    setHero({ ...hero, ctaHref: e.target.value })
                  }
                  className={FIELD_CLASSES}
                />
              </label>
            </div>
          </div>
          <SaveButton
            onClick={() => save("hero", hero)}
            saved={savedBlock === "hero"}
          />
        </section>

        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">
            Our Story
          </h2>
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>Eyebrow</span>
                <input
                  value={story.eyebrow}
                  onChange={(e) =>
                    setStory({ ...story, eyebrow: e.target.value })
                  }
                  className={FIELD_CLASSES}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>Stat Badge</span>
                <input
                  value={story.statBadge}
                  onChange={(e) =>
                    setStory({ ...story, statBadge: e.target.value })
                  }
                  className={FIELD_CLASSES}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Heading</span>
              <input
                value={story.heading}
                onChange={(e) =>
                  setStory({ ...story, heading: e.target.value })
                }
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Body</span>
              <textarea
                rows={3}
                value={story.body}
                onChange={(e) => setStory({ ...story, body: e.target.value })}
                className={TEXTAREA_CLASSES}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>CTA Label</span>
                <input
                  value={story.ctaLabel}
                  onChange={(e) =>
                    setStory({ ...story, ctaLabel: e.target.value })
                  }
                  className={FIELD_CLASSES}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>CTA Href</span>
                <input
                  value={story.ctaHref}
                  onChange={(e) =>
                    setStory({ ...story, ctaHref: e.target.value })
                  }
                  className={FIELD_CLASSES}
                />
              </label>
            </div>
          </div>
          <SaveButton
            onClick={() => save("our_story", story)}
            saved={savedBlock === "our_story"}
          />
        </section>

        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">
            Values
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Eyebrow</span>
              <input
                value={values.eyebrow}
                onChange={(e) =>
                  setValues({ ...values, eyebrow: e.target.value })
                }
                className={FIELD_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Heading</span>
              <input
                value={values.heading}
                onChange={(e) =>
                  setValues({ ...values, heading: e.target.value })
                }
                className={FIELD_CLASSES}
              />
            </label>
          </div>
          <div className="mt-4 space-y-3">
            {values.items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-3 gap-2 rounded-md bg-bg-cream p-3"
              >
                <input
                  value={item.title}
                  onChange={(e) => {
                    const items = [...values.items];
                    items[i] = { ...item, title: e.target.value };
                    setValues({ ...values, items });
                  }}
                  placeholder="Title"
                  className={FIELD_CLASSES}
                />
                <input
                  value={item.description}
                  onChange={(e) => {
                    const items = [...values.items];
                    items[i] = { ...item, description: e.target.value };
                    setValues({ ...values, items });
                  }}
                  placeholder="Description"
                  className={`${FIELD_CLASSES} col-span-2`}
                />
              </div>
            ))}
          </div>
          <SaveButton
            onClick={() => save("values", values)}
            saved={savedBlock === "values"}
          />
        </section>

        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">Stats</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.items.map((item, i) => (
              <div key={i} className="space-y-2">
                <input
                  value={item.value}
                  onChange={(e) => {
                    const items = [...stats.items];
                    items[i] = { ...item, value: e.target.value };
                    setStats({ items });
                  }}
                  placeholder="Value"
                  className={FIELD_CLASSES}
                />
                <input
                  value={item.label}
                  onChange={(e) => {
                    const items = [...stats.items];
                    items[i] = { ...item, label: e.target.value };
                    setStats({ items });
                  }}
                  placeholder="Label"
                  className={FIELD_CLASSES}
                />
              </div>
            ))}
          </div>
          <SaveButton
            onClick={() => save("stats", stats)}
            saved={savedBlock === "stats"}
          />
        </section>

        <section className="rounded-md border border-border bg-bg-white p-6">
          <h2 className="font-heading text-lg text-text-primary-dark">
            Commitment
          </h2>
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>Eyebrow</span>
                <input
                  value={commitment.eyebrow}
                  onChange={(e) =>
                    setCommitment({ ...commitment, eyebrow: e.target.value })
                  }
                  className={FIELD_CLASSES}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>Heading</span>
                <input
                  value={commitment.heading}
                  onChange={(e) =>
                    setCommitment({ ...commitment, heading: e.target.value })
                  }
                  className={FIELD_CLASSES}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>Body</span>
              <textarea
                rows={3}
                value={commitment.body}
                onChange={(e) =>
                  setCommitment({ ...commitment, body: e.target.value })
                }
                className={TEXTAREA_CLASSES}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL_CLASSES}>
                Checklist (one item per line)
              </span>
              <textarea
                rows={4}
                value={commitment.checklist.join("\n")}
                onChange={(e) =>
                  setCommitment({
                    ...commitment,
                    checklist: e.target.value.split("\n"),
                  })
                }
                className={TEXTAREA_CLASSES}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>CTA Label</span>
                <input
                  value={commitment.ctaLabel}
                  onChange={(e) =>
                    setCommitment({ ...commitment, ctaLabel: e.target.value })
                  }
                  className={FIELD_CLASSES}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={LABEL_CLASSES}>CTA Href</span>
                <input
                  value={commitment.ctaHref}
                  onChange={(e) =>
                    setCommitment({ ...commitment, ctaHref: e.target.value })
                  }
                  className={FIELD_CLASSES}
                />
              </label>
            </div>
          </div>
          <SaveButton
            onClick={() => save("commitment", commitment)}
            saved={savedBlock === "commitment"}
          />
        </section>
      </div>
    </div>
  );
}

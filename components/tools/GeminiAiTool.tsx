"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, SecondaryButton, Select, Textarea } from "@/components/ui";

const CLIENT_LIMIT = 5;

type ToolConfig = {
  title: string;
  toolType: string;
  placeholder: string;
  minLength: number;
  options?: string[];
  optionLabel?: string;
  bio?: boolean;
  examplePrompts?: string[];
  emptyState?: string;
};

const configs: Record<string, ToolConfig> = {
  "ai-text-summarizer": {
    title: "AI Text Summarizer",
    toolType: "AI Text Summarizer",
    placeholder: "Paste the text you want summarized...",
    minLength: 80,
    optionLabel: "Summary style",
    options: ["Short", "Bullet points", "Detailed"],
    examplePrompts: [
      "Summarize this product changelog for non-technical stakeholders in ~120 words.",
      "Turn this research abstract into bullet points I can drop into a slide deck."
    ]
  },
  "paraphrasing-tool": {
    title: "Paraphrasing Tool",
    toolType: "Paraphrasing Tool",
    placeholder: "Paste the text you want rewritten...",
    minLength: 30,
    optionLabel: "Rewrite style",
    options: ["Simple", "Formal", "Shorter", "More professional"],
    examplePrompts: [
      "Rewrite this paragraph for a grant application without changing the budget numbers.",
      "Make this customer email warmer but still under 90 words."
    ]
  },
  "keyword-extractor": {
    title: "Keyword Extractor",
    toolType: "Keyword Extractor",
    placeholder: "Paste text to extract main keywords, secondary keywords, and a short topic summary...",
    minLength: 50,
    examplePrompts: [
      "Extract SEO keyword clusters from this pasted landing page draft.",
      "List recurring themes from this user interview transcript."
    ]
  },
  "grammar-fixer": {
    title: "Grammar Fixer",
    toolType: "Grammar Fixer",
    placeholder: "Paste text with grammar, spelling, punctuation, or clarity issues...",
    minLength: 20,
    examplePrompts: [
      "Fix grammar only—do not change meaning—in this scholarship paragraph.",
      "Polish this LinkedIn post for tense consistency."
    ]
  },
  "title-generator": {
    title: "Title Generator",
    toolType: "Title Generator",
    placeholder: "Enter a topic, idea, keyword, or short description...",
    minLength: 10,
    optionLabel: "Title type",
    options: ["Blog titles", "YouTube titles", "Assignment titles", "Professional titles"],
    examplePrompts: [
      "Beginner guide to merging PDF files in the browser without installing software.",
      "Case study: how a small team cut image payload by 40% on their marketing site."
    ]
  },
  "bio-generator": {
    title: "Bio Generator",
    toolType: "Bio Generator",
    placeholder: "Skills, interests, achievements, or background details...",
    minLength: 10,
    optionLabel: "Tone",
    options: ["Professional", "Friendly", "Confident", "Simple"],
    bio: true
  },
  "faq-generator": {
    title: "FAQ Generator",
    toolType: "FAQ Generator",
    placeholder: "Enter a topic, product, service, article, or pasted text to turn into FAQs...",
    minLength: 20,
    examplePrompts: [
      "Generate FAQs for a free GPA calculator aimed at undergraduates in the United States.",
      "Turn this return policy into customer-friendly Q&A pairs."
    ]
  },
  "text-to-bullet-points": {
    title: "Text to Bullet Points",
    toolType: "Text to Bullet Points",
    placeholder: "Paste paragraphs to convert into clear bullet points...",
    minLength: 40,
    optionLabel: "Bullet style",
    options: ["Short bullets", "Detailed bullets", "Study notes format"],
    examplePrompts: [
      "Convert this dense paragraph about PDF compression into scannable bullets.",
      "Study notes format for this history excerpt with dates preserved."
    ]
  },
  "ai-study-notes": {
    title: "AI Study Notes Generator",
    toolType: "notes",
    placeholder: "Paste class notes, textbook text, lecture material, or study content...",
    minLength: 50,
    optionLabel: "Notes style",
    options: ["Exam revision", "Lecture notes", "Quick review"],
    examplePrompts: [
      "Exam revision notes for osmosis vs diffusion with common exam traps.",
      "Lecture notes cleanup for SQL joins with example patterns."
    ]
  },
  "explain-simple": {
    title: "Explain Like I'm 5",
    toolType: "explain",
    placeholder: "Paste a difficult paragraph, concept, definition, or topic...",
    minLength: 50,
    optionLabel: "Explanation style",
    options: ["Very simple", "Student friendly", "Short answer"],
    examplePrompts: [
      "Explain net present value without formulas—intuition for a high school reader.",
      "Explain what a canonical URL is for someone publishing their first blog."
    ]
  },
  "ai-email-writer": {
    title: "AI Email Writer",
    toolType: "email",
    placeholder: "Describe who the email is for, what you need to say, and any key details...",
    minLength: 50,
    optionLabel: "Email tone",
    options: ["Professional", "Friendly", "Formal", "Concise"],
    examplePrompts: [
      "Email to a professor requesting a 24-hour extension on a lab report (already 80% done).",
      "Follow-up email to a client after a missed deadline, propose a revised timeline."
    ]
  },
  "chat-reply-generator": {
    title: "AI Chat Reply Generator",
    toolType: "reply",
    placeholder: "Paste the message you need to reply to and any context...",
    minLength: 50,
    optionLabel: "Reply tone",
    options: ["Natural", "Friendly", "Professional", "Polite"],
    examplePrompts: [
      "Slack message asking for specs I already requested twice—reply politely but firm.",
      "Customer angry about shipping delay—offer empathy and next steps."
    ]
  },
  "content-rewriter": {
    title: "AI Content Rewriter",
    toolType: "rewrite",
    placeholder: "Paste the content you want rewritten with the same meaning...",
    minLength: 50,
    optionLabel: "Rewrite mode",
    options: ["Clearer", "More professional", "Shorter", "Smoother"],
    examplePrompts: [
      "Rewrite this README intro for developers migrating from webpack to Vite.",
      "Make this help center article less repetitive without removing warnings."
    ]
  },
  "productivity-assistant": {
    title: "AI Productivity Assistant",
    toolType: "productivity",
    placeholder: "Paste messy notes, a plan, meeting notes, or tasks to organize...",
    minLength: 50,
    optionLabel: "Task style",
    options: ["To-do list", "Priority order", "Action plan"],
    examplePrompts: ["Turn my meeting notes into a prioritized action plan.", "Organize this messy list into tasks for today."]
  },
  "ai-caption-generator": {
    title: "AI Caption Generator",
    toolType: "AI Caption Generator",
    placeholder: "Describe your post, product, photo, offer, or announcement...",
    minLength: 15,
    optionLabel: "Caption tone",
    options: ["Professional", "Friendly", "Playful", "Short and punchy"],
    examplePrompts: ["Launch post for a free PDF tool that works in the browser.", "Caption for a student productivity app feature."]
  },
  "ai-youtube-title-generator": {
    title: "AI YouTube Title Generator",
    toolType: "AI YouTube Title Generator",
    placeholder: "Paste your video topic, hook, script summary, or audience...",
    minLength: 15,
    optionLabel: "Title style",
    options: ["Clickable but honest", "Tutorial", "Shorts", "Professional"],
    examplePrompts: ["Video about compressing images before uploading to websites.", "Beginner tutorial for calculating GPA."]
  },
  "ai-hashtag-generator": {
    title: "AI Hashtag Generator",
    toolType: "AI Hashtag Generator",
    placeholder: "Enter a topic, caption, niche, product, or campaign idea...",
    minLength: 10,
    optionLabel: "Hashtag style",
    options: ["Balanced", "Niche", "Broad reach", "Professional"],
    examplePrompts: ["Free browser-based PDF tools for students and office workers.", "AI writing tools for creators."]
  },
  "resume-ats-checker": {
    title: "Resume ATS Checker",
    toolType: "Resume ATS Checker",
    placeholder: "Paste your resume text and the job description. Label them as RESUME and JOB DESCRIPTION for best results...",
    minLength: 120,
    optionLabel: "Review focus",
    options: ["ATS fit", "Keyword gaps", "Formatting advice", "Concise action plan"],
    examplePrompts: ["RESUME: ... JOB DESCRIPTION: ...", "Check this resume against a junior marketing role and list missing keywords."]
  },
  "ai-humanizer": {
    title: "AI Humanizer",
    toolType: "AI Humanizer",
    placeholder: "Paste text that sounds stiff, robotic, or overly formal...",
    minLength: 40,
    optionLabel: "Rewrite style",
    options: ["Natural", "Professional", "Simple", "Warm"],
    examplePrompts: [
      "Humanize this cover letter paragraph without adding new achievements.",
      "Soften this support macro so it still sets boundaries."
    ]
  },
  "ai-homework-helper": {
    title: "AI Homework Helper",
    toolType: "AI Homework Helper",
    placeholder: "Paste the homework question and what you have tried so far...",
    minLength: 30,
    optionLabel: "Help style",
    options: ["Explain steps", "Give hints", "Check my answer", "Study notes"],
    examplePrompts: [
      "Calculus: I tried substitution but got stuck isolating u on this integral (paste problem).",
      "Biology: explain why this pedigree answer is wrong without giving me the final MC letter."
    ]
  },
  "ai-essay-writer": {
    title: "AI Essay Writer",
    toolType: "AI Essay Writer",
    placeholder: "Enter essay topic, requirements, thesis idea, word count, and sources if any...",
    minLength: 40,
    optionLabel: "Output type",
    options: ["Outline", "Thesis ideas", "Draft introduction", "Revision plan"],
    examplePrompts: [
      "Argumentative essay 1500 words: should public libraries fund gaming programs? Need outline + thesis options.",
      "Revision plan after instructor said my literature review lacks synthesis."
    ]
  },
  "ai-prompt-generator": {
    title: "AI Prompt Generator",
    toolType: "AI Prompt Generator",
    placeholder: "Describe what you want an AI assistant to help you do...",
    minLength: 20,
    optionLabel: "Prompt type",
    options: ["Writing", "Coding", "Research", "Image generation", "Productivity"],
    examplePrompts: [
      "Coding: generate prompts to ask an AI to write Playwright tests for a Next.js checkout flow.",
      "Research: prompts to compare two PDF policy drafts for clause-level differences."
    ]
  },
  "ai-interview-answer-generator": {
    title: "AI Interview Answer Generator",
    toolType: "AI Interview Answer Generator",
    placeholder: "Paste the interview question, role, and your real experience...",
    minLength: 50,
    optionLabel: "Answer style",
    options: ["STAR format", "Concise", "Entry-level", "Leadership"],
    examplePrompts: [
      "Behavioral: Tell me about a time you missed a deadline. Role: junior PM. Include real metrics I will verify.",
      "Technical leadership: how do you prioritize reliability vs feature velocity?"
    ]
  },
  "ai-linkedin-summary-generator": {
    title: "AI LinkedIn Summary Generator",
    toolType: "AI LinkedIn Summary Generator",
    placeholder: "Enter your role, skills, achievements, industry, and career goal...",
    minLength: 40,
    optionLabel: "Tone",
    options: ["Professional", "Friendly", "Founder", "Job seeker"],
    examplePrompts: [
      "Senior backend engineer, 7 yrs, fintech, Kubernetes + Postgres, seeking staff role at product-led company.",
      "Founder bootstrapping a browser-based tools site—summarize mission without hype."
    ]
  },
  "ai-business-name-generator": {
    title: "AI Business Name Generator",
    toolType: "AI Business Name Generator",
    placeholder: "Describe your business idea, audience, niche, and preferred tone...",
    minLength: 20,
    optionLabel: "Name style",
    options: ["Modern", "Simple", "Premium", "Playful"],
    examplePrompts: [
      "Micro-SaaS for freelancers tracking invoice reminders—modern, trustworthy, not cute.",
      "Newsletter for parents of high schoolers applying to STEM programs—warm but credible."
    ]
  },
  "ai-notes-cleaner": {
    title: "AI Notes Cleaner",
    toolType: "AI Notes Cleaner",
    placeholder: "Paste messy notes, meeting notes, lecture notes, or bullet points...",
    minLength: 50,
    optionLabel: "Output style",
    options: ["Clean notes", "Action items", "Study summary", "Meeting recap"],
    examplePrompts: [
      "Meeting recap from chaotic bullet dump—preserve dates and dollar amounts exactly.",
      "Clean lecture notes with headings for definitions vs examples."
    ]
  },
  "transcript-summarizer": {
    title: "Transcript Summarizer",
    toolType: "Transcript Summarizer",
    placeholder: "Paste a YouTube transcript or meeting notes...",
    minLength: 80,
    optionLabel: "Summary style",
    options: ["Bullet summary", "Detailed summary", "Action items"],
    examplePrompts: [
      "Summarize this meeting transcript and list action items with owners if present.",
      "Summarize this YouTube transcript into key takeaways for quick revision."
    ],
    emptyState: "Your Gemini transcript summary will appear here."
  }
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

const USAGE_STORAGE_KEY = "freetoolkit-ai-usage-v2";

type UsageStore = { date: string; bySlug: Record<string, number> };

function readUsage(): UsageStore {
  if (typeof window === "undefined") return { date: todayKey(), bySlug: {} };
  try {
    const raw = window.localStorage.getItem(USAGE_STORAGE_KEY);
    if (!raw) return { date: todayKey(), bySlug: {} };
    const parsed = JSON.parse(raw) as UsageStore;
    if (parsed.date !== todayKey()) return { date: todayKey(), bySlug: {} };
    return { date: parsed.date, bySlug: parsed.bySlug ?? {} };
  } catch {
    return { date: todayKey(), bySlug: {} };
  }
}

function writeUsage(store: UsageStore) {
  window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(store));
}

function draftStorageKey(slug: string) {
  return `freetoolkit-ai-draft:${slug}`;
}

export function GeminiAiTool({ slug }: { slug: string }) {
  const config = configs[slug] ?? configs["ai-text-summarizer"];
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [option, setOption] = useState(config.options?.[0] ?? "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [usesThisSlug, setUsesThisSlug] = useState(0);

  useEffect(() => {
    const store = readUsage();
    setUsesThisSlug(store.bySlug[slug] ?? 0);
    try {
      const raw = window.localStorage.getItem(draftStorageKey(slug));
      if (raw) {
        const parsed = JSON.parse(raw) as { input?: string; name?: string; role?: string; option?: string; output?: string };
        if (typeof parsed.input === "string") setInput(parsed.input);
        if (typeof parsed.name === "string") setName(parsed.name);
        if (typeof parsed.role === "string") setRole(parsed.role);
        if (typeof parsed.option === "string") setOption(parsed.option);
        if (typeof parsed.output === "string") setOutput(parsed.output);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [slug]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    const payload = JSON.stringify({ input, name, role, option, output });
    window.localStorage.setItem(draftStorageKey(slug), payload);
  }, [hydrated, slug, input, name, role, option, output]);

  const remaining = Math.max(0, CLIENT_LIMIT - usesThisSlug);
  const requestInput = useMemo(() => {
    if (!config.bio) return input.trim();
    return {
      name: name.trim(),
      role: role.trim(),
      skillsInterests: input.trim(),
      tone: option
    };
  }, [config.bio, input, name, option, role]);

  const hasEnoughInput = config.bio
    ? name.trim().length >= 2 && role.trim().length >= 2 && input.trim().length >= config.minLength
    : input.trim().length >= config.minLength;

  function saveSuccessfulUseForSlug() {
    const store = readUsage();
    const next = (store.bySlug[slug] ?? 0) + 1;
    const updated: UsageStore = { date: todayKey(), bySlug: { ...store.bySlug, [slug]: next } };
    writeUsage(updated);
    setUsesThisSlug(next);
  }

  async function generate({ keepOutput = false }: { keepOutput?: boolean } = {}) {
    if (!hasEnoughInput || loading || remaining <= 0) return;
    setLoading(true);
    setError("");
    if (!keepOutput) setOutput("");

    try {
      const response = await fetch("/api/ai-tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: config.toolType,
          input: requestInput,
          options: option ? { mode: option } : {}
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "AI is busy, try again later");
      }

      setOutput(data.output || "");
      saveSuccessfulUseForSlug();
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "AI is busy, try again later");
    } finally {
      setLoading(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  }

  function downloadOutput() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug}-output.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function shareOutput() {
    if (!output || !navigator.share) return;
    try {
      await navigator.share({ title: config.title, text: output });
    } catch {
      /* user cancelled */
    }
  }

  function reset() {
    setInput("");
    setName("");
    setRole("");
    setOutput("");
    setError("");
    setOption(config.options?.[0] ?? "");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(draftStorageKey(slug));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4 text-sm leading-6 text-brand-800">
          <p className="font-black">AI workspace</p>
          <p className="mt-1 font-semibold">Paste useful context, choose a mode, and review the output before using it. Your settings stay simple and the generation runs securely.</p>
        </div>

        {config.bio ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Name
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Role
              <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Student, designer, developer..." />
            </label>
          </div>
        ) : null}

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          {config.bio ? "Skills and interests" : "Input text"}
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={config.placeholder} className="min-h-72" />
        </label>

        {config.options?.length ? (
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            {config.optionLabel ?? "Options"}
            <Select value={option} onChange={(event) => setOption(event.target.value)}>
              {config.options.map((item) => <option key={item}>{item}</option>)}
            </Select>
          </label>
        ) : null}

        {config.examplePrompts?.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Example prompts</p>
            <div className="mt-3 grid gap-2">
              {config.examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="button" onClick={() => generate()} disabled={!hasEnoughInput || loading || remaining <= 0}>
            {loading ? "Generating..." : "Generate"}
          </Button>
          <SecondaryButton type="button" onClick={reset}>
            Reset
          </SecondaryButton>
        </div>

        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
          {remaining} free AI generation{remaining === 1 ? "" : "s"} left today for this tool in this browser ({CLIENT_LIMIT} per tool, resets nightly).
        </p>
        {!hasEnoughInput ? (
          <p className="text-sm font-semibold leading-6 text-slate-500">
            Please enter more text
          </p>
        ) : null}
        {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">{error}</p> : null}
      </div>

      <Card className="min-h-80 bg-gradient-to-b from-white to-slate-50/80">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-600">Output</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{config.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <SecondaryButton type="button" onClick={copyOutput} disabled={!output} className="min-h-10 px-4 py-2">
              Copy
            </SecondaryButton>
            <SecondaryButton type="button" onClick={downloadOutput} disabled={!output} className="min-h-10 px-4 py-2">
              Download .txt
            </SecondaryButton>
            {typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
              <SecondaryButton type="button" onClick={shareOutput} disabled={!output} className="min-h-10 px-4 py-2">
                Share
              </SecondaryButton>
            ) : null}
          </div>
        </div>
        {output ? (
          <SecondaryButton type="button" onClick={() => generate({ keepOutput: true })} disabled={loading || remaining <= 0} className="mt-4">
            Regenerate
          </SecondaryButton>
        ) : null}
        <div className="relative mt-5 min-h-72 whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
          {loading ? (
            <div className="space-y-3 animate-pulse" aria-hidden="true">
              <div className="h-3 max-w-[66%] rounded-full bg-slate-200" />
              <div className="h-3 w-full rounded-full bg-slate-100" />
              <div className="h-3 max-w-[83%] rounded-full bg-slate-100" />
              <div className="h-3 w-full rounded-full bg-slate-100" />
              <div className="h-3 w-1/2 rounded-full bg-slate-200" />
              <p className="pt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Generating structured output…</p>
            </div>
          ) : null}
          {!loading ? (
            <span>{output || config.emptyState || "Your AI output will appear here. Add context on the left and click Generate."}</span>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

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
    options: ["Short", "Bullet points", "Detailed"]
  },
  "paraphrasing-tool": {
    title: "Paraphrasing Tool",
    toolType: "Paraphrasing Tool",
    placeholder: "Paste the text you want rewritten...",
    minLength: 30,
    optionLabel: "Rewrite style",
    options: ["Simple", "Formal", "Shorter", "More professional"]
  },
  "keyword-extractor": {
    title: "Keyword Extractor",
    toolType: "Keyword Extractor",
    placeholder: "Paste text to extract main keywords, secondary keywords, and a short topic summary...",
    minLength: 50
  },
  "grammar-fixer": {
    title: "Grammar Fixer",
    toolType: "Grammar Fixer",
    placeholder: "Paste text with grammar, spelling, punctuation, or clarity issues...",
    minLength: 20
  },
  "title-generator": {
    title: "Title Generator",
    toolType: "Title Generator",
    placeholder: "Enter a topic, idea, keyword, or short description...",
    minLength: 10,
    optionLabel: "Title type",
    options: ["Blog titles", "YouTube titles", "Assignment titles", "Professional titles"]
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
    minLength: 20
  },
  "text-to-bullet-points": {
    title: "Text to Bullet Points",
    toolType: "Text to Bullet Points",
    placeholder: "Paste paragraphs to convert into clear bullet points...",
    minLength: 40,
    optionLabel: "Bullet style",
    options: ["Short bullets", "Detailed bullets", "Study notes format"]
  },
  "ai-study-notes": {
    title: "AI Study Notes Generator",
    toolType: "notes",
    placeholder: "Paste class notes, textbook text, lecture material, or study content...",
    minLength: 50,
    optionLabel: "Notes style",
    options: ["Exam revision", "Lecture notes", "Quick review"]
  },
  "explain-simple": {
    title: "Explain Like I'm 5",
    toolType: "explain",
    placeholder: "Paste a difficult paragraph, concept, definition, or topic...",
    minLength: 50,
    optionLabel: "Explanation style",
    options: ["Very simple", "Student friendly", "Short answer"]
  },
  "ai-email-writer": {
    title: "AI Email Writer",
    toolType: "email",
    placeholder: "Describe who the email is for, what you need to say, and any key details...",
    minLength: 50,
    optionLabel: "Email tone",
    options: ["Professional", "Friendly", "Formal", "Concise"]
  },
  "chat-reply-generator": {
    title: "AI Chat Reply Generator",
    toolType: "reply",
    placeholder: "Paste the message you need to reply to and any context...",
    minLength: 50,
    optionLabel: "Reply tone",
    options: ["Natural", "Friendly", "Professional", "Polite"]
  },
  "content-rewriter": {
    title: "AI Content Rewriter",
    toolType: "rewrite",
    placeholder: "Paste the content you want rewritten with the same meaning...",
    minLength: 50,
    optionLabel: "Rewrite mode",
    options: ["Clearer", "More professional", "Shorter", "Smoother"]
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
    options: ["Natural", "Professional", "Simple", "Warm"]
  },
  "ai-homework-helper": {
    title: "AI Homework Helper",
    toolType: "AI Homework Helper",
    placeholder: "Paste the homework question and what you have tried so far...",
    minLength: 30,
    optionLabel: "Help style",
    options: ["Explain steps", "Give hints", "Check my answer", "Study notes"]
  },
  "ai-essay-writer": {
    title: "AI Essay Writer",
    toolType: "AI Essay Writer",
    placeholder: "Enter essay topic, requirements, thesis idea, word count, and sources if any...",
    minLength: 40,
    optionLabel: "Output type",
    options: ["Outline", "Thesis ideas", "Draft introduction", "Revision plan"]
  },
  "ai-prompt-generator": {
    title: "AI Prompt Generator",
    toolType: "AI Prompt Generator",
    placeholder: "Describe what you want an AI assistant to help you do...",
    minLength: 20,
    optionLabel: "Prompt type",
    options: ["Writing", "Coding", "Research", "Image generation", "Productivity"]
  },
  "ai-interview-answer-generator": {
    title: "AI Interview Answer Generator",
    toolType: "AI Interview Answer Generator",
    placeholder: "Paste the interview question, role, and your real experience...",
    minLength: 50,
    optionLabel: "Answer style",
    options: ["STAR format", "Concise", "Entry-level", "Leadership"]
  },
  "ai-linkedin-summary-generator": {
    title: "AI LinkedIn Summary Generator",
    toolType: "AI LinkedIn Summary Generator",
    placeholder: "Enter your role, skills, achievements, industry, and career goal...",
    minLength: 40,
    optionLabel: "Tone",
    options: ["Professional", "Friendly", "Founder", "Job seeker"]
  },
  "ai-business-name-generator": {
    title: "AI Business Name Generator",
    toolType: "AI Business Name Generator",
    placeholder: "Describe your business idea, audience, niche, and preferred tone...",
    minLength: 20,
    optionLabel: "Name style",
    options: ["Modern", "Simple", "Premium", "Playful"]
  },
  "ai-notes-cleaner": {
    title: "AI Notes Cleaner",
    toolType: "AI Notes Cleaner",
    placeholder: "Paste messy notes, meeting notes, lecture notes, or bullet points...",
    minLength: 50,
    optionLabel: "Output style",
    options: ["Clean notes", "Action items", "Study summary", "Meeting recap"]
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

function getUsageKey() {
  return "freetoolkit-ai-tools-usage";
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
  const [successfulUses, setSuccessfulUses] = useState(0);

  useEffect(() => {
    const raw = window.localStorage.getItem(getUsageKey());
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { date?: string; count?: number };
      setSuccessfulUses(parsed.date === todayKey() ? parsed.count ?? 0 : 0);
    } catch {
      setSuccessfulUses(0);
    }
  }, []);

  const remaining = Math.max(0, CLIENT_LIMIT - successfulUses);
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

  function saveSuccessfulUse(nextCount: number) {
    setSuccessfulUses(nextCount);
    window.localStorage.setItem(getUsageKey(), JSON.stringify({ date: todayKey(), count: nextCount }));
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
      saveSuccessfulUse(successfulUses + 1);
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

  function reset() {
    setInput("");
    setName("");
    setRole("");
    setOutput("");
    setError("");
    setOption(config.options?.[0] ?? "");
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
          {remaining} free AI use{remaining === 1 ? "" : "s"} remaining today in this browser.
        </p>
        {!hasEnoughInput ? (
          <p className="text-sm font-semibold leading-6 text-slate-500">
            Please enter more text
          </p>
        ) : null}
        {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">{error}</p> : null}
      </div>

      <Card className="min-h-80 bg-gradient-to-b from-white to-slate-50/80">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-600">Output</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{config.title}</h3>
          </div>
          <SecondaryButton type="button" onClick={copyOutput} disabled={!output} className="min-h-10 px-4 py-2">
            Copy
          </SecondaryButton>
        </div>
        {output ? (
          <SecondaryButton type="button" onClick={() => generate({ keepOutput: true })} disabled={loading || remaining <= 0} className="mt-4">
            Regenerate
          </SecondaryButton>
        ) : null}
        <div className="mt-5 min-h-72 whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
          {loading ? "Generating a clean, structured result..." : output || config.emptyState || "Your AI output will appear here. Add context on the left and click Generate."}
        </div>
      </Card>
    </div>
  );
}

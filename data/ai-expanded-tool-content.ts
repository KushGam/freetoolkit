import type { Tool } from "./tools";

type Rich = Pick<Tool, "seo" | "useCases" | "tips" | "faq" | "howToUse" | "features">;

const browser = "Runs in your browser with no signup. AI requests use a secure server route; review every line before publishing or submitting.";

export const aiHumanizerRich: Rich = {
  howToUse: [
    "Paste the paragraph or section that reads robotic, repetitive, or overly stiff.",
    "Pick a rewrite style that matches your audience (natural, professional, simple, or warm).",
    "Click Generate and read the full output twice: once for tone, once for factual alignment.",
    "Edit names, numbers, dates, and product claims manually—AI can drift on specifics.",
    "Copy the final version or download it as text after you are satisfied."
  ],
  features: [
    "Improves flow and sentence variety while keeping your original intent",
    "Useful for cover letters, client emails, blog intros, and student drafts",
    "Keeps controls minimal so you can iterate quickly",
    "Pairs well with Grammar Fixer and Word Counter for a full editing pass",
    browser
  ],
  useCases: [
    "Polishing AI-assisted first drafts so they sound closer to your natural voice.",
    "Softening customer support macros that feel cold when pasted verbatim.",
    "Preparing speaker notes from bullet-heavy outlines without changing the agenda.",
    "Tightening scholarship or program essays where tone must stay authentic."
  ],
  tips: [
    "Include 2–3 sentences of context (audience + goal) above the pasted text for better tone matching.",
    "If the output invents credentials, strip them—never ship unchecked facts.",
    "Try the \"Simple\" style first for international readers, then refine with \"Professional\".",
    "Split very long documents into 400–800 word chunks for steadier rewrites."
  ],
  faq: [
    { question: "Will the humanizer change my facts?", answer: "It may rephrase content in ways that look factual. You must verify names, dates, statistics, and legal statements against your sources." },
    { question: "Is this the same as plagiarism hiding?", answer: "No. The tool is for clarity and tone. You remain responsible for originality and for following academic or workplace integrity rules." },
    { question: "Can I use this for legal or medical documents?", answer: "Not without a qualified professional. Generated text is not legal, medical, or compliance advice." },
    { question: "Does it store my text?", answer: "Treat inputs like any web request: avoid secrets. See the Privacy Policy for how AI requests are handled." },
    { question: "What if the tone is still off?", answer: "Add a short note about how you want to sound (\"friendly PM\", \"formal principal\"). Manual edits after generation usually save the most time." }
  ],
  seo: [
    "The AI Humanizer is built for people who already have a draft but dislike how it reads. Maybe the sentences are uniform, the vocabulary feels stiff, or the transitions sound mechanical. Instead of rewriting from scratch, you can paste the section, choose a tone, and receive a fresh phrasing pass that keeps the underlying meaning while smoothing rhythm and readability.",
    "This workflow is especially common after using another AI tool or template. First passes often overuse certain connectors or repeat sentence openings. A humanizer pass can diversify structure, swap weak verbs, and make paragraphs feel closer to spoken language—while still demanding your review for accuracy, especially around numbers, product names, and citations.",
    "Professionals use tone adjustments for client updates, internal announcements, and LinkedIn posts where authenticity matters. Students might use it to clarify reflective writing—as long as institutional rules allow assistance and the final ideas remain theirs. Marketers can adapt campaign blurbs so they do not sound like generic AI slogans.",
    "Because FreeToolKit keeps the interface lightweight, you can iterate quickly: generate, skim, tweak, regenerate a smaller paragraph, or move to Grammar Fixer for mechanical issues. Pair the humanizer with Word Counter when you must hit strict limits, and with Paraphrasing Tool when you need a stronger structural rewrite instead of a polish pass.",
    "Responsible use means treating the output as a draft layer. Keep an original copy, compare versions side by side, and prefer small sections for sensitive content. If you notice hallucinated details, correct them immediately; models can introduce confident-sounding errors when they try to sound more human.",
    "Over time, many writers build a personal checklist: facts verified, tone matched to audience, inclusive language checked, jargon minimized, and final read-aloud completed. The AI Humanizer accelerates the middle steps but never replaces the final human judgment that makes writing trustworthy."
  ]
};

export const aiHomeworkHelperRich: Rich = {
  howToUse: [
    "Paste the full question plus any diagrams described in words.",
    "Mention what you tried (formula, textbook page, partial solution) so the model meets you where you are.",
    "Choose Explain steps for walkthroughs, Hints when you only want nudges, or Study notes for revision cards.",
    "Read every step and redo the calculation yourself on paper to lock in understanding.",
    "If something feels wrong, cross-check with your instructor, textbook, or official solutions manual."
  ],
  features: [
    "Breaks complex prompts into ordered steps with plain-language explanations",
    "Supports multiple help styles so you can stay within classroom rules",
    "Fast reset between subjects during a study session",
    "Complements Flashcard Generator and Study Timer for exam prep",
    browser
  ],
  useCases: [
    "Understanding why a physics problem uses a particular unit conversion.",
    "Getting unstuck on a multi-part statistics question when the textbook example skips algebra.",
    "Turning a confusing word problem into a checklist of equations you should consider.",
    "Preparing parent-friendly explanations while students show their own work."
  ],
  tips: [
    "Label unknowns clearly (\"I do not know how to isolate x here\").",
    "Ask for common mistakes students make on this problem type—then avoid them.",
    "If your school forbids generative AI, do not use this tool for graded submissions.",
    "Pair with Explain Simple when definitions feel too dense in the original material."
  ],
  faq: [
    { question: "Will this do my homework for me?", answer: "It is designed to teach, not to submit finished work. Learning sticks when you redo the steps yourself." },
    { question: "Can I paste exam questions?", answer: "Only if your institution permits it. Honor codes vary; you are responsible for compliance." },
    { question: "Why did the answer disagree with my teacher?", answer: "Models can err. Treat conflicting results as a signal to ask your instructor or TA." },
    { question: "Does it support math notation?", answer: "Paste plain-text math. For heavy symbolic work, use a CAS approved for your course." },
    { question: "How is this different from AI Essay Writer?", answer: "Homework Helper focuses on problem solving steps; Essay Writer focuses on outlines and thesis planning." }
  ],
  seo: [
    "Homework time is often where independent learning succeeds or collapses. A student may stare at a prompt that feels slightly different from the textbook example, unsure which principle applies. The AI Homework Helper reframes questions into manageable steps, highlights assumptions, and points toward the reasoning path—without replacing the practice you need to internalize the skill.",
    "Parents and tutors can use the tool to draft explanations they later personalize, but students still benefit most when they show their attempts. Mentioning what you already tried gives the model enough signal to avoid repeating basics you understand. That mirrors how good office hours conversations start: not \"solve this for me\" but \"I got stuck after doing X.\"",
    "STEM learners frequently need help translating word problems into equations. Humanities learners may need help spotting the thesis or organizing evidence. The Homework Helper adapts because you choose the help style: full steps, lighter hints, answer checking, or study-note summaries. Each mode is a different level of scaffolding, and responsible users pick the minimum help needed to move forward.",
    "Academic integrity is non-negotiable. Some courses explicitly ban generative AI; others allow tutoring-style assistance. Read your syllabus, ask when uncertain, and never upload confidential lab data or proprietary employer information. FreeToolKit publishes this guidance because trustworthy educational tools must foreground ethics, not bury them in fine print.",
    "When used well, the helper becomes a bridge: it clarifies vocabulary, surfaces alternate strategies, and reinforces metacognition by asking you to verify each claim. Pair it with Pomodoro Timer blocks so you alternate focused attempts with short reviews. Combine it with AI Study Notes after you understand the core idea to capture durable revision sheets.",
    "Remember that exams still test manual execution. Use the helper to understand concepts, then practice similar problems without assistance. If you discover recurring weak spots, note them and bring specific questions to your teacher—those conversations often take minutes but save hours of guesswork."
  ]
};

export const aiEssayWriterRich: Rich = {
  howToUse: [
    "Paste the assignment brief, required word count, rubric keywords, and any thesis idea—even rough.",
    "Select Outline first unless you already have structure; upgrade to Draft introduction only after headings look solid.",
    "Iterate: tighten one section at a time instead of regenerating the entire essay.",
    "Run the result through Grammar Fixer and Word Counter before submission.",
    "Rewrite every paragraph in your own words to preserve academic integrity."
  ],
  features: [
    "Produces structured outlines, thesis variations, and revision checklists",
    "Keeps tone academic without stuffing filler phrases",
    "Helps compare argument angles before you commit to research depth",
    "Works alongside APA / MLA / Harvard generators for citation drafts",
    browser
  ],
  useCases: [
    "Breaking a 2,000-word research prompt into section-level tasks.",
    "Generating counterarguments you plan to research in the library database.",
    "Creating a revision plan after a draft is returned with structural comments.",
    "Planning scholarship essays where prompts overlap."
  ],
  tips: [
    "Paste the rubric verbatim—models align better when they see exact expectations.",
    "Ask for \"three possible thesis statements with tradeoffs\" to avoid early lock-in.",
    "If citations are required, add \"do not fabricate sources\" in your instructions.",
    "Use AI Notes Cleaner to merge research snippets before outlining."
  ],
  faq: [
    { question: "Is submitting AI output allowed?", answer: "Only if your institution says so. Most classes require original writing and proper disclosure." },
    { question: "Will it cite real papers?", answer: "Never trust automatic citations. Verify every source in your library catalog or DOI resolver." },
    { question: "Can it write my entire essay?", answer: "It can draft text, but responsible use is planning and sentence-level coaching—not turnkey submission." },
    { question: "How do I avoid generic essays?", answer: "Inject personal anecdotes, course readings, and field-specific vocabulary you actually understand." },
    { question: "What tool should I use after outlining?", answer: "Try Grammar Fixer for mechanics, Word Counter for limits, and Paraphrasing Tool only when you need fresh phrasing you still verify." }
  ],
  seo: [
    "Essay writing is less about typing speed and more about structure: a defensible thesis, ordered evidence, transitions that reveal logic, and a conclusion that answers \"so what?\" The AI Essay Writer accelerates the scaffolding stage—titles, outlines, paragraph missions, counterarguments—so you can spend more energy on research, revision, and voice.",
    "Strong writers still begin with messy notes. They cluster ideas, delete tangents, and interrogate assumptions. AI can mirror that process if you feed it the actual prompt, constraints, and audience. Without that context, you get generic five-paragraph shells. With context, you receive a map you still have to walk yourself.",
    "Undergraduate and advanced placement courses often demand counterarguments, methodological reflection, or discipline-specific terminology. Use the tool to list those obligations as checklist items before drafting. Then, verify each item against your lecture notes or assigned readings so the essay remains grounded in the course—not in generic internet knowledge.",
    "Graduate applicants use essay tools to stress-test narratives: Does the opening paragraph signal purpose? Does paragraph three add new evidence or repeat paragraph two? Does the conclusion tie back to the program's values? The AI output is a mirror, not a authority. Admissions committees reward authenticity and evidence.",
    "Accessibility matters too. Students who process language differently may benefit from seeing multiple phrasings of the same idea. Still, disclosure policies matter. If you rely on AI assistance, follow your school's reporting rules and keep drafts that show your iterative edits. Transparency protects you if questions arise.",
    "Finally, pair generative planning with human feedback loops: peer review, writing center appointments, instructor office hours. Software cannot grade intent; it can only suggest patterns. The best essays remain unmistakably yours because the examples, insights, and citations trace back to work you genuinely performed."
  ]
};

export const aiPromptGeneratorRich: Rich = {
  howToUse: [
    "Describe the outcome you want in plain language, including format (table, bullet list, code).",
    "Pick a prompt type: Writing, Coding, Research, Image generation, or Productivity.",
    "Generate multiple prompt variants and merge the pieces you like.",
    "Save the winner in your notes app—version prompts like code.",
    "Iterate with constraints (\"max 120 words\", \"must include JSON schema\")."
  ],
  features: [
    "Turns vague goals into structured instructions models can follow",
    "Surfaces missing context questions you should answer before generating",
    "Helps teams standardize prompt templates for support macros",
    "Complements Keyword Extractor when analyzing long briefs",
    browser
  ],
  useCases: [
    "Creating reusable support replies that still feel personal.",
    "Drafting Stable Diffusion or Midjourney prompts with style + lighting cues.",
    "Writing Cursor/Copilot instructions that mention file paths and test commands.",
    "Teaching junior teammates how to specify acceptance criteria."
  ],
  tips: [
    "Always specify output shape first (\"return markdown table\").",
    "Mention negative constraints (\"no emojis\", \"no markdown\") when clients require plain text.",
    "Add evaluation steps (\"list assumptions then rank risks\").",
    "Keep a personal library of winning prompts; this tool jump-starts new ones."
  ],
  faq: [
    { question: "Will the same prompt work on every model?", answer: "No. Capabilities differ. Treat outputs as starting points and adjust tokens, examples, or safety settings per provider." },
    { question: "Can it store my prompts?", answer: "Not on the server by design. Copy important prompts to your password manager or internal wiki." },
    { question: "How is this different from AI Productivity Assistant?", answer: "Prompt Generator focuses on crafting instructions for other AI systems; Productivity Assistant reorganizes tasks from messy notes." },
    { question: "Does it know proprietary company info?", answer: "Never paste trade secrets. Use anonymized examples." },
    { question: "Can I localize prompts?", answer: "Ask for multilingual variants explicitly, then have a fluent speaker review them." }
  ],
  seo: [
    "Prompt engineering is quickly becoming a basic literacy skill—not because prompts are magical incantations, but because clear instructions reduce rework. The AI Prompt Generator helps you specify role, audience, constraints, output format, and evaluation criteria in one pass, which mirrors how senior operators already think when they delegate to junior teammates.",
    "Software developers might use the tool to draft Copilot instructions that mention frameworks, testing commands, and acceptance checks. Marketers might use it to brief image models with composition, palette, and negative space guidance. Researchers might use it to plan literature review matrices with column definitions before they touch a database.",
    "Ambiguity is expensive. Models guess when instructions omit edge cases, and those guesses become bugs, brand-risky copy, or off-topic essays. By forcing you to choose a prompt type, the generator nudges you toward the right scaffolding: code blocks for engineering, rubrics for education, story beats for creative work.",
    "Teams benefit when prompt patterns are documented. Instead of everyone inventing their own style, you can export a canonical template, tweak 10% for the task, and log results. The generator accelerates that standardization while still leaving creative control with the human author.",
    "Students learning generative AI for the first time should pair this tool with critical reading: compare outputs, note hallucination patterns, and learn to append verification steps (\"cite sources\", \"say I do not know if unsure\"). Those habits matter more than any single clever prompt.",
    "Because FreeToolKit emphasizes transparency, we remind users: prompts may be processed by third-party AI infrastructure. Do not embed API keys, passwords, or customer personally identifiable information. Anonymize examples, rotate secrets if leaked accidentally, and treat every prompt like something that could be logged somewhere in the supply chain—even if providers promise minimization."
  ]
};

export const aiInterviewAnswerRich: Rich = {
  howToUse: [
    "Paste the interview question, target role, seniority level, and company context if known.",
    "Summarize relevant experience with metrics (%, revenue, users) you can defend in a live interview.",
    "Choose STAR format for behavioral questions or Concise for phone screens.",
    "Read aloud. If a sentence feels unnatural, edit it—authenticity beats buzzwords.",
    "Practice without reading verbatim; recruiters notice rote memorization."
  ],
  features: [
    "Structures answers around situation, task, action, and result",
    "Highlights quantifiable wins you should verify",
    "Offers multiple tones for startup vs enterprise environments",
    "Pairs with Resume ATS Checker when aligning stories to job descriptions",
    browser
  ],
  useCases: [
    "Preparing for \"Tell me about a conflict\" without sounding rehearsed.",
    "Condensing a complex project into a two-minute spoken arc.",
    "Switching industries and reframing transferable skills with new vocabulary.",
    "Mock interviewing with a friend while using bullets as prompts, not scripts."
  ],
  tips: [
    "One metric plus one lesson learned beats five adjectives.",
    "Mention collaboration specifics (\"paired with design weekly\") not buzzwords alone.",
    "For leadership prompts, clarify team size, reporting structure, and outcomes.",
    "Record yourself on voice memos after generating drafts to tighten pacing."
  ],
  faq: [
    { question: "Will recruiters know I used AI?", answer: "If you sound generic, maybe. Customize examples and speak conversationally." },
    { question: "Can it invent projects for me?", answer: "Never. Only paste truthful experience; hallucinated roles are ethical and legal risks." },
    { question: "Does this replace mock interviews?", answer: "No. Practice live with humans or services; AI only drafts starting points." },
    { question: "What about NDAs?", answer: "Anonymize clients and metrics if needed while keeping truth." },
    { question: "Can I use it for school interviews?", answer: "Yes, with honest activities and disclosure rules your institution requires." }
  ],
  seo: [
    "Behavioral interviews reward stories with evidence. Recruiters listen for ownership, collaboration, conflict navigation, and learning velocity. The AI Interview Answer Generator does not invent those qualities—it helps you arrange facts you supply into coherent STAR narratives so you spend rehearsal time on delivery, not on staring at a blank page.",
    "Career changers especially struggle to translate old titles into new-domain language. The tool can suggest framing patterns (\"Led migration\" → \"Owned delivery across security and platform teams\") while you verify each claim against performance reviews or shipped artifacts. Authenticity comes from specifics: release names, customer segments, latency improvements.",
    "Phone screens demand brevity; onsite loops demand depth. Switching answer styles in the tool mirrors how coaches teach layered preparation. Generate a concise version first, then expand with follow-up prompts that ask for follow-on questions an interviewer might ask. Anticipating drill-downs reduces stammering under pressure.",
    "Inclusive interviewing also means considering how examples might be perceived. The generator can highlight unconscious bias pitfalls—such as taking sole credit for team wins—so you adjust language to reflect collaboration accurately. Still, have mentors review sensitive stories involving personnel issues.",
    "Finally, remember compliance: some employers restrict how candidates prepare with AI. When in doubt, rely on the tool for structure, not for fabricating credentials. Honesty protects your reputation long after any single interview loop."
  ]
};

export const aiLinkedInSummaryRich: Rich = {
  howToUse: [
    "List current title, years of experience, industries, flagship achievements, and career goal.",
    "Pick a tone that matches your network (Founder voice differs from Job seeker voice).",
    "Generate two variants: one concise for mobile readers, one deeper for desktop skimmers.",
    "Remove jargon your peers would not use; LinkedIn rewards clarity.",
    "Update monthly as metrics change—profiles decay quickly."
  ],
  features: [
    "Produces first-person summaries with headline + value prop alignment",
    "Surfaces skills you should verify appear elsewhere in your profile",
    "Helps transition from academic to industry phrasing",
    "Pairs with Bio Generator for shorter social snippets",
    browser
  ],
  useCases: [
    "Returning from a career break and reframing continuous learning.",
    "Consolidating freelance + full-time experience without sounding scattered.",
    "Highlighting measurable impact for sales or growth roles.",
    "Localizing a summary for a new country while keeping facts identical."
  ],
  tips: [
    "Paste your headline so the summary does not repeat it verbatim.",
    "Mention tools you actually use daily; recruiters keyword-search them.",
    "Add a sentence about the problems you want next—not just past wins.",
    "Avoid empty superlatives; replace them with numbers or scope statements."
  ],
  faq: [
    { question: "Will this guarantee recruiter messages?", answer: "No. Profiles depend on network, timing, and demand. The tool improves narrative clarity only." },
    { question: "Can I write in third person?", answer: "LinkedIn defaults to first person for About. Adjust manually if you prefer brand voice." },
    { question: "Does it handle multiple languages?", answer: "Ask explicitly for a language variant, then have a fluent colleague proofread." },
    { question: "What about compliance roles?", answer: "Avoid promising certifications you do not hold." },
    { question: "How is this different from Resume Builder?", answer: "Resume Builder formats full documents; this tool focuses on the About narrative only." }
  ],
  seo: [
    "Your LinkedIn About section is the handshake after your headline. Recruiters skim for proof of impact, domain expertise, and motivation. The AI LinkedIn Summary Generator helps you stitch those threads into a coherent narrative without repeating your entire work history—that belongs in Experience entries.",
    "Founders often need two layers of messaging: credible operator details and a vision sentence showing why the company exists. Job seekers need a skills spine plus a forward-looking line about the roles they want next. The generator adapts because you choose tone presets, but you should still align keywords with roles you intend to apply for.",
    "Keyword stuffing is outdated; authenticity plus specificity wins search. Mention frameworks, customer segments, or regulated environments only if true. Pair the summary with Featured links or posts that prove the claims. Social proof reduces skepticism more than adjectives ever will.",
    "International members should watch spelling variants and idioms. Generate a draft, then localize manually. If you operate in multiple languages, consider maintaining two profile versions rather than cramming everything into one paragraph.",
    "Accessibility also matters: short paragraphs, line breaks, and bullets improve mobile readability. The generator tends to emit structured blocks; keep them rather than merging into walls of text.",
    "Update triggers include promotions, pivots to management, new certifications, or public speaking circuits. Think of your summary as living documentation. Re-run the tool quarterly with fresh metrics so the story matches reality when hiring managers compare it to your resume."
  ]
};

export const aiBusinessNameRich: Rich = {
  howToUse: [
    "Describe product, audience, geography, competitors to avoid, and tone (modern, playful, etc.).",
    "Generate clusters of names, then manually search trademark and domain availability.",
    "Say aloud the top five—if partners cannot pronounce them, drop them.",
    "Test international meanings via native speakers before locking a global brand.",
    "Document final rationale for investors or trademark counsel."
  ],
  features: [
    "Brainstorms positioning lines alongside name ideas",
    "Respects tone constraints for premium vs playful markets",
    "Useful for side projects, podcasts, newsletters, and micro-SaaS",
    "Pairs with AI Prompt Generator for naming image models or mascots",
    browser
  ],
  useCases: [
    "Naming a weekend API wrapper before you commit engineering time.",
    "Creating shortlist decks for cofounder meetings.",
    "Renaming features inside a product after confusing analytics.",
    "Drafting podcast episode titles that still need human punch-up."
  ],
  tips: [
    "Ask for \"10 names + rationale + possible downside\" in your paste area before generating.",
    "Avoid names that are pure dictionary words if SEO uniqueness matters.",
    "Check social handles immediately, not just .com domains.",
    "Sleep on finalists—bias fades overnight."
  ],
  faq: [
    { question: "Does it check trademarks?", answer: "No. You must search official databases and consult counsel for high-stakes launches." },
    { question: "Can names be offensive in another language?", answer: "Possibly. Always validate with native speakers." },
    { question: "Will Google like the name for SEO?", answer: "Unique coined words rank differently than generic terms; strategy varies." },
    { question: "Can I use output verbatim?", answer: "Verify uniqueness; other users may see similar suggestions." },
    { question: "What if I only have a vague idea?", answer: "Start broad, then rerun with narrowed niche and competitor list." }
  ],
  seo: [
    "Naming is part linguistics, part trademark law, part marketing intuition. The AI Business Name Generator accelerates divergent thinking: it proposes combinations, metaphors, and positioning blurbs you can react to. Reaction is the key—great naming sessions are iterative conversations, not one-shot miracles.",
    "Coined words can improve trademark distinctiveness but hurt memorability if they are unpronounceable. Descriptive names communicate category instantly but are hard to own legally. The generator can explore both ends if you specify constraints like \"must be two syllables\" or \"avoid animal metaphors.\"",
    "Micro-SaaS founders often need names before they validate demand. Use the tool to produce a shortlist, build landing pages with each candidate headline, and run lightweight traffic tests. The data matters more than internal taste debates.",
    "Creative professionals naming podcasts or newsletters benefit from tone controls. Playful names signal community; premium names signal depth. Align the name with the monetization path—ads vs subscriptions vs services—or you will confuse audiences at launch.",
    "Always perform due diligence: domain availability, App Store collisions, offensive slang checks, and social handle squatting. AI cannot browse the live web for you in this workflow, so treat suggestions as sparks, not decisions.",
    "Document rejected names too. They reveal boundaries (\"too pharma\", \"too childish\") that keep the team aligned. Over time, your naming rubric becomes reusable for sub-brands and feature releases without restarting from zero."
  ]
};

export const aiNotesCleanerRich: Rich = {
  howToUse: [
    "Paste messy notes: meeting minutes, lecture photos transcribed, Slack dumps, or brainstorm bullets.",
    "Choose Clean notes, Action items, Study summary, or Meeting recap depending on audience.",
    "Delete duplicate sections the model missed—cleanup is collaborative.",
    "Send structured output to teammates or move it into Notion/Obsidian manually.",
    "For recurring meetings, save a template header you prepend each time."
  ],
  features: [
    "Reorders scattered bullets into sections with headings",
    "Pulls action items with implied owners when mentioned",
    "Highlights open questions separately from decisions",
    "Pairs with Text to Bullet Points for opposite workflow needs",
    browser
  ],
  useCases: [
    "Turning five pages of raw workshop notes into a one-page executive summary.",
    "Preparing study guides after live lectures with incomplete sentences.",
    "Cleaning customer discovery call notes before sharing internally.",
    "Summarizing retro action items without losing nuance."
  ],
  tips: [
    "Prefix lines with speaker initials if dialogues confuse the model.",
    "Ask to \"preserve dates and numbers exactly\" when finances are involved.",
    "Split notes longer than ~2k words for sharper restructuring.",
    "Follow with Keyword Extractor to tag themes for research archives."
  ],
  faq: [
    { question: "Will it delete important warnings?", answer: "Maybe. Compare against the original before discarding the messy version." },
    { question: "Does it integrate with Notion?", answer: "Copy/paste only. Export integrations may arrive later." },
    { question: "Can it redact PII?", answer: "Not automatically. Remove secrets before pasting." },
    { question: "How is this different from Transcript Summarizer?", answer: "Notes Cleaner reorganizes mixed note types; Transcript Summarizer targets long spoken transcripts." },
    { question: "Does it keep timestamps?", answer: "Mention that requirement explicitly in your text header." }
  ],
  seo: [
    "Knowledge work produces messy artifacts: half sentences from walking meetings, URLs dumped mid-paragraph, decisions buried under chatter. The AI Notes Cleaner imposes scaffolding—headings, action tables, open questions—so downstream teammates actually read the doc instead of abandoning it.",
    "Students transcribing whiteboards often lose structure. The cleaner can infer topic boundaries if you include week numbers or course codes. Still, verify formulas and definitions; models occasionally smooth text at the cost of precision.",
    "Product managers benefit when raw discovery notes become opportunity themes without hours of manual tagging. Feed anonymized quotes, ask for thematic clusters, then sanity-check against recordings if available.",
    "Compliance-focused teams should strip sensitive data before pasting. The cleaner is not a DLP (data loss prevention) scanner. Pair organizational policies with manual redaction or internal tools before using any cloud AI workflow.",
    "Habit stacking matters: run the cleaner immediately after meetings while memory is fresh, then archive originals in a restricted folder. Waiting a week makes validation harder because you forget context.",
    "Over time, note quality upstream improves when people see how much noise they capture. The tool is both janitor and mirror—use it to build better meeting hygiene, not only to rescue chaotic dumps."
  ]
};

export const transcriptSummarizerRich: Rich = {
  howToUse: [
    "Paste transcript text only (no private links). Include speaker labels if you have them.",
    "Pick Bullet summary for standups, Detailed summary for lectures, or Action items for PM workflows.",
    "Verify every action item against the transcript; models infer owners incorrectly sometimes.",
    "Export by copying; store summaries alongside the original file per retention policy.",
    "For public YouTube content, ensure you comply with creator licensing before republishing."
  ],
  features: [
    "Separates summary, key points, and action items when present",
    "Grounds on pasted text only—no invented speakers",
    "Useful for researchers, students, and customer success teams",
    "Pairs with AI Text Summarizer for shorter web articles",
    browser
  ],
  useCases: [
    "Condensing hour-long webinars into study notes.",
    "Sending client call recaps when official notes lag.",
    "Indexing podcast interviews for quotes you manually verify.",
    "Preparing accessibility-friendly summaries for teammates who missed live sessions."
  ],
  tips: [
    "Remove timestamps if they confuse sentence segmentation.",
    "If multiple languages appear, note which sections need translation separately.",
    "Highlight MUST-DO lines in caps before summarizing to force priority weighting.",
    "Chunk very long transcripts into logical scenes for better coherence."
  ],
  faq: [
    { question: "Can it fetch YouTube captions automatically?", answer: "No. Paste text you already exported legally." },
    { question: "Will it quote verbatim?", answer: "It may paraphrase. Pull direct quotes manually for legal precision." },
    { question: "Does it work on confidential HR investigations?", answer: "Do not paste sensitive HR data into third-party AI without approval." },
    { question: "What about low-quality ASR?", answer: "Clean obvious errors first; garbage in produces garbage summaries." },
    { question: "How is this different from AI Study Notes?", answer: "Study Notes optimizes memorization structure; Transcript Summarizer preserves meeting narrative flow." }
  ],
  seo: [
    "Transcripts are dense: filler words, interruptions, and overlapping dialogue. Reading them linearly wastes time. The Transcript Summarizer compresses signal while flagging follow-ups, but it cannot replace judgment about what is legally binding or commercially sensitive.",
    "Researchers use summaries to decide whether to read entire interviews. Sales teams use them to brief account executives before QBRs. Students use them to revisit lectures without rewatching entire recordings. Each use case demands different fidelity—tune the summary style accordingly.",
    "Accessibility is another win: concise summaries help colleagues with hearing fatigue or schedule conflicts. Pair summaries with timestamps only if you verify them; automatic alignment without diarization data can drift.",
    "Copyright matters: transcripts from copyrighted performances are still protected. Summaries may qualify as transformative in some jurisdictions, but do not assume—especially for paid courses or unreleased media.",
    "Hallucinated action items are the biggest risk. Always diff the summary against the transcript before assigning tasks in Jira. A mistaken owner string can erode team trust faster than no notes at all.",
    "For public content creators, summaries can seed chapter markers or blog posts. Still, add your own commentary and citations. Search engines reward unique analysis, not duplicate recap text scraped from others."
  ]
};

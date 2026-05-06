const { useEffect, useMemo, useState } = React;

const STORAGE_KEY = "paris-techno-business-plan-interviews";
const ACTIVE_KEY = "paris-techno-business-plan-active-interview";
const PERSON_COUNT = 3;

const sections = [
  {
    id: "personal",
    title: "Personal Information",
    kicker: "Profile and relationship to the scene",
    questions: [
      q("firstName", "First name", "text", { required: true }),
      q("lastName", "Last name", "text", { required: true }),
      q("age", "Age", "number", { min: 16, max: 99 }),
      q("dateOfBirth", "Date of birth", "date"),
      q("background", "Background", "textarea", { placeholder: "Work, studies, creative background, network..." }),
      q("technoDiscovery", "How did you discover techno music?", "textarea"),
      q("technoInvolvement", "How long have you been involved in techno?", "text"),
      q("sceneRole", "Are you a DJ, promoter, or enthusiast?", "select", {
        options: ["DJ", "Promoter", "Enthusiast", "Producer", "Venue operator", "Other"]
      })
    ]
  },
  {
    id: "motivation",
    title: "Motivation & Commitment",
    kicker: "Intent, energy, and personal trajectory",
    questions: [
      q("projectReason", "Why do you want to start this project?", "textarea", { required: true }),
      q("businessSeriousness", "Is this a serious business or a side project?", "select", {
        options: ["Serious business", "Side project", "Testing the idea", "Not sure yet"]
      }),
      q("weeklyTime", "How much time are you willing to invest weekly?", "number", { min: 0, max: 80 }),
      q("commitmentLevel", "What level of commitment do you have?", "range", { min: 1, max: 10 }),
      q("personalGoals", "What are your personal goals with this project?", "textarea"),
      q("threeYearSelf", "Where do you see yourself in 3 years?", "textarea")
    ]
  },
  {
    id: "vision",
    title: "Vision & Concept",
    kicker: "Creative direction and positioning",
    questions: [
      q("eventTypes", "What type of events do you want to create?", "textarea", { required: true }),
      q("musicalDirection", "Musical direction", "text", { placeholder: "Hard groove, industrial techno, hypnotic, acid..." }),
      q("targetAudience", "Target audience", "textarea"),
      q("atmosphere", "Desired atmosphere / identity", "textarea"),
      q("inspirations", "Inspirations", "textarea", { placeholder: "Clubs, labels, collectives, artists..." }),
      q("uniqueness", "What makes your events unique?", "textarea")
    ]
  },
  {
    id: "format",
    title: "Event Format",
    kicker: "Shape of the nights and production model",
    questions: [
      q("liveDjSets", "Do you want live DJ sets?", "select", { options: ["Yes", "No", "Mixed format", "Unsure"] }),
      q("djScope", "Local or international DJs?", "select", { options: ["Local", "International", "Both", "Resident-focused"] }),
      q("eventFrequency", "Frequency of events", "select", { options: ["Weekly", "Monthly", "Quarterly", "Pop-up / irregular"] }),
      q("eventSize", "Event size", "select", { options: ["Small club", "Warehouse", "Large venue", "Open-air", "Festival scale"] }),
      q("preferredLocations", "Preferred locations", "textarea", { placeholder: "Paris clubs, warehouses, open-air spaces..." }),
      q("eventTiming", "Day or night events?", "select", { options: ["Night", "Day", "Both", "Afterhours"] })
    ]
  },
  {
    id: "roles",
    title: "Roles & Responsibilities",
    kicker: "Operating contribution and partnership shape",
    questions: [
      q("desiredRole", "What role do you want to play?", "textarea", { placeholder: "DJ, organizer, marketing, finance..." }),
      q("skills", "Skills you bring", "textarea"),
      q("weaknesses", "Weaknesses or gaps", "textarea"),
      q("partnerExpectations", "Expectations from partners", "textarea")
    ]
  },
  {
    id: "professionalism",
    title: "Professionalism Level",
    kicker: "Ambition, growth pace, and risk appetite",
    questions: [
      q("brandCompany", "Do you want to build a brand/company?", "select", { options: ["Yes", "No", "Eventually", "Unsure"] }),
      q("ambitionLevel", "Level of ambition", "select", { options: ["Local", "National", "International"] }),
      q("monetizationPace", "Do you want to monetize quickly or grow slowly?", "select", { options: ["Monetize quickly", "Grow slowly", "Balanced"] }),
      q("riskTolerance", "Risk tolerance", "select", { options: ["Low", "Medium", "High"] })
    ]
  },
  {
    id: "financials",
    title: "Financials",
    kicker: "Capital, pricing, revenue, and viability",
    questions: [
      q("initialInvestment", "Initial investment amount (€)", "currency", { min: 0 }),
      q("reinvestProfits", "Willingness to reinvest profits", "select", { options: ["Yes", "No", "Partially", "Depends on performance"] }),
      q("budgetAllocation", "Budget allocation", "textarea", { placeholder: "Artists, venue, marketing, logistics..." }),
      q("ticketPricing", "Ticket pricing strategy", "textarea"),
      q("revenueStreams", "Revenue streams", "textarea", { placeholder: "Tickets, bar, partnerships..." }),
      q("breakEven", "Break-even expectations", "textarea")
    ]
  },
  {
    id: "operations",
    title: "Operations",
    kicker: "Network, structure, tooling, and go-to-market",
    questions: [
      q("existingContacts", "Do you already have contacts?", "textarea", { placeholder: "Venues, DJs, collectives, suppliers..." }),
      q("legalStructure", "Legal structure considered?", "text", { placeholder: "Association, SAS, micro-entreprise..." }),
      q("marketingStrategy", "Marketing strategy", "textarea", { placeholder: "Social media, flyers, community..." }),
      q("tools", "Tools to use", "textarea", { placeholder: "Ticketing platforms, CRM, accounting, design..." })
    ]
  },
  {
    id: "strategy",
    title: "Long-Term Strategy",
    kicker: "Future moves beyond the first nights",
    questions: [
      q("oneYearVision", "Vision in 1 year", "textarea"),
      q("threeYearVision", "Vision in 3 years", "textarea"),
      q("fiveYearVision", "Vision in 5 years", "textarea"),
      q("expansionPlans", "Expansion plans", "textarea", { placeholder: "Festivals, label, touring..." }),
      q("brandIdentity", "Brand identity development", "textarea")
    ]
  },
  {
    id: "alignment",
    title: "Alignment Check",
    kicker: "Partnership fit and hard boundaries",
    questions: [
      q("partnershipExpectations", "What are your expectations from this partnership?", "textarea", { required: true }),
      q("leaveReasons", "What would make you leave the project?", "textarea"),
      q("nonNegotiables", "What are your non-negotiables?", "textarea"),
      q("readyToInvest", "Are you ready to invest money and time consistently?", "select", {
        options: ["Yes", "No", "With limits", "Need more clarity"]
      })
    ]
  }
];

const allQuestions = sections.flatMap((section) =>
  section.questions.map((question) => ({ ...question, sectionTitle: section.title }))
);

function q(id, label, type, config = {}) {
  return { id, label, type, ...config };
}

function emptyAnswers() {
  return Object.fromEntries(allQuestions.map((question) => [question.id, question.type === "range" ? "5" : ""]));
}

function emptyRespondents() {
  return Array.from({ length: PERSON_COUNT }, (_, index) => ({
    id: crypto.randomUUID(),
    label: `Person ${index + 1}`,
    answers: emptyAnswers()
  }));
}

function normalizeInterview(interview) {
  if (interview.respondents?.length) {
    return {
      ...interview,
      respondents: interview.respondents.slice(0, PERSON_COUNT).map((person, index) => ({
        id: person.id || crypto.randomUUID(),
        label: person.label || `Person ${index + 1}`,
        answers: { ...emptyAnswers(), ...(person.answers || {}) }
      }))
    };
  }

  return {
    ...interview,
    respondents: [
      {
        id: crypto.randomUUID(),
        label: interview.label || "Person 1",
        answers: { ...emptyAnswers(), ...(interview.answers || {}) }
      },
      ...emptyRespondents().slice(1)
    ]
  };
}

function completionFor(respondents) {
  const total = allQuestions.length * respondents.length;
  const answered = respondents.reduce((sum, person) => {
    return sum + allQuestions.filter((question) => String(person.answers[question.id] || "").trim()).length;
  }, 0);
  return { answered, total, percent: Math.round((answered / total) * 100) };
}

function personName(person, index) {
  const first = person.answers.firstName || "";
  const last = person.answers.lastName || "";
  return [first, last].filter(Boolean).join(" ").trim() || person.label || `Person ${index + 1}`;
}

function labelFor(respondents) {
  const names = respondents.map(personName).filter((name) => !/^Person \d+$/.test(name));
  return names.length ? names.join(" + ") : "3-person interview";
}

function summaryFor(answers, notes = "") {
  const commitment = Number(answers.commitmentLevel || 0);
  const weeklyTime = Number(answers.weeklyTime || 0);
  const investment = Number(answers.initialInvestment || 0);
  const riskScore = answers.riskTolerance === "High" ? 90 : answers.riskTolerance === "Medium" ? 62 : answers.riskTolerance === "Low" ? 34 : 50;
  const moneyScore = investment >= 5000 ? 90 : investment >= 1500 ? 70 : investment > 0 ? 48 : 22;
  const timeScore = weeklyTime >= 20 ? 92 : weeklyTime >= 10 ? 72 : weeklyTime >= 5 ? 52 : 25;
  const motivationScore = Math.min(100, Math.round(commitment * 7 + Math.min(timeScore, 30)));
  const alignmentScore = Math.max(0, Math.min(100, Math.round((commitment * 10 + timeScore + moneyScore + riskScore + (answers.readyToInvest === "Yes" ? 90 : 45)) / 5)));
  const keyRisks = [
    weeklyTime < 8 ? "Limited weekly availability may slow outreach, promotion, and production work." : "",
    investment < 1000 ? "Low launch capital could constrain artists, deposits, production, and marketing." : "",
    !answers.existingContacts ? "No current network entered; venue and talent access should be validated early." : "",
    answers.riskTolerance === "Low" ? "Low risk tolerance may clash with the uncertainty of event production." : "",
    answers.readyToInvest !== "Yes" ? "Consistent money and time investment needs clarification before committing." : ""
  ].filter(Boolean);

  return {
    visionSummary: [
      answers.eventTypes && `Format: ${answers.eventTypes}`,
      answers.musicalDirection && `Music: ${answers.musicalDirection}`,
      answers.targetAudience && `Audience: ${answers.targetAudience}`,
      answers.uniqueness && `Differentiation: ${answers.uniqueness}`
    ].filter(Boolean),
    financialOverview: {
      initialInvestment: investment,
      budgetAllocation: answers.budgetAllocation,
      ticketPricing: answers.ticketPricing,
      revenueStreams: answers.revenueStreams,
      breakEven: answers.breakEven
    },
    keyRisks: keyRisks.length ? keyRisks : ["No major risk signal from current answers. Validate assumptions with quotes and demand tests."],
    motivationScore,
    alignmentScore,
    notes
  };
}

function groupSummaryFor(respondents, notes) {
  const perPerson = respondents.map((person, index) => ({
    id: person.id,
    name: personName(person, index),
    summary: summaryFor(person.answers)
  }));
  const avg = (field) => Math.round(perPerson.reduce((sum, item) => sum + item.summary[field], 0) / perPerson.length);
  const totalInvestment = respondents.reduce((sum, person) => sum + Number(person.answers.initialInvestment || 0), 0);
  const disagreements = findDisagreements(respondents, ["businessSeriousness", "ambitionLevel", "riskTolerance", "readyToInvest", "eventFrequency", "eventSize"]);
  const weakSignals = perPerson.flatMap((item) => item.summary.keyRisks.map((risk) => `${item.name}: ${risk}`));

  return {
    perPerson,
    groupMotivation: avg("motivationScore"),
    groupAlignment: Math.max(0, avg("alignmentScore") - Math.min(disagreements.length * 4, 24)),
    totalInvestment,
    disagreements,
    keyRisks: weakSignals.slice(0, 8),
    notes
  };
}

function findDisagreements(respondents, ids) {
  return ids.flatMap((id) => {
    const values = respondents.map((person) => String(person.answers[id] || "").trim()).filter(Boolean);
    const unique = [...new Set(values)];
    if (unique.length <= 1) return [];
    const question = allQuestions.find((item) => item.id === id);
    return [`${question.label}: ${unique.join(" / ")}`];
  });
}

function getInitialRoute() {
  const params = new URLSearchParams(window.location.search);
  const person = Number(params.get("person"));
  return {
    requestedInterviewId: params.get("interview"),
    personIndex: Number.isInteger(person) && person >= 1 && person <= PERSON_COUNT ? person - 1 : null
  };
}

function currentBaseUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function App() {
  const [route] = useState(getInitialRoute);
  const [step, setStep] = useState(0);
  const [respondents, setRespondents] = useState(emptyRespondents);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const section = sections[step];
  const isPersonView = route.personIndex !== null;
  const respondentEntries = respondents
    .map((person, index) => ({ person, index }))
    .filter((entry) => route.personIndex === null || entry.index === route.personIndex);
  const completion = completionFor(respondentEntries.map((entry) => entry.person));
  const groupSummary = useMemo(() => groupSummaryFor(respondents, notes), [respondents, notes]);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").map(normalizeInterview);
    const activeInterviewId = route.requestedInterviewId || localStorage.getItem(ACTIVE_KEY);
    fetch("/api/interviews")
      .then((response) => response.json())
      .then((data) => {
        const remote = (data.interviews || []).map(normalizeInterview);
        const merged = [...remote, ...local];
        const unique = Array.from(new Map(merged.map((item) => [item.id, item])).values());
        restoreLatestInterview(unique, activeInterviewId);
        setSaved(unique);
        setHydrated(true);
      })
      .catch(() => {
        restoreLatestInterview(local, activeInterviewId);
        setSaved(local);
        setHydrated(true);
      });
  }, [route.requestedInterviewId]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [saved, hydrated]);

  function restoreLatestInterview(interviews, activeInterviewId) {
    const interview = interviews.find((item) => item.id === activeInterviewId) || interviews[0];
    if (!interview) return;

    const normalized = normalizeInterview(interview);
    setActiveId(normalized.id);
    setRespondents(normalized.respondents);
    setNotes(normalized.notes || "");
    setStatus(`Restored ${normalized.label}.`);
  }

  function updateAnswer(personIndex, questionId, value) {
    setRespondents((current) =>
      current.map((person, index) =>
        index === personIndex ? { ...person, answers: { ...person.answers, [questionId]: value } } : person
      )
    );
  }

  function updatePersonLabel(personIndex, value) {
    setRespondents((current) =>
      current.map((person, index) => (index === personIndex ? { ...person, label: value || `Person ${index + 1}` } : person))
    );
  }

  async function saveInterview() {
    const now = new Date().toISOString();
    let respondentsToSave = respondents;
    let notesToSave = notes;
    let createdAt = saved.find((item) => item.id === activeId)?.createdAt || now;

    if (isPersonView && activeId) {
      try {
        const response = await fetch("/api/interviews");
        const data = await response.json();
        const remote = (data.interviews || []).map(normalizeInterview).find((item) => item.id === activeId);
        if (remote) {
          createdAt = remote.createdAt || createdAt;
          notesToSave = remote.notes || "";
          respondentsToSave = remote.respondents.map((person, index) =>
            index === route.personIndex ? respondents[route.personIndex] : person
          );
        }
      } catch {
        setStatus("Saved locally. Backend merge unavailable.");
      }
    }

    const interview = {
      id: activeId || crypto.randomUUID(),
      label: labelFor(respondentsToSave),
      createdAt,
      updatedAt: now,
      respondents: respondentsToSave,
      notes: notesToSave,
      summary: groupSummaryFor(respondentsToSave, notesToSave)
    };
    const nextSaved = [interview, ...saved.filter((item) => item.id !== interview.id)];
    setSaved(nextSaved);
    setActiveId(interview.id);
    localStorage.setItem(ACTIVE_KEY, interview.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSaved));
    setStatus("Saved locally and to backend.");
    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interview)
      });
      const data = await response.json();
      if (data.interview) {
        const persisted = normalizeInterview(data.interview);
        setRespondents(persisted.respondents);
        setNotes(persisted.notes || "");
        setSaved((current) => {
          const updated = [persisted, ...current.filter((item) => item.id !== persisted.id)];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        localStorage.setItem(ACTIVE_KEY, persisted.id);
      }
    } catch {
      setStatus("Saved locally. Backend unavailable.");
    }
  }

  function loadInterview(interview) {
    const normalized = normalizeInterview(interview);
    setActiveId(normalized.id);
    setRespondents(normalized.respondents);
    setNotes(normalized.notes || "");
    setStep(0);
    localStorage.setItem(ACTIVE_KEY, normalized.id);
    setStatus(`Loaded ${normalized.label}.`);
  }

  function newInterview() {
    setActiveId(null);
    setRespondents(emptyRespondents());
    setNotes("");
    setStep(0);
    localStorage.removeItem(ACTIVE_KEY);
    setStatus("New 3-person interview started.");
  }

  function exportJson() {
    const payload = {
      exportedAt: new Date().toISOString(),
      interview: { label: labelFor(respondents), respondents, notes },
      summary: groupSummary
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    downloadUrl(url, `${slug(labelFor(respondents))}-business-plan.json`);
  }

  function exportPdf() {
    const doc = new window.jspdf.jsPDF();
    let y = 18;
    const margin = 16;
    const body = (text) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.splitTextToSize(text || "No answer provided.", 178).forEach((line) => {
        if (y > 280) {
          doc.addPage();
          y = 18;
        }
        doc.text(line, margin, y);
        y += 5;
      });
      y += 3;
    };
    const title = (text) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(text, margin, y);
      y += 9;
    };

    title(`Business Plan Interview: ${labelFor(respondents)}`);
    body(`Generated ${new Date().toLocaleString()}`);
    title("Group Summary");
    body(`Group motivation: ${groupSummary.groupMotivation}/100`);
    body(`Group alignment: ${groupSummary.groupAlignment}/100`);
    body(`Total initial investment: EUR ${groupSummary.totalInvestment}`);
    body(`Disagreements: ${groupSummary.disagreements.join(" | ") || "No major disagreement detected."}`);
    title("Per-Person Scores");
    groupSummary.perPerson.forEach((item) => body(`${item.name}: Motivation ${item.summary.motivationScore}/100, Alignment ${item.summary.alignmentScore}/100`));
    title("Interview Answers");
    allQuestions.forEach((question) => {
      body(`${question.sectionTitle} - ${question.label}`);
      respondents.forEach((person, index) => body(`${personName(person, index)}: ${person.answers[question.id] || ""}`));
    });
    if (notes.trim()) {
      title("Interviewer Notes");
      body(notes);
    }
    doc.save(`${slug(labelFor(respondents))}-summary.pdf`);
  }

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-5">
        <div className="rounded-lg border border-white/10 bg-black/45 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-acid">Paris techno</p>
          <h1 className="mt-2 text-2xl font-semibold">Loading interview</h1>
          <p className="mt-2 text-sm text-zinc-400">Restoring saved answers...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-5 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="no-print rounded-lg border border-white/10 bg-black/40 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-acid">Paris techno</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight">Business Plan Interview</h1>
          <p className="mt-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300">
            {isPersonView ? `Respondent view: ${personName(respondents[route.personIndex], route.personIndex)}` : "Admin view"}
          </p>
          <p className="mt-2 text-sm text-zinc-400">{completion.answered} of {completion.total} answers captured</p>
          <div className="my-5 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-acid shadow-neon transition-all" style={{ width: `${completion.percent}%` }} />
          </div>
          <nav className="space-y-1">
            {sections.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setStep(index)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${index === step ? "bg-acid text-black" : "text-zinc-300 hover:bg-white/10"}`}
              >
                <span>{item.title}</span>
                <span className="text-xs">{index + 1}</span>
              </button>
            ))}
          </nav>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {!isPersonView && <button onClick={newInterview} className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10">New</button>}
            <button onClick={saveInterview} className="rounded-md bg-pulse px-3 py-2 text-sm font-medium text-white hover:bg-pulse/85">Save</button>
          </div>
          {status && <p className="mt-2 text-xs text-zinc-500">{status}</p>}
        </aside>

        <section className="space-y-5">
          <div className="rounded-lg border border-white/10 bg-steel/80 p-5 shadow-2xl backdrop-blur">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-acid">{section.kicker}</p>
                <h2 className="mt-2 text-3xl font-semibold">{section.title}</h2>
              </div>
              {!isPersonView && <div className="flex gap-2">
                <button onClick={exportJson} className="rounded-md border border-white/10 px-3 py-2 text-sm hover:bg-white/10">JSON</button>
                <button onClick={exportPdf} className="rounded-md border border-white/10 px-3 py-2 text-sm hover:bg-white/10">PDF</button>
              </div>}
            </div>

            <div className={`mb-5 grid gap-3 ${isPersonView ? "md:grid-cols-1" : "md:grid-cols-3"}`}>
              {respondentEntries.map(({ person, index }) => (
                <label key={person.id} className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-zinc-500">Respondent {index + 1}</span>
                  <input
                    value={person.label}
                    onChange={(event) => updatePersonLabel(index, event.target.value)}
                    className="field h-10 px-3 text-sm"
                    placeholder={`Person ${index + 1}`}
                  />
                </label>
              ))}
            </div>

            <div className="space-y-5">
              {section.questions.map((question) => (
                <QuestionRow key={question.id} question={question} entries={respondentEntries} onChange={updateAnswer} />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="rounded-md border border-white/10 px-4 py-2 text-sm disabled:opacity-40">Previous</button>
              <button onClick={() => setStep(Math.min(sections.length - 1, step + 1))} disabled={step === sections.length - 1} className="rounded-md bg-acid px-4 py-2 text-sm font-semibold text-black disabled:opacity-40">Next section</button>
            </div>
          </div>

          {!isPersonView && <ShareLinks activeId={activeId} respondents={respondents} />}

          {!isPersonView && <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <GroupSummaryPanel groupSummary={groupSummary} />
            <div className="rounded-lg border border-white/10 bg-black/45 p-5">
              <h3 className="mb-4 text-lg font-semibold">Interviewer Notes</h3>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows="8" placeholder="Signals, doubts, follow-ups, quotes, decisions..." className="field min-h-48 px-3 py-3 text-sm" />
            </div>
          </div>}

          {!isPersonView && <div className="grid gap-5 xl:grid-cols-2">
            <SavedInterviews saved={saved} loadInterview={loadInterview} />
            <ThreePersonComparison groupSummary={groupSummary} respondents={respondents} />
          </div>}
        </section>
      </div>
    </main>
  );
}

function QuestionRow({ question, entries, onChange }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-zinc-100">
          {question.label}{question.required && <span className="text-acid"> *</span>}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">{entries.length} answer{entries.length > 1 ? "s" : ""} collected for this question</p>
      </div>
      <div className={`grid gap-3 ${entries.length > 1 ? "lg:grid-cols-3" : "lg:grid-cols-1"}`}>
        {entries.map(({ person, index }) => (
          <Field
            key={`${person.id}-${question.id}`}
            question={question}
            personLabel={personName(person, index)}
            value={person.answers[question.id] || ""}
            onChange={(value) => onChange(index, question.id, value)}
          />
        ))}
      </div>
    </div>
  );
}

function ShareLinks({ activeId, respondents }) {
  const [copied, setCopied] = useState("");

  if (!activeId) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/45 p-5">
        <h3 className="text-lg font-semibold">Share Links</h3>
        <p className="mt-2 text-sm text-zinc-400">Save the interview once to generate stable links for each person.</p>
      </div>
    );
  }

  const links = [
    { label: "Admin", url: `${currentBaseUrl()}?interview=${activeId}&admin=1` },
    ...respondents.map((person, index) => ({
      label: personName(person, index),
      url: `${currentBaseUrl()}?interview=${activeId}&person=${index + 1}`
    }))
  ];

  async function copy(url, label) {
    await navigator.clipboard.writeText(url);
    setCopied(label);
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/45 p-5">
      <h3 className="text-lg font-semibold">Share Links</h3>
      <p className="mt-2 text-sm text-zinc-400">Send one personal link to each respondent. Keep the admin link for analysis and exports.</p>
      <div className="mt-4 grid gap-3">
        {links.map((link) => (
          <div key={link.url} className="grid gap-2 rounded-md border border-white/10 p-3 md:grid-cols-[140px_1fr_auto] md:items-center">
            <p className="text-sm font-medium text-acid">{link.label}</p>
            <input readOnly value={link.url} className="field h-10 min-w-0 px-3 text-xs" />
            <button onClick={() => copy(link.url, link.label)} className="rounded-md border border-white/10 px-3 py-2 text-sm hover:bg-white/10">
              {copied === link.label ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ question, personLabel, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-acid">{personLabel}</span>
      {question.type === "textarea" && (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={question.placeholder} rows="4" className="field px-3 py-3 text-sm" />
      )}
      {question.type === "select" && (
        <select value={value} onChange={(event) => onChange(event.target.value)} className="field h-11 px-3 text-sm">
          <option value="">Select...</option>
          {question.options.map((option) => <option key={option}>{option}</option>)}
        </select>
      )}
      {question.type === "range" && (
        <div className="flex h-11 items-center gap-3 rounded-md border border-white/10 bg-black/35 px-3">
          <input type="range" min={question.min} max={question.max} value={value || "5"} onChange={(event) => onChange(event.target.value)} className="w-full accent-acid" />
          <span className="w-8 text-right text-acid">{value || "5"}</span>
        </div>
      )}
      {!["textarea", "select", "range"].includes(question.type) && (
        <input type={question.type === "currency" ? "number" : question.type} min={question.min} max={question.max} value={value} onChange={(event) => onChange(event.target.value)} placeholder={question.placeholder} className="field h-11 px-3 text-sm" />
      )}
    </label>
  );
}

function GroupSummaryPanel({ groupSummary }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/45 p-5">
      <h3 className="mb-4 text-lg font-semibold">Group Analysis</h3>
      <div className="grid gap-3 md:grid-cols-3">
        <Metric label="Group motivation" value={groupSummary.groupMotivation} />
        <Metric label="Group alignment" value={groupSummary.groupAlignment} />
        <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm text-zinc-400">Total investment</p>
          <p className="mt-2 text-2xl font-semibold text-acid">EUR {groupSummary.totalInvestment}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SummaryBlock title="Alignment Gaps" items={groupSummary.disagreements.length ? groupSummary.disagreements : ["No major disagreement detected yet."]} />
        <SummaryBlock title="Key Risks" items={groupSummary.keyRisks.length ? groupSummary.keyRisks : ["Complete more answers to generate risk signals."]} />
      </div>
    </div>
  );
}

function ThreePersonComparison({ groupSummary, respondents }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/45 p-5">
      <h3 className="mb-4 text-lg font-semibold">3-Person Comparison</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {groupSummary.perPerson.map((item, index) => (
          <div key={item.id} className="rounded-md border border-white/10 p-3">
            <p className="font-medium">{item.name}</p>
            <p className="mt-2 text-sm text-zinc-400">Motivation: {item.summary.motivationScore}/100</p>
            <p className="text-sm text-zinc-400">Alignment: {item.summary.alignmentScore}/100</p>
            <p className="mt-2 text-xs text-zinc-500">{respondents[index].answers.musicalDirection || "No musical direction entered."}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-semibold text-acid">{value}/100</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-acid" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SummaryBlock({ title, items }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <h4 className="mb-3 text-sm font-semibold text-zinc-100">{title}</h4>
      <ul className="space-y-2 text-sm text-zinc-400">
        {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
      </ul>
    </div>
  );
}

function SavedInterviews({ saved, loadInterview }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/45 p-5">
      <h3 className="mb-4 text-lg font-semibold">Saved 3-Person Interviews</h3>
      <div className="space-y-2">
        {saved.length === 0 && <p className="text-sm text-zinc-500">No saved interviews yet.</p>}
        {saved.map((interview) => (
          <button key={interview.id} onClick={() => loadInterview(interview)} className="block w-full rounded-md border border-white/10 p-3 text-left hover:bg-white/10">
            <p className="truncate text-sm font-medium">{interview.label}</p>
            <p className="text-xs text-zinc-500">{new Date(interview.updatedAt).toLocaleString()}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "interview";
}

function downloadUrl(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

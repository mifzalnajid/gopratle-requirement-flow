"use client";

import { useState, type FormEvent } from "react";

type Category = "planner" | "performer" | "crew";

type EventBasics = {
  eventName: string;
  eventType: string;
  dateMode: "single" | "range";
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  category: Category;
  roleType: string;
  audience: string;
  style: string;
  scope: string;
  requirements: string;
  budget: string;
  contactName: string;
  email: string;
  phone: string;


};

const initialValues: EventBasics = {
  eventName: "",
  eventType: "",
  dateMode: "single",
  startDate: "",
  endDate: "",
  location: "",
  venue: "",
  category: "planner",
  roleType: "",
  audience: "",
  style: "",
  scope: "",
  requirements: "",
  budget: "",
  contactName: "",
  email: "",
  phone: "",
};

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState<EventBasics>(initialValues);
  const [step, setStep] = useState(1);

  function updateField<K extends keyof EventBasics>(
    field: K,
    value: EventBasics[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < 4) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const details =
      form.category === "planner"
        ? {
          roleType: form.roleType,
          audience: form.audience,
          style: form.style,
          scope: form.scope,
          budget: form.budget,
          requirements: form.requirements,
        }
        : form.category === "performer"
          ? {
            performanceType: form.roleType,
            genre: form.style,
            performerCount: form.audience,
            duration: form.scope,
            budget: form.budget,
            requirements: form.requirements,
          }
          : {
            crewType: form.roleType,
            teamSize: form.audience,
            experience: form.style,
            shift: form.scope,
            budget: form.budget,
            requirements: form.requirements,
          };

    const payload = {
      event: {
        name: form.eventName,
        type: form.eventType,
        dateMode: form.dateMode,
        startDate: form.startDate,
        endDate: form.endDate || form.startDate,
        location: form.location,
        venue: form.venue,
      },
      category: form.category,
      details,
      contact: {
        name: form.contactName,
        email: form.email,
        phone: form.phone,
      },
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requirements`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save the requirement.");
      }

      alert(`Requirement saved. ID: ${result.requirement._id}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not reach the API.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }


  function continueFromCurrentStep() {
    const currentStep = document.querySelector(`[data-step="${step}"]`);
    const requiredFields =
      currentStep?.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
        "input[required], select[required]",
      ) ?? [];

    for (const field of requiredFields) {
      if (!field.reportValidity()) return;
    }
    setStep((current) => current + 1);
  }


  return (
    <main className="min-h-screen bg-stone-50 px-5 py-10 text-slate-800">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <a href="#" className="text-xl font-bold tracking-tight text-emerald-900">
            gopratle<span className="text-orange-500">.</span>
          </a>
        </header>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">

          {/* ------------------------------------------------------------------------------------------ */}
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Post a requirement · Step {step} of 4
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            {step === 1
              ? "Tell us about your event"
              : step === 2
                ? `Tell us about your ${form.category === "planner"
                  ? "planning"
                  : form.category === "performer"
                    ? "performance"
                    : "crew"
                } needs`
                : step === 3
                  ? "Budget and contact details"
                  : "Review your requirement"}
          </h1>

          <p className="mt-2 text-slate-500">
            {step === 1
              ? "Start with a few basics. You can add the finer details next."
              : step === 2
                ? "These details help us understand who you’re looking for."
                : "Set a budget and tell us how we can reach you."}
          </p>

          {/* ---------------------------------------------------------------------------------------------------- */}

          <form onSubmit={handleContinue} className="mt-8 space-y-6">
            {step === 1 && (
              <>
                {/* Keep all your existing Step 1 fields here */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Event name *</span>
                    <input
                      required
                      maxLength={120}
                      value={form.eventName}
                      onChange={(e) => updateField("eventName", e.target.value)}
                      placeholder="e.g. Summer Sounds Festival"
                      className="w-full rounded-lg border border-stone-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Event type *</span>
                    <select
                      required
                      value={form.eventType}
                      onChange={(e) => updateField("eventType", e.target.value)}
                      className="w-full rounded-lg border border-stone-300 bg-white px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Choose event type</option>
                      <option>Wedding</option>
                      <option>Corporate event</option>
                      <option>Festival</option>
                      <option>Concert or live show</option>
                      <option>Private party</option>
                      <option>Product launch</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium">When is it happening? *</legend>
                  <div className="mb-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateField("dateMode", "single")}
                      aria-pressed={form.dateMode === "single"}
                      className={`rounded-lg border px-4 py-2 text-sm ${form.dateMode === "single"
                        ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                        : "border-stone-300"
                        }`}
                    >
                      One day
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("dateMode", "range")}
                      aria-pressed={form.dateMode === "range"}
                      className={`rounded-lg border px-4 py-2 text-sm ${form.dateMode === "range"
                        ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                        : "border-stone-300"
                        }`}
                    >
                      Multiple days
                    </button>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">
                        {form.dateMode === "single" ? "Event date *" : "Start date *"}
                      </span>
                      <input
                        required
                        type="date"
                        value={form.startDate}
                        onChange={(e) => updateField("startDate", e.target.value)}
                        className="w-full rounded-lg border border-stone-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                      />
                    </label>

                    {form.dateMode === "range" && (
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium">End date *</span>
                        <input
                          required
                          type="date"
                          min={form.startDate || undefined}
                          value={form.endDate}
                          onChange={(e) => updateField("endDate", e.target.value)}
                          className="w-full rounded-lg border border-stone-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                        />
                      </label>
                    )}
                  </div>
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">City or location *</span>
                    <input
                      required
                      maxLength={120}
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full rounded-lg border border-stone-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">Venue (optional)</span>
                    <input
                      maxLength={160}
                      value={form.venue}
                      onChange={(e) => updateField("venue", e.target.value)}
                      placeholder="Venue name or address"
                      className="w-full rounded-lg border border-stone-300 px-3 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                </div>

                <fieldset>
                  <legend className="mb-3 text-sm font-medium">Who are you looking for? *</legend>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(
                      [
                        ["planner", "Event planner", "Plan the whole experience"],
                        ["performer", "Performer", "Bring the energy"],
                        ["crew", "Event crew", "Make it run smoothly"],
                      ] as const
                    ).map(([value, title, description]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateField("category", value)}
                        aria-pressed={form.category === value}
                        className={`rounded-xl border p-4 text-left transition ${form.category === value
                          ? "border-emerald-700 bg-emerald-50 ring-1 ring-emerald-700"
                          : "border-stone-300 hover:border-emerald-500"
                          }`}
                      >
                        <span className="block font-semibold">{title}</span>
                        <span className="mt-1 block text-xs text-slate-500">{description}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="flex justify-end border-t border-stone-100 pt-5">
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900"
                  >
                    Continue <span aria-hidden="true">→</span>
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <div data-step="2" className="space-y-5">
                {form.category === "planner" && (
                  <>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">
                        What planning help do you need? *
                      </span>
                      <select
                        required
                        value={form.roleType}
                        onChange={(e) => updateField("roleType", e.target.value)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-3"
                      >
                        <option value="">Choose one</option>
                        <option>Full event planning</option>
                        <option>Day-of coordination</option>
                        <option>Venue sourcing</option>
                        <option>Decor and styling</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">Expected guest count *</span>
                      <select
                        required
                        value={form.audience}
                        onChange={(e) => updateField("audience", e.target.value)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-3"
                      >
                        <option value="">Choose one</option>
                        <option>Under 50</option>
                        <option>50–100</option>
                        <option>100–250</option>
                        <option>250–500</option>
                        <option>500+</option>
                      </select>
                    </label>
                  </>
                )}

                {form.category === "performer" && (
                  <>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">
                        What kind of performer? *
                      </span>
                      <select
                        required
                        value={form.roleType}
                        onChange={(e) => updateField("roleType", e.target.value)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-3"
                      >
                        <option value="">Choose one</option>
                        <option>Live band</option>
                        <option>DJ</option>
                        <option>Singer or vocalist</option>
                        <option>Dancer</option>
                        <option>Host or MC</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">Music or performance style *</span>
                      <input
                        required
                        value={form.style}
                        onChange={(e) => updateField("style", e.target.value)}
                        placeholder="e.g. indie, Bollywood, classical"
                        className="w-full rounded-lg border border-stone-300 px-3 py-3"
                      />
                    </label>
                  </>
                )}

                {form.category === "crew" && (
                  <>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">What crew do you need? *</span>
                      <select
                        required
                        value={form.roleType}
                        onChange={(e) => updateField("roleType", e.target.value)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-3"
                      >
                        <option value="">Choose one</option>
                        <option>Photography or video</option>
                        <option>Sound and lighting</option>
                        <option>Stage crew</option>
                        <option>Security</option>
                        <option>Setup and production</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium">Team size *</span>
                      <select
                        required
                        value={form.audience}
                        onChange={(e) => updateField("audience", e.target.value)}
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-3"
                      >
                        <option value="">Choose one</option>
                        <option>1–2 people</option>
                        <option>3–5 people</option>
                        <option>6–10 people</option>
                        <option>10+ people</option>
                      </select>
                    </label>
                  </>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Anything else we should know?</span>
                  <textarea
                    rows={4}
                    value={form.requirements}
                    onChange={(e) => updateField("requirements", e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-3"
                  />
                </label>
              </div>
            )}


            {/* ---------------------------------------Step 3 --------------------------------------------- */}

            {step === 3 && (
              <div data-step="3" className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Budget range *</span>
                  <select
                    required
                    value={form.budget}
                    onChange={(e) => updateField("budget", e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-3"
                  >
                    <option value="">Choose a range</option>
                    <option>Under ₹25,000</option>
                    <option>₹25,000–₹50,000</option>
                    <option>₹50,000–₹1,00,000</option>
                    <option>₹1,00,000–₹2,50,000</option>
                    <option>₹2,50,000+</option>
                    <option>Let’s discuss</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Your name *</span>
                  <input
                    required
                    value={form.contactName}
                    onChange={(e) => updateField("contactName", e.target.value)}
                    placeholder="First and last name"
                    className="w-full rounded-lg border border-stone-300 px-3 py-3"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Email address *</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-stone-300 px-3 py-3"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Phone number *</span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-lg border border-stone-300 px-3 py-3"
                  />
                </label>
              </div>
            )}


            {/* ---------------------Step 4---------------------------------- */}

            {step === 4 && (
              <div className="space-y-5">
                <section className="rounded-xl border border-stone-200 p-5">
                  <div className="flex justify-between">
                    <h2 className="font-semibold">Event basics</h2>
                    <button type="button" onClick={() => setStep(1)} className="text-emerald-800">
                      Edit
                    </button>
                  </div>
                  <p className="mt-3">{form.eventName} · {form.eventType}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {form.dateMode === "range"
                      ? `${form.startDate} to ${form.endDate}`
                      : form.startDate}
                    {" · "}{form.location}
                    {form.venue && ` · ${form.venue}`}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Category: {form.category}</p>
                </section>

                <section className="rounded-xl border border-stone-200 p-5">
                  <div className="flex justify-between">
                    <h2 className="font-semibold">Your requirements</h2>
                    <button type="button" onClick={() => setStep(2)} className="text-emerald-800">
                      Edit
                    </button>
                  </div>
                  <p className="mt-3">Role: {form.roleType}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {form.audience && `Size: ${form.audience}`}
                    {form.style && ` · ${form.style}`}
                    {form.scope && ` · ${form.scope}`}
                  </p>
                  {form.requirements && <p className="mt-2">{form.requirements}</p>}
                </section>

                <section className="rounded-xl border border-stone-200 p-5">
                  <div className="flex justify-between">
                    <h2 className="font-semibold">Budget and contact</h2>
                    <button type="button" onClick={() => setStep(3)} className="text-emerald-800">
                      Edit
                    </button>
                  </div>
                  <p className="mt-3">Budget: {form.budget}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {form.contactName} · {form.email} · {form.phone}
                  </p>
                </section>

                <label className="flex items-start gap-2 text-sm text-slate-600">
                  <input required type="checkbox" className="mt-1" />
                  <span>I agree to be contacted about this requirement.</span>
                </label>
              </div>
            )}


            {step > 1 && (
              <div className="flex justify-between border-t border-stone-100 pt-5">
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="rounded-lg border border-stone-300 px-5 py-3 font-semibold"
                >
                  ← Back
                </button>

                <button
                  type={step === 4 ? "submit" : "button"}
                  onClick={step === 4 ? undefined : continueFromCurrentStep}
                  disabled={step === 4 && isSubmitting}
                  className="rounded-lg bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {step === 4
                    ? isSubmitting
                      ? "Posting…"
                      : "Submit requirement"
                    : "Continue"}{" "}
                  →
                </button>
              </div>
            )}


          </form>
        </section>
      </div>
    </main>
  );
}
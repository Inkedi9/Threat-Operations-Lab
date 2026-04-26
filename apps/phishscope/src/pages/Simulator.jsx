import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import InboxList from "../components/InboxList";
import EmailViewer from "../components/EmailViewer";
import AnalysisPanel from "../components/AnalysisPanel";
import ScoreSummary from "../components/ScoreSummary";
import { scenarios } from "../data/scenarios";
import { calculateEmailScore } from "../utils/scoring";
import { ArrowRight, RotateCcw, Send, MailCheck } from "lucide-react";
import { PhishLayout } from "@/components/ui/PhishLayout";
import { PhishPanel } from "@/components/ui/PhishPanel";
import { PhishHeader } from "@/components/ui/PhishHeader";
import { PhishBadge } from "@/components/ui/PhishBadge";
import { PhishButton } from "@/components/ui/PhishButton";
import { PhishProgress } from "@/components/ui/PhishProgress";

import { getIncidentParams } from "../lib/incidentParams";
import LinkedIncidentBanner from "../components/ecosystem/LinkedIncidentBanner";
import { getEcosystemIncidentById } from "../data/ecosystem/incidents";

export default function Simulator() {
    const navigate = useNavigate();
    const [selectedEmail, setSelectedEmail] = useState(scenarios[0]);
    const [verdict, setVerdict] = useState("");
    const [selectedFlags, setSelectedFlags] = useState([]);
    const [currentResult, setCurrentResult] = useState(null);
    const [results, setResults] = useState(() => {
        const stored = localStorage.getItem("phishscope-results");
        return stored ? JSON.parse(stored) : [];
    });

    const [confirmedSOCLink, setConfirmedSOCLink] = useState(null);

    const incidentParams = useMemo(() => getIncidentParams(), []);
    const linkedIndicator = incidentParams.domain || incidentParams.ioc;

    const incident = getEcosystemIncidentById(
        incidentParams.incidentId || "incident-001"
    );

    const completedIds = useMemo(() => results.map((r) => r.scenarioId), [results]);

    useEffect(() => {
        const matchedScenario = findScenarioFromIncidentContext(incidentParams);

        if (!matchedScenario) return;

        setSelectedEmail(matchedScenario);
        setVerdict("");
        setSelectedFlags([]);
        setCurrentResult(null);
    }, [incidentParams]);

    const isSimulationComplete = results.length === scenarios.length;

    const goToNextEmail = (currentEmailId) => {
        const currentIndex = scenarios.findIndex((email) => email.id === currentEmailId);
        const nextEmail = scenarios[currentIndex + 1];

        if (nextEmail) {
            setSelectedEmail(nextEmail);
            setVerdict("");
            setSelectedFlags([]);
            setCurrentResult(null);
        }
    };

    const handleSubmit = () => {
        if (!selectedEmail || !verdict) return;

        const alreadyDone = completedIds.includes(selectedEmail.id);
        if (alreadyDone) return;

        const scoreData = calculateEmailScore(selectedEmail, verdict, selectedFlags);

        const resultEntry = {
            scenarioId: selectedEmail.id,
            verdict,
            expectedType: selectedEmail.type,
            score: scoreData.score,
            isCorrect: scoreData.isCorrect,
            matchedFlags: scoreData.matchedFlags,
            missedFlags: scoreData.missedFlags,
        };

        const updatedResults = [...results, resultEntry];

        setCurrentResult(scoreData);
        setResults(updatedResults);
        localStorage.setItem("phishscope-results", JSON.stringify(updatedResults));

        const isLinkedIncidentPhish =
            selectedEmail?.linkedIncidentId === "incident-001" && verdict === "phishing";

        if (isLinkedIncidentPhish) {
            setConfirmedSOCLink(buildSOCLink());
            return;
        }

        setTimeout(() => {
            goToNextEmail(selectedEmail.id);
        }, 1800);
    };

    const handleSelect = (email) => {
        setSelectedEmail(email);
        setVerdict("");
        setSelectedFlags([]);
        setCurrentResult(null);
        setConfirmedSOCLink(null);
    };

    const handleRestartSession = () => {
        localStorage.removeItem("phishscope-results");
        setResults([]);
        setSelectedEmail(scenarios[0]);
        setVerdict("");
        setSelectedFlags([]);
        setCurrentResult(null);
        setConfirmedSOCLink(null);
    };

    useEffect(() => {
        if (isSimulationComplete) {
            const timer = setTimeout(() => {
                navigate("/results");
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [isSimulationComplete, navigate]);

    function findScenarioFromIncidentContext({ incidentId, domain, ioc }) {
        if (incidentId) {
            const incidentMatch = scenarios.find(
                (scenario) => scenario.linkedIncidentId === incidentId
            );

            if (incidentMatch) return incidentMatch;
        }

        const linkedIndicator = domain || ioc;
        if (!linkedIndicator) return null;

        const normalizedIndicator = linkedIndicator.toLowerCase();

        return scenarios.find((scenario) => {
            const searchable = [
                scenario.category,
                scenario.subject,
                scenario.senderName,
                scenario.senderEmail,
                scenario.linkUrl,
                scenario.body,
                scenario.preview,
                scenario.linkedIncidentId,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchable.includes(normalizedIndicator);
        });
    }

    function buildSOCLink() {
        const params = new URLSearchParams({
            incident: incidentParams.incidentId || "incident-001",
            user: "j.smith",
            ip: "185.77.44.21",
            technique: "T1566",
            phishResult: "confirmed",
            domain: linkedIndicator || "secure-login-support.com",
            returnTo: "https://phishscope.vercel.app/simulator",
        });

        return `https://soc-simulator-kappa.vercel.app/?${params.toString()}`;
    }

    return (
        <>
            <Header />

            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
            >
                <PhishLayout>
                    <PhishHeader
                        eyebrow="Email Threat Lab"
                        title="Phishing Simulator"
                        description="Analyze suspicious emails, identify red flags and classify human-layer threats with analyst-grade feedback."
                    >
                        <PhishBadge tone="teal">{results.length}/{scenarios.length} analyzed</PhishBadge>
                        <PhishBadge tone={isSimulationComplete ? "green" : "slate"}>
                            {isSimulationComplete ? "Complete" : "In Progress"}
                        </PhishBadge>
                        <PhishBadge tone="amber">
                            {scenarios.length - results.length} Remaining
                        </PhishBadge>
                    </PhishHeader>

                    <div className="mt-6 space-y-4">
                        <PhishPanel variant="card">
                            <PhishProgress current={results.length} value={results.length} max={scenarios.length} />
                        </PhishPanel>

                        <div className="mb-4 rounded-xl border border-teal-400/20 bg-teal-400/10 p-4 text-sm text-teal-200">
                            Active Incident: {incident.title} ({incident.context.domain})
                        </div>

                        <LinkedIncidentBanner
                            incidentId={incidentParams.incidentId}
                            title="Linked Phishing Investigation"
                            context={`Imported context from Purple Team Lab: ${linkedIndicator ? linkedIndicator : "no phishing indicator provided"
                                }`}
                            returnTo={incidentParams.returnTo}
                        />

                        <div className="grid gap-6 xl:grid-cols-[340px_1fr_380px]">
                            <div className="space-y-4">
                                <PhishPanel variant="card">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.22em] text-teal-300">
                                                Inbox Queue
                                            </p>
                                            <h2 className="mt-2 text-xl font-black text-white">
                                                Email Samples
                                            </h2>
                                        </div>

                                        <PhishBadge tone="slate">{scenarios.length} total</PhishBadge>
                                    </div>

                                    <InboxList
                                        emails={scenarios}
                                        selectedEmail={selectedEmail}
                                        onSelect={handleSelect}
                                        completedIds={completedIds}
                                    />
                                </PhishPanel>
                            </div>

                            <div className="min-w-0 space-y-4">
                                <PhishPanel variant="card">
                                    <EmailViewer email={selectedEmail} />
                                </PhishPanel>

                                {completedIds.includes(selectedEmail?.id) && !currentResult && (
                                    <PhishPanel variant="success">
                                        <p className="text-sm text-slate-200">
                                            This email has already been analyzed in the current session.
                                        </p>
                                    </PhishPanel>
                                )}

                                <ScoreSummary result={currentResult} email={selectedEmail} />

                                {confirmedSOCLink && (
                                    <PhishPanel variant="glow">
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-xl border border-teal-400/25 bg-teal-400/10 p-3 text-teal-300">
                                                <Send className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    Phishing confirmed for incident-001
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                                    Send this confirmed phishing result into SOC Command Center
                                                    for correlated alert triage.
                                                </p>

                                                <a
                                                    href={confirmedSOCLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-4 inline-flex rounded-xl border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200 transition hover:bg-teal-400/20"
                                                >
                                                    Open SOC with confirmed phishing
                                                </a>
                                            </div>
                                        </div>
                                    </PhishPanel>
                                )}

                                <div className="flex justify-end">
                                    <PhishButton
                                        tone="slate"
                                        onClick={() => goToNextEmail(selectedEmail?.id)}
                                        disabled={
                                            !selectedEmail ||
                                            scenarios[scenarios.length - 1]?.id === selectedEmail?.id
                                        }
                                        className="disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next Email
                                        <ArrowRight className="h-4 w-4" />
                                    </PhishButton>
                                </div>
                            </div>

                            <div className="space-y-4 xl:sticky xl:top-6 self-start">
                                <PhishPanel variant="card">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-xl border border-teal-400/25 bg-teal-400/10 p-3 text-teal-300">
                                            <MailCheck className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-[0.22em] text-teal-300">
                                                Analysis Panel
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                Classify the email and validate red flags.
                                            </p>
                                        </div>
                                    </div>

                                    <AnalysisPanel
                                        verdict={verdict}
                                        setVerdict={setVerdict}
                                        selectedFlags={selectedFlags}
                                        setSelectedFlags={setSelectedFlags}
                                        onSubmit={handleSubmit}
                                        disabled={completedIds.includes(selectedEmail?.id)}
                                    />
                                </PhishPanel>
                            </div>
                        </div>

                        {isSimulationComplete && (
                            <PhishPanel variant="success">
                                <h2 className="text-xl font-bold text-emerald-300">
                                    Simulation Complete
                                </h2>
                                <p className="mt-2 text-sm leading-7 text-slate-200">
                                    All emails have been analyzed. Redirecting to your results dashboard...
                                </p>
                            </PhishPanel>
                        )}

                        <div className="flex flex-col items-end gap-3">
                            {results.length === 0 && (
                                <p className="text-sm text-slate-400">
                                    Analyze at least one email to unlock results.
                                </p>
                            )}

                            <div className="flex flex-wrap justify-end gap-3">
                                <PhishButton tone="slate" onClick={handleRestartSession}>
                                    <RotateCcw className="h-4 w-4" />
                                    Restart Session
                                </PhishButton>

                                {results.length === 0 ? (
                                    <PhishButton tone="slate" disabled className="cursor-not-allowed opacity-50">
                                        View Results
                                    </PhishButton>
                                ) : (
                                    <Link to="/results">
                                        <PhishButton tone="solid">
                                            View Results
                                            <ArrowRight className="h-4 w-4" />
                                        </PhishButton>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </PhishLayout>
            </motion.div>
        </>
    );
}
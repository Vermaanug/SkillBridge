import { useState } from "react";
import { HeroGraph } from "./components/HeroGraph";
import { EntityPicker } from "./components/EntityPicker";
import { MatchCard } from "./components/MatchCard";
import { LoadingState, EmptyState, ErrorState } from "./components/StateViews";
import usePeople from "./services/usePeople";
import useJobs from "./services/useJobs";
import usePersonMatches from "./services/usePersonMatches";
import useJobCandidates from "./services/useJobCandidates";

type Mode = "fromPerson" | "fromJob";


export default function App() {
  const [mode, setMode] = useState<Mode>("fromPerson");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);


  const {
    services: { getPeopleService },
  } = usePeople();

  const {
    services: { getJobsService },
  } = useJobs();

  const {
    services: { getPersonMatchesService },
  } = usePersonMatches(selectedPersonId, {
    enabled: mode === "fromPerson",
  });

  const {
    services: { getJobCandidatesService },
  } = useJobCandidates(selectedJobId, {
    enabled: mode === "fromJob",
  });


  const people = getPeopleService.data ?? [];
  const jobs = getJobsService.data ?? [];

  const selectedPerson = people.find((p) => p.id === selectedPersonId);
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const directoryLoading =
    getPeopleService.isLoading || getJobsService.isLoading;

  const directoryError =
    getPeopleService.error || getJobsService.error;

  const resultsLoading =
    mode === "fromPerson"
      ? getPersonMatchesService.isLoading
      : getJobCandidatesService.isLoading;

  const resultsError =
    mode === "fromPerson"
      ? getPersonMatchesService.error
      : getJobCandidatesService.error;

  const jobMatches = getPersonMatchesService.data ?? [];
  const candidateMatches = getJobCandidatesService.data ?? [];


  return (
    <div className="min-h-screen bg-graphite-900">
      <header className="border-b border-graphite-700">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <p className="font-mono text-xs uppercase tracking-widest text-teal-400">
              SkillBridge
            </p>

            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-graphite-100">
              Skills don't map to jobs in a straight line.
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-graphite-400">
              A person's known skills reach further than their resume shows — into
              adjacent skills, and from there into roles that never explicitly ask
              for what they have. SkillBridge walks that graph so the connection
              doesn't get lost in a keyword search.
            </p>
          </div>

          <HeroGraph />
        </div>
      </header>


      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 inline-flex rounded-xl border border-graphite-600 bg-graphite-800 p-1">
          <button
            onClick={() => setMode("fromPerson")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "fromPerson"
                ? "bg-amber-400 text-graphite-950"
                : "text-graphite-400 hover:text-graphite-100"
            }`}
          >
            Find jobs for a person
          </button>

          <button
            onClick={() => setMode("fromJob")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === "fromJob"
                ? "bg-amber-400 text-graphite-950"
                : "text-graphite-400 hover:text-graphite-100"
            }`}
          >
            Find candidates for a job
          </button>
        </div>


        {directoryLoading && (
          <LoadingState label="Loading the graph" />
        )}

        {directoryError && (
          <ErrorState
            message={
              directoryError instanceof Error
                ? directoryError.message
                : "Unexpected error."
            }
            onRetry={() => {
              getPeopleService.refetch();
              getJobsService.refetch();
            }}
          />
        )}


        {!directoryLoading && !directoryError && (
          <>
            <section className="mb-8">
              <h2 className="mb-3 font-display text-sm font-medium text-graphite-400">
                {mode === "fromPerson" ? "Choose a person" : "Choose a job"}
              </h2>

              {mode === "fromPerson" ? (
                <EntityPicker
                  items={people.map((p) => ({
                    id: p.id,
                    title: p.name,
                    subtitle: p.headline,
                  }))}
                  selectedId={selectedPersonId}
                  onSelect={setSelectedPersonId}
                />
              ) : (
                <EntityPicker
                  items={jobs.map((j) => ({
                    id: j.id,
                    title: j.title,
                    subtitle: `${j.company} · ${j.location}`,
                  }))}
                  selectedId={selectedJobId}
                  onSelect={setSelectedJobId}
                />
              )}
            </section>


            <section>
              <h2 className="mb-3 font-display text-sm font-medium text-graphite-400">
                {mode === "fromPerson"
                  ? `Roles closest to ${selectedPerson?.name ?? "…"}`
                  : `Candidates closest to ${selectedJob?.title ?? "…"}`}
              </h2>


              {resultsLoading && (
                <LoadingState label="Walking the skill graph" />
              )}

              {resultsError && (
                <ErrorState
                  message={
                    resultsError instanceof Error
                      ? resultsError.message
                      : "Unexpected error."
                  }
                />
              )}


              {!resultsLoading && !resultsError && mode === "fromPerson" && (
                jobMatches.length === 0 ? (
                  <EmptyState
                    title="No reachable roles yet"
                    hint="This person's skills don't connect — even indirectly — to any seeded job."
                  />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {jobMatches.map((m) => (
                      <MatchCard
                        key={m.jobId}
                        title={m.title}
                        subtitle={`${m.company} · ${m.location}`}
                        matchPercent={m.matchPercent}
                        matchedSkills={m.matchedSkills}
                        missingSkills={m.missingSkills}
                      />
                    ))}
                  </div>
                )
              )}


              {!resultsLoading && !resultsError && mode === "fromJob" && (
                candidateMatches.length === 0 ? (
                  <EmptyState
                    title="No reachable candidates yet"
                    hint="No seeded person's skills connect — even indirectly — to this job's requirements."
                  />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {candidateMatches.map((c) => (
                      <MatchCard
                        key={c.personId}
                        title={c.name}
                        subtitle={c.headline}
                        matchPercent={c.matchPercent}
                        matchedSkills={c.matchedSkills}
                        missingSkills={c.missingSkills}
                      />
                    ))}
                  </div>
                )
              )}
            </section>
          </>
        )}
      </main>


      <footer className="border-t border-graphite-700 py-8 text-center text-xs text-graphite-400">
        Built on CognoDB — an openCypher graph database — via the Neo4j driver.
      </footer>
    </div>
  );
}
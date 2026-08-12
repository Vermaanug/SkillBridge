import { SkillPill } from "./SkillPill";

interface MatchCardProps {
  title: string;
  subtitle: string;
  matchPercent: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export function MatchCard({ title, subtitle, matchPercent, matchedSkills, missingSkills }: MatchCardProps) {
  return (
    <div className="rounded-xl border border-graphite-600 bg-graphite-800 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-medium text-graphite-100">{title}</h3>
          <p className="text-sm text-graphite-400">{subtitle}</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-medium text-amber-400">{matchPercent}%</div>
          <div className="text-[11px] uppercase tracking-wide text-graphite-400">match</div>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-graphite-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-400"
          style={{ width: `${matchPercent}%` }}
        />
      </div>

      {(matchedSkills.length > 0 || missingSkills.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {matchedSkills.map((s) => (
            <SkillPill key={s} label={s} variant="matched" />
          ))}
          {missingSkills.map((s) => (
            <SkillPill key={s} label={s} variant="missing" />
          ))}
        </div>
      )}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../config/constant/QUERY_KEYS";
import { handleGlobalGetRequestQuery } from "../config/globalApiFunction";
import URLS from "../config/constant/URLS";

interface CandidateMatch {
  personId: string;
  name: string;
  headline: string;
  matchedSkills: string[];
  missingSkills: string[];
  matchPercent: number;
}


const useJobCandidates = (
  jobId: string | null,
  { enabled = true } = {},
) => {
  const getJobCandidatesService = useQuery({
    queryKey: [QUERY_KEYS.JOB_CANDIDATES, jobId],
    queryFn: ({ signal }) =>
      handleGlobalGetRequestQuery<CandidateMatch[]>({
        url: URLS.JOB_CANDIDATES(jobId!),
        signal,
      }),
    enabled: enabled && !!jobId,
  });

  return {
    services: { getJobCandidatesService },
  };
};

export default useJobCandidates;
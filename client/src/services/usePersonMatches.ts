
import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../config/constant/QUERY_KEYS";
import { handleGlobalGetRequestQuery } from "../config/globalApiFunction";
import URLS from "../config/constant/URLS";

interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  location: string;
  matchedSkills: string[];
  missingSkills: string[];
  matchPercent: number;
}

const usePersonMatches = (
  personId: string | null,
  { enabled = true } = {},
) => {
  const getPersonMatchesService = useQuery({
    queryKey: [QUERY_KEYS.PERSON_MATCHES, personId],
    queryFn: ({ signal }) =>
      handleGlobalGetRequestQuery<JobMatch[]>({
        url: URLS.PERSON_MATCHES(personId!),
        signal,
      }),
    enabled: enabled && !!personId,
  });

  return {
    services: { getPersonMatchesService },
  };
};

export default usePersonMatches;

import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../config/constant/QUERY_KEYS";
import { handleGlobalGetRequestQuery } from "../config/globalApiFunction";
import URLS from "../config/constant/URLS";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
}

const useJobs = ({ enabled = true } = {}) => {
  const getJobsService = useQuery({
    queryKey: [QUERY_KEYS.JOBS],
    queryFn: ({ signal }) =>
      handleGlobalGetRequestQuery<Job[]>({
        url: URLS.JOBS,
        signal,
      }),
    enabled,
  });

  return {
    services: { getJobsService },
  };
};

export default useJobs;
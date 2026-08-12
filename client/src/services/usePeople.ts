import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../config/constant/QUERY_KEYS";
import { handleGlobalGetRequestQuery } from "../config/globalApiFunction";
import URLS from "../config/constant/URLS";

interface Person {
  id: string;
  name: string;
  headline: string;
}

const usePeople = ({ enabled = true } = {}) => {
  const getPeopleService = useQuery({
    queryKey: [QUERY_KEYS.PEOPLE],
    queryFn: ({ signal }) =>
      handleGlobalGetRequestQuery<Person[]>({
        url: URLS.PEOPLE,
        signal,
      }),
    enabled,
  });

  return {
    services: { getPeopleService },
  };
};

export default usePeople;
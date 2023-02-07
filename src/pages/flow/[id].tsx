import type { UserData } from "@prisma/client";
import { useRouter } from "next/router";
import Flow from "../../components/Flow";
import { api } from "../../utils/api";

const FlowPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.flow.getSingleFlow.useQuery(id as string);
  console.log(data);
  return <Flow dataInit={data as UserData} />;
  // return <div>Hi</div>;
};

export default FlowPage;

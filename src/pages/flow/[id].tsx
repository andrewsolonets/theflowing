/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { UserData } from "@prisma/client";
import { useRouter } from "next/router";
import Flow from "../../components/Flow";
import { useMainCtx } from "../../context/MainCtx";
import { api } from "../../utils/api";

const FlowPage = () => {
  const router = useRouter();
  const { localData } = useMainCtx();
  const { id } = router.query;

  const { data } = api.flow.getSingleFlow.useQuery(id as string);
  const localItem = localData.filter((el) => el.id === id);

  console.log(data, localItem);
  return (
    <Flow
      dataInit={data ? data : localItem ? (localItem[0] as UserData) : null}
    />
  );
  // return <div>Hi</div>;
};

export default FlowPage;

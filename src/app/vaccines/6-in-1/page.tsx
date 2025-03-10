import type { Metadata } from "next";
import BackLink from "@src/app/_components/nhs-frontend/BackLink";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "6-in-1 vaccine",
};

const Vaccine6in1 = async () => {
  return (
    <div>
      <BackLink link="/schedule" />
      <h1 className="app-dynamic-page-title__heading">
        {metadata.title as string}
      </h1>
    </div>
  );
};

export default Vaccine6in1;

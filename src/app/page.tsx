import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vaccinations hub",
};

const VaccinationsHub = () => {
  return (
    <div>
      <h1>{metadata.title as string}</h1>
      <a href="/schedule">(placeholder) View all vaccinations</a>
    </div>
  );
};

export default VaccinationsHub;

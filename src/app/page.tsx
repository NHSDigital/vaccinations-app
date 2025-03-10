import CardLink from "@src/app/_components/nhs/cardLink";
import type { Metadata } from "next";

const cardTitles = [
  { id: 1, title: "Get vaccinated" },
  { id: 2, title: "Your vaccination record" },
];

export const metadata: Metadata = {
  title: "Vaccinations",
};

const Home = () => {
  return (
    <div>
      <h1>Vaccinations</h1>
      <p>
        It&#39;s important that vaccines are given on time for the best
        protection, but if you or your child missed a vaccine, contact your GP
        to catch up.
      </p>

      {cardTitles.map((cardTitle) => (
        <CardLink
          key={cardTitle.id}
          title={cardTitle.title}
          link={"#"}
        ></CardLink>
      ))}
      <p>
        Vaccinations are one of the most effective ways to save lives and
        improve health, second only to clean water
      </p>
    </div>
  );
};

export default Home;

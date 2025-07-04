"use client";

import { useRouter } from "next/navigation";

const BackLink = () => {
  const router = useRouter();

  return (
    <div className="nhsuk-back-link">
      <a href="#" onClick={() => router.back()} className="nhsuk-back-link__link">
        <svg
          className="nhsuk-icon nhsuk-icon__chevron-left"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          height="24"
          width="24"
        >
          <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
        </svg>
        Back
      </a>
    </div>
  );
};

export default BackLink;

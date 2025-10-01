type PageCopy = Record<string, string>;
export type UserCopy = Record<string, PageCopy>;

export const elidCopyThatDiffersByEnvironment: Record<string, UserCopy> = {
  ["sandpit"]: {
    user15: {
      bulletPoint2: "did not turn 80 between 2nd September 2024 and 31st August 2025",
      infoTextHeading: "If you think you need this vaccine",
      infoTextParagraph: "Speak to your healthcare professional if you think you should be offered this vaccination.",
    },
    user01: {
      bulletPoint1: "are aged 75 to 79",
    },
    user13: {
      cardParagraphText: "We believe you had the RSV vaccination on 3 April 2025.",
    },
  },
  ["integration"]: {
    user15: {
      bulletPoint2: "did not turn 80 after 1 September 2024",
      infoTextHeading: "If this applies to you",
      infoTextParagraph: "Speak to your healthcare professional if you think you should be offered this vaccine.",
    },
    user01: {
      bulletPoint1: "are aged between 75 and 79",
    },
    user13: {
      cardParagraphText: "We believe you were vaccinated against RSV on 3 April 2025.",
    },
  },
};

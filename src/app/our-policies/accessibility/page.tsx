"use client";

import BackLink from "@src/app/_components/nhs-frontend/BackLink";
import MainContent from "@src/app/_components/nhs-frontend/MainContent";
import { NHS_TITLE_SUFFIX, SERVICE_HEADING } from "@src/app/constants";
import React from "react";

const AccessibilityStatement = () => {
  return (
    <>
      <title>{`Accessibility statement - ${SERVICE_HEADING} - ${NHS_TITLE_SUFFIX}`}</title>

      <BackLink />
      <MainContent>
        <h1>Accessibility statement</h1>
        <p>This accessibility statement applies to the Check and book an RSV vaccination service.</p>
        <p>We want as many people as possible to be able to use this service. This means you should be able to:</p>
        <ul>
          <li>change colours, contrast levels and fonts using browser functionality</li>
          <li>zoom in up to 400 per cent without the text spilling off the screen</li>
          <li>navigate most of the website using just a keyboard</li>
          <li>navigate most of the website using speech recognition software</li>
          <li>
            interact with most of the website using a screen reader (including recent versions of JAWS, NVDA and
            VoiceOver)
          </li>
        </ul>
        <p>We also try to make the content as simple as possible to understand.</p>
        <p>
          If you have a disability,{" "}
          <a href="https://mcmw.abilitynet.org.uk/" target={"_blank"}>
            search AbilityNet for &#34;how to&#34; guides
          </a>{" "}
          to make your device easier to use.
        </p>
        <h2>How accessible this website is</h2>
        <p>TBD</p>

        <h2>Feedback and contact information</h2>
        <p>
          If you have an accessibility query you can{" "}
          <a href="#" target={"_blank"}>
            give feedback about the NHS website
          </a>
          , including:
        </p>
        <ul>
          <li>if you have any problems accessing information or using this website</li>
          <li>if you have any positive feedback about this website&#39;s accessibility</li>
        </ul>
        <p>We aim to respond in 5 working days.</p>
        <h3>Alternative formats</h3>
        <p>We&#39;ve designed our content to be as accessible as possible.</p>
        <p>
          If you need information on this website in a different format, like accessible PDF, large print, easy read,
          audio recording or Braille, please{" "}
          <a href="#" target={"_blank"}>
            give feedback about this service
          </a>
          .
        </p>
        <p>We&#39;ll consider your request and get back to you in 10 working days.</p>
        <h3>Reporting accessibility problems with this website</h3>
        <p>
          We&#39;re always looking to improve the accessibility of this website. If you find any problems not listed on
          this page or think we&#39;re not meeting accessibility requirements, please{" "}
          <a href="#" target={"_blank"}>
            give feedback about this service
          </a>
          . This helps us improve.
        </p>
        <h2>Enforcement procedure</h2>
        <p>
          If you contact us with a complaint and you are not happy with our response,{" "}
          <a href="https://www.equalityadvisoryservice.com/" target={"_blank"}>
            contact the Equality Advisory and Support Service (EASS)
          </a>
          .
        </p>
        <p>
          The Equality and Human Rights Commission (EHRC) is responsible for enforcing the{" "}
          <a href="https://www.legislation.gov.uk/uksi/2018/952/contents/made" target={"_blank"}>
            Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 on
            legislation.gov.uk
          </a>{" "}
          (the &#34;accessibility regulations&#34;).
        </p>
        <h2>Technical information about this website&#39;s accessibility</h2>
        <p>We&#39;re committed to making this website accessible, in accordance with the accessibility regulations.</p>
        <h3>Compliance status</h3>
        <p>
          TBD
          <br />
          This website is partially compliant with the{" "}
          <a href="https://www.w3.org/TR/WCAG22/" target={"_blank"}>
            Web Content Accessibility Guidelines (WCAG) version 2.2
          </a>{" "}
          AA standard, due to the non-compliances listed below.
        </p>
        <h2>Non-accessible content</h2>
        <p>
          The content that is not accessible is listed below together with an explanation and reference to the relevant
          WCAG section.
        </p>
        <h3>Non-compliance with the accessibility regulations</h3>
        <h4>Forms</h4>
        <h5>Service search (newer templates)</h5>
        <ul>
          <li>
            Help and error information is not announced automatically to screen readers (Info and relationships 1.3.1)
          </li>
          <li>Form labels are missing or broken (Info and relationships 1.3.1)</li>
          <li>
            Some messages are not automatically announced to users of assistive technology (Error identification 3.3.1)
          </li>
          <li>The search placeholder text is low contrast (Contrast (minimum) 1.4.3)</li>
        </ul>
        <h5>Podcasts</h5>
        <ul>
          <li>
            A text alternative (transcript) for audio-only content has not been provided for podcast content (Audio only
            1.2.1)
          </li>
        </ul>
        <h4>PDFs</h4>
        <ul>
          <li>
            The structure of the content is not always available to assistive technology, which makes the content
            difficult to understand and navigate for users of screen readers (Info and relationships 1.3.1)
          </li>
          <li>
            The reading order of the content is not always logical, which means some content does not make sense when
            read out by text-to-speech software (Meaningful sequence 1.3.2)
          </li>
          <li>
            Images do not always have text alternatives, which means some content is not available when using
            text-to-speech software (Text alternatives 1.1.1)
          </li>
        </ul>
        <h4>3rd-party tools and systems</h4>
        <p>There are several issues relating to the Qualtrics survey component. These include:</p>
        <ul>
          <li>
            Users require a specific sensory ability to interact with content. This fails under 1.3.3 Sensory
            Characteristics (Level A).
          </li>
          <li>
            When text properties are set by the user, there is no change in the appearance of text. This fails under
            1.4.12 Text Spacing (Level AA).
          </li>
        </ul>
        <p>
          The Qualtrics component is a third-party component. We have reported the issues and asked for updates.
          Qualtrics is expected to fix them at some point, but currently a specific date has not been provided.
        </p>
        <p>Some further issues relate to the Microsoft Azure B2C Login system. These include:</p>
        <ul>
          <li>
            Autocomplete attribute is missing or inactive on some fields. This fails under 1.3.1 Info and Relationships
            (Level A) and 1.5.3 Identify Input Purpose (Level AA).
          </li>
          <li>
            Error messages are not associated with form fields. This fails under 3.3.1 Error Identification (Level A);
            3.3.3 Error Suggestion (Level AA); and 4.1.3 Status Messages (Level AA).
          </li>
          <li>Positive tab index integer used on a component. This fails under 2.4.3 Focus Order (Level A).</li>
        </ul>
        <p>
          Tickets for these issues have been raised with Microsoft. Discussions are ongoing to resolve these issues.
        </p>
        <h4>
          <strong>Profile Manager</strong>
        </h4>
        <ul>
          <li>
            The same heading is duplicated at heading level 1 (H1) and heading level 2 (H2). This fails 1.3.1 Info and
            Relationships (Level A) and 2.4.6 Headings and Labels (Level AA).
          </li>
          <li>
            Error messages are not associated with the relevant form field. This fails under 3.3.1 Error Identification
            (Level A).
          </li>
          <li>
            Users cannot extend their session and are automatically logged out after 15 minutes. This fails under 2.2.1
            Timing Adjustable (Level A).
          </li>
        </ul>
        <h4>Content visibility</h4>
        <ul>
          <li>
            Low contrast focus indication style on: links, buttons, form fields, and search components (Non-text
            contrast 1.4.11)
          </li>
        </ul>
        <h4>Screen readers</h4>
        <ul>
          <li>
            Inaccessible HTML such as empty ARIA (accessible rich internet applications) landmarks, incorrect or broken
            instances of the ARIA attributes and empty lists or lists with 1 item (Info and relationships 1.3.1)
          </li>
          <li>Form labels are missing or broken (Info and relationships 1.3.1)</li>
          <li>Anchor tags contain empty content (Meaningful sequence 1.3.2)</li>
        </ul>
        <h3>Content that&#39;s not within the scope of the accessibility regulations</h3>
        <h4>PDFs and other documents</h4>
        <p>
          Many of our older PDFs do not meet accessibility standards. The accessibility regulations do not require us to
          fix PDFs or other documents published before 23 September 2018 if they&#39;re not essential to providing our
          services. We do have plans to remove or replace some of the PDFs with more accessible content alternatives.
          Wherever possible, we avoid PDFs. Instead, we create content as structured web pages in HTML
        </p>
        <h4>Videos</h4>
        <p>
          All video published after 23 September 2020 meets WCAG AA standard, which includes captions, transcripts, and
          audio descriptions. As part of our ongoing transformation work, we are continuously improving older videos to
          meet the same standard.
        </p>
        <h2>What we&#39;re doing to improve accessibility</h2>
        <p>
          We have published tools and guidance on accessibility in the{" "}
          <a href="https://service-manual.nhs.uk/" target={"_blank"}>
            NHS digital service manual
          </a>{" "}
          based on extensive testing. The service manual helps our teams build products and services to meet the same
          accessibility standards.
        </p>
        <p>
          At NHS England, creating an accessible service is a team effort. We want our teams to make accessible services
          by:
        </p>
        <ul>
          <li>considering accessibility at the start of their project, and throughout</li>
          <li>making accessibility the whole team&#39;s responsibility</li>
          <li>researching with disabled users</li>
          <li>using a library of accessible components and patterns</li>
          <li>carrying out regular accessibility audits and testing</li>
          <li>designing and building to level AA of WCAG 2.2 – which is NHS England policy</li>
        </ul>
        <p>
          As part of this commitment, we have set up a cross-functional accessibility working group to make sure that
          accessibility remains at the core of everything we do.
        </p>
        <p>
          We are making sure that accessibility issues highlighted in this statement are being prioritised and fixed.
          Measures include:
        </p>
        <ul>
          <li>all videos to be made AA standard when they are reviewed after 23 September 2020</li>
          <li>
            continued accessibility fixes to the NHS website video player to make sure it adheres to WCAG AA standard.
          </li>
          <li>a principle to move away from new content being produced in PDF</li>
          <li>plans to remove or replace older PDFs with more accessible content</li>
          <li>ongoing improvements to the NHS design system with a focus on accessibility</li>
          <li>prioritising accessibility remedial work in all new development and improvement projects</li>
          <li>working with suppliers to improve the accessibility of their products</li>
        </ul>
        <h2>Preparation of this accessibility statement</h2>
        <p>This statement was updated in May 2025.</p>
        <p>TBD</p>
      </MainContent>
    </>
  );
};

export default AccessibilityStatement;

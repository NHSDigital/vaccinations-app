import { NHS_LOGIN_PROVIDER_ID } from "@src/app/api/auth/[...nextauth]/provider";

interface CreateAuditEventPayload {
  eventId: AuditEventId;
  eventTypeCode: AuditEventTypeCode;
  eventTypeDisplay: AuditEventTypeDisplay;
  eventSubTypeCode: AuditEventSubTypeCode;
  eventSubTypeDisplay: AuditEventSubTypeDisplay;
  eventAction: AuditEventAction;
  nhsNumber: AuditEventNHSNumber;
  eventTraceId: AuditEventTraceId;
  eventProductId: AuditEventProductIdentifier;
  eventInteractionId: AuditEventInteractionIdentifier;
}

const _createAuditEvent = ({
  eventId,
  eventTypeCode,
  eventTypeDisplay,
  eventSubTypeCode,
  eventSubTypeDisplay,
  eventAction,
  nhsNumber,
  eventTraceId,
  eventProductId,
  eventInteractionId,
}: CreateAuditEventPayload): AuditEvent => {
  return {
    resourceType: "AuditEvent",
    id: eventId,
    type: {
      system: "http://dicom.nema.org/resources/ontology/DCM",
      code: eventTypeCode,
      display: eventTypeDisplay,
    },
    subtype: [
      {
        system: "http://dicom.nema.org/resources/ontology/DCM",
        code: eventSubTypeCode,
        display: eventSubTypeDisplay,
      },
    ],
    action: eventAction,
    recorded: new Date().toISOString(),
    agent: [
      {
        who: {
          type: "Organization",
          identifier: {
            system: "https://fhir.nhs.uk/Id/ods-organization-code",
            value: "X26",
          },
          display: "NHS App",
        },
        requestor: false,
      },
      {
        who: {
          type: "Patient",
          identifier: {
            system: "https://fhir.nhs.uk/Id/nhs-number",
            value: nhsNumber,
          },
        },
        requestor: true,
      },
    ],
    source: {
      site: "https://vaccinations.nhs.uk/",
      observer: {
        identifier: {
          system: "https://fhir.nhs.uk/Id/accredited-system",
          value: "MyVaccines",
        },
        display: "My Vaccines App",
      },
      type: [
        {
          system: "http://terminology.hl7.org/CodeSystem/security-source-type",
          code: "4",
        },
      ],
    },
    entity: [
      {
        what: {
          identifier: {
            system: "https://fhir.nhs.uk/Id/nhs-number",
            value: nhsNumber,
          },
        },
        type: {
          system: "http://terminology.hl7.org/CodeSystem/audit-entity-type",
          code: "1",
          display: "Person",
        },
        role: {
          system: "http://terminology.hl7.org/CodeSystem/object-role",
          code: "1",
          display: "Patient",
        },
      },
      {
        what: {
          identifier: {
            system: "https://fhir.nhs.uk/Id/transaction",
            value: eventTraceId,
          },
        },
        type: {
          system: "https://profiles.ihe.net/ITI/BALP/CodeSystem/BasicAuditEntityType",
          code: "XrequestId",
        },
      },
      {
        what: {
          identifier: {
            system: "https://fhir.nhs.uk/Id/accredited-system",
            value: "MyVaccines",
          },
        },
        type: {
          system: "http://hl7.org/fhir/resource-types",
          code: "Endpoint",
        },
        role: {
          system: "http://terminology.hl7.org/CodeSystem/object-role",
          code: "17",
          display: "Data Repository",
        },
        name: "My Vaccines App",
        detail: [
          {
            type: "productIdentifier",
            valueString: eventProductId,
          },
          {
            type: "interactionIdentifier",
            valueString: eventInteractionId,
          },
        ],
      },
    ],
  };
};

const createLoginAuditEvent = (
  nhsNumber: AuditEventNHSNumber,
  traceId: AuditEventTraceId,
  resultOfInteraction: AuditEventProductIdentifier,
): AuditEvent => {
  return _createAuditEvent({
    eventId: "vita-login-successful",
    eventTypeCode: "110114",
    eventTypeDisplay: "User Authentication",
    eventSubTypeCode: "110122",
    eventSubTypeDisplay: "Login",
    eventAction: "E",
    nhsNumber: nhsNumber,
    eventTraceId: traceId,
    eventProductId: resultOfInteraction,
    eventInteractionId: NHS_LOGIN_PROVIDER_ID,
  });
};

export { createLoginAuditEvent };

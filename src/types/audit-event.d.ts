type AuditEventId = "vita-login-successful";
type AuditEventTypeCode = "110114";
type AuditEventTypeDisplay = "User Authentication";
type AuditEventSubTypeCode = "110122";
type AuditEventSubTypeDisplay = "Login";
type AuditEventAction = "C" | "R" | "U" | "D" | "E";
type AuditEventTimestamp = string;
type AuditEventNHSNumber = string;
type AuditEventTraceId = string;
type AuditEventProductIdentifier = "Success";
type AuditEventInteractionIdentifier = "nhs-login";

// Ref: https://hl7.org/fhir/R4/auditevent.html
interface AuditEvent {
  resourceType: "AuditEvent";

  id: AuditEventId;

  type: {
    // Ref: https://hl7.org/fhir/R4/valueset-audit-event-type.html
    system: "http://dicom.nema.org/resources/ontology/DCM";
    code: AuditEventTypeCode;
    display: AuditEventTypeDisplay;
  };
  subtype: {
    // Ref: https://hl7.org/fhir/R4/valueset-audit-event-sub-type.html
    system: "http://dicom.nema.org/resources/ontology/DCM";
    code: AuditEventSubTypeCode;
    display: AuditEventSubTypeDisplay;
  }[];

  action: AuditEventAction;
  recorded: AuditEventTimestamp;

  agent: [
    {
      who: {
        type: "Organization";
        identifier: {
          system: "https://fhir.nhs.uk/Id/ods-organization-code";
          value: "X26";
        };
        display: "NHS App";
      };
      requestor: false;
    },
    {
      who: {
        type: "Patient";
        identifier: {
          system: "https://fhir.nhs.uk/Id/nhs-number";
          value: AuditEventNHSNumber;
        };
      };
      requestor: true;
    },
  ];

  source: {
    site: "https://vaccinations.nhs.uk/";
    observer: {
      identifier: {
        system: "https://fhir.nhs.uk/Id/accredited-system";
        value: "MyVaccines";
      };
      display: "My Vaccines App";
    };
    type: [
      {
        system: "http://terminology.hl7.org/CodeSystem/security-source-type";
        code: "4";
      },
    ];
  };

  entity: [
    {
      what: {
        identifier: {
          system: "https://fhir.nhs.uk/Id/nhs-number";
          value: AuditEventNHSNumber;
        };
      };
      type: {
        system: "http://terminology.hl7.org/CodeSystem/audit-entity-type";
        code: "1";
        display: "Person";
      };
      role: {
        system: "http://terminology.hl7.org/CodeSystem/object-role";
        code: "1";
        display: "Patient";
      };
    },
    {
      what: {
        identifier: {
          system: "https://fhir.nhs.uk/Id/transaction";
          value: AuditEventTraceId;
        };
      };
      type: {
        system: "https://profiles.ihe.net/ITI/BALP/CodeSystem/BasicAuditEntityType";
        code: "XrequestId";
      };
    },
    {
      what: {
        identifier: {
          system: "https://fhir.nhs.uk/Id/accredited-system";
          value: "MyVaccines";
        };
      };
      type: {
        system: "http://hl7.org/fhir/resource-types";
        code: "Endpoint";
      };
      role: {
        system: "http://terminology.hl7.org/CodeSystem/object-role";
        code: "17";
        display: "Data Repository";
      };
      name: "My Vaccines App";
      detail: [
        {
          type: "productIdentifier";
          valueString: AuditEventProductIdentifier;
        },
        {
          type: "interactionIdentifier";
          valueString: AuditEventInteractionIdentifier;
        },
      ];
    },
  ];
}

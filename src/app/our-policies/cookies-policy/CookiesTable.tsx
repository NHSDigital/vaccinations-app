import React, { JSX } from "react";

const CookiesTable = (): JSX.Element => {
  return (
    <table className="nhsuk-table">
      <thead className="nhsuk-table__head">
        <tr>
          <th scope="col" className="nhsuk-table__header">
            Name
          </th>
          <th scope="col" className="nhsuk-table__header nhsuk-table__header">
            Purpose
          </th>
          <th scope="col" className="nhsuk-table__header nhsuk-table__header">
            Expires
          </th>
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        <tr className="nhsuk-table__row">
          <th scope="row" className="nhsuk-table__header">
            __Host-authjs.csrf-token
          </th>
          <td className="nhsuk-table__cell nhsuk-table__cell">
            Helps keep the site secure by preventing cross-site request forgery (CSRF) attacks
          </td>
          <td className="nhsuk-table__cell nhsuk-table__cell">When you close the browser</td>
        </tr>
        <tr className="nhsuk-table__row">
          <th scope="row" className="nhsuk-table__header">
            __Secure-authjs.callback-url
          </th>
          <td className="nhsuk-table__cell nhsuk-table__cell">
            After a successful login, this stores the URL that you are redirected to
          </td>
          <td className="nhsuk-table__cell nhsuk-table__cell-">When you close the browser</td>
        </tr>
        <tr className="nhsuk-table__row">
          <th scope="row" className="nhsuk-table__header">
            __Secure-authjs.session-token
          </th>
          <td className="nhsuk-table__cell nhsuk-table__cell">
            Stores information in an encrypted format that allows us to communicate with other services
          </td>
          <td className="nhsuk-table__cell nhsuk-table__cell">After 1 hour</td>
        </tr>
      </tbody>
    </table>
  );
};

export default CookiesTable;

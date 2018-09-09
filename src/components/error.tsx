import * as React from "react";
import "../scss/error.scss";

export default (props: {
  error: Error
}) => (
    <div className="error">
      <p>ERROR</p>
      <p>{props.error.name}</p>
      <p>{props.error.message}</p>
    </div>
  );

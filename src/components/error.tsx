import * as React from "react";

export default (props: {
  error: Error
}) => (
    <div className="error">
      <p>ERROR</p>
      <p>{props.error.name}</p>
      <p>{props.error.message}</p>
    </div>
  );

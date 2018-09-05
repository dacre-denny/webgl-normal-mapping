import * as React from "react";

export default (props: {
  min: number
  max: number
  label: String
}) => (
    <div>
      <input type="range" min={props.min} max={props.max} />
    </div>
  );

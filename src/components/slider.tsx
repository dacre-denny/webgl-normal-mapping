import * as React from "react";

export default (props: {
  min: number
  max: number
  step: number
  label: String
  value: number
  onChange: (value: number) => void
}) => (
    <div className="slider">
      <label>{props.label}</label>
      <input type="range" min={props.min} max={props.max} step={props.step} value={props.value} onChange={event => props.onChange(parseFloat(event.target.value))} />
    </div>
  );

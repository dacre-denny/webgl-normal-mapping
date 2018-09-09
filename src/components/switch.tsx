import * as React from "react";

export default (props: {
  label: String
  options: { value: string, label: string }[]
  onClick: (value: string) => void
}) => (
    <div className="switch">
      <label>{props.label}</label>
      <select onChange={event => props.onClick(event.target.value)} >
        {props.options.map(option => (<option value={option.value}>{option.label}</option>))}
      </select>
    </div>
  );

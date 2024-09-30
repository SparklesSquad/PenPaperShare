import React from 'react';

function InputComponent(props) {
  const type = props.type;
  const placeholder = props.placeholder;
  const required = Boolean(props.required);
  const pattern = props.pattern;

  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
}

export default InputComponent;

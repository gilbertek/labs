import React from 'react';
import Proptypes from 'prop-types';

const TextInput = ({ name, label, onChange, placeholder, value, error }) => {
  let wrapperClass = 'form-group';
  if (error && error.length > 0) {
    wrapperClass += ' ' + 'has-error';
  }

  return (
    <div className={wrapperClass}>
      <label htmlFor={name}>{label}</label>
      <div className = 'field'>
        <input
          type='text'
          name={name}
          className='form-control warn'
          placeholder={placeholder}
          value={value}
          onChange={onChange} />
        {error && <div className='alert alert-danger'>{error}</div>}
      </div>
    </div>
  );
};

TextInput.propTypes = {
  name: Proptypes.string.isRequired,
  label: Proptypes.string.isRequired,
  onChange: Proptypes.func.isRequired,
  placeholder: Proptypes.string,
  value: Proptypes.string,
  error: Proptypes.string
};

export default TextInput;

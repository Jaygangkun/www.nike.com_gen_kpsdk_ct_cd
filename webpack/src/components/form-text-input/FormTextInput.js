import React from 'react';
import PropTypes from 'prop-types';

import { ErrorMessage, FormTextInputContainer, StyledInput } from './styles.js';

const FormTextInput = ({
  id,
  error,
  name,
  onChange,
  onBlur,
  placeholder,
  value,
  displayErrorMessage = true,
  labelText,
  isRequired = false,
  ...rest
}) => (
  <React.Fragment>
    <FormTextInputContainer>
      {labelText}
      <StyledInput
        type="text"
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        value={value}
        hasError={!!error}
        aria-invalid={!!error}
        aria-required={isRequired}
        {...rest}
      />
    </FormTextInputContainer>

    {displayErrorMessage && error && <ErrorMessage>{error}</ErrorMessage>}
  </React.Fragment>
);

FormTextInput.propTypes = {
  containerStyles: PropTypes.string,
  displayErrorMessage: PropTypes.bool,
  labelText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default FormTextInput;

import React, { useState, useEffect } from "react";

export const useValidation = (options) => {
  const [invalids, setInvalid] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [originalOptValue, setOriginalOptValue] = useState({
    ...Object.keys(options)
      .map((option) => ({
        [option]: { value: options[option].$value[0] },
      }))
      .reduce((final, current) => ({ ...final, ...current }), {}),
  });
  const [validation, setValidation] = useState({
    ...Object.keys(options)
      .map((option) => ({
        [option]: {
          $value: options[option].$value[0],
          $update: options[option].$value[1],
          $anyInvalids: false,
          $isDirty: false,
          $errors: [],
        },
      }))
      .reduce((final, current) => ({ ...final, ...current }), {}),
  });

  // const validation = {};
  for (const option of Object.keys(options)) {
    const current = options[option];
    useEffect(() => {
      if (current.$value[0] !== originalOptValue?.[option].value) {
        setDirty(true);
        setValidation((validation) => {
          validation[option].$isDirty = true;
          return validation;
        });
      }
      setInvalid((invalid) => false);
      validation[option].$errors = [];
      validation[option].$anyInvalids = false;
      Object.keys(current).forEach((validatorOption) => {
        if (validatorOption.includes("$")) return;

        const currentValidation = current[validatorOption];

        const isValid = currentValidation.$validator(current.$value[0]);
        if (!isValid) {
          setInvalid((invalid) => true);
          setValidation((validation) => {
            validation[option].$anyInvalids = true;
            if (
              !validation[option].$errors.includes(currentValidation.$message)
            ) {
              validation[option].$errors.push(currentValidation.$message);
            }
            return validation;
          });
        }
      });
      if (validation[option].$anyInvalids) {
        setInvalid((invalid) => true);
      }
    }, [current.$value[0]]);
  }

  return {
    $anyInvalids: invalids,
    $isDirty: dirty,
    $reset: () => {
      setDirty(false);
      for (const option of Object.keys(options)) {
        setValidation((validation) => {
          validation[option].$isDirty = false;
          return validation;
        });
      }
    },
    $touch: () => {
      setDirty(true);
      for (const option of Object.keys(options)) {
        setValidation((validation) => {
          validation[option].$isDirty = true;
          return validation;
        });
      }
    },
    ...validation,
  };
};

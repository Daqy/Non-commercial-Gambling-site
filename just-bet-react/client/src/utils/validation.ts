import { useState } from "react";

export const useValidate = (value, opts) => {
  const errors = [];
  let anyInvalids = false;
  const [dirty, setDirty] = useState(false);

  for (const opt of Object.keys(opts)) {
    const current = opts[opt];
    const isValid = current.$validator(value);

    if (!isValid) {
      anyInvalids = true;
      errors.push(current.$message);
    }
    // console.log(current);
    // console.log(opt);
  }

  const update = () => {
    setDirty(true);
  };

  const reset = () => {
    setDirty(false);
  };

  return {
    $errors: errors,
    $anyInvalids: anyInvalids,
    $isDirty: dirty,
    $touch: update,
    $reset: reset,
  };
};

export const useValidation = (opts) => {
  let validation = {};
  let anyInvalids = false;

  for (const opt of Object.keys(opts)) {
    const current = opts[opt];
    // if (current.includes("$")) return
    const optsWithValue = Object.keys(current)
      .filter((opts) => !opts.includes("$"))
      .map((opts) => ({ [opts]: current[opts] }))
      .reduce((final, current) => ({ ...final, ...current }), {});

    validation[opt] = useValidate(current.$value, optsWithValue);

    if (validation[opt].$anyInvalids) {
      anyInvalids = true;
    }
  }

  const touch = () => {
    for (const opt of Object.keys(validation)) {
      validation[opt].$touch();
    }
  };
  const reset = () => {
    for (const opt of Object.keys(validation)) {
      validation[opt].$reset();
    }
  };

  return {
    ...validation,
    $touch: touch,
    $reset: reset,
    $anyInvalids: anyInvalids,
  };
};

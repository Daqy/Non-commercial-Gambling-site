import * as S from "./index.styles";

export default function Input(props) {
  let { label, inline, validation, ...atr } = props;

  if (!inline) inline = false;
  return (
    <S.label htmlFor={label} theme={{ inline }}>
      {label}
      <S.input
        {...atr}
        theme={{
          error: validation && validation.$anyInvalids && validation.$isDirty,
        }}
      />
      {validation && validation.$anyInvalids && validation.$isDirty ? (
        <S.errorMessage>{validation.$errors[0]}</S.errorMessage>
      ) : (
        <></>
      )}
    </S.label>
  );
}

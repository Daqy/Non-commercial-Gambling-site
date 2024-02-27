import * as S from "./index.styles";
import { useState } from "react";
import AppInput from "~components/input";
import AppButton from "~components/button";
import axios from "axios";
import { useValidation } from "@/utils/validation";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "~store/auth";
import { updateUsername, updateBalance } from "~store/user";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useValidation({
    username: {
      $value: username,
      isEmpty: {
        $validator: (value: string) => {
          return !!value;
        },
        $message: "Username is required",
      },
    },
    email: {
      $value: email,
      isEmpty: {
        $validator: (value: string) => {
          return !!value;
        },
        $message: "Email is required",
      },
      emailFormatIsCorrect: {
        $validator: (value: string) => {
          return !value.includes("@");
        },
        $message: "@ must be included in email",
      },
    },
    password: {
      $value: password,
      isEmpty: {
        $validator: (value: string) => {
          return !!value;
        },
        $message: "Password is required",
      },
    },
    confirmPassword: {
      $value: confirmPassword,
      isEmpty: {
        $validator: (value: string) => {
          return !!value;
        },
        $message: "Password is required",
      },
      isEqual: {
        $validator: (value: string) => {
          return value === password;
        },
        $message: "Password must match",
      },
    },
  });

  const register = (e) => {
    e.preventDefault();
    if (form.$anyInvalids) {
      form.$touch();
      return;
    }
    setLoading(true);

    axios
      .post("/auth/register", {
        username: username,
        email: email,
        password: password,
      })
      .then(async (response) => {
        await dispatch(setToken(response.data.Token));

        axios.get("/api/get-user").then(async (response) => {
          await dispatch(updateUsername(response.data.username));
          await dispatch(updateBalance(response.data.balance));
          setLoading(false);
          navigate("/minesweeper");
        });
      });
  };

  return (
    <S.container>
      <S.inputContainer>
        <form onSubmit={register}>
          <AppInput
            label="username"
            onChange={(e) => {
              setUsername(e.target.value);
              form.username.$touch();
            }}
            validation={form.username}
            placeholder="Enter your username..."
          />
          <AppInput
            label="email"
            onChange={(e) => {
              setEmail(e.target.value);
              form.email.$touch();
            }}
            validation={form.email}
            placeholder="Enter your email..."
          />
          <AppInput
            label="password"
            onChange={(e) => {
              setPassword(e.target.value);
              form.password.$touch();
            }}
            validation={form.password}
            placeholder="Enter your password..."
            type="password"
          />
          <AppInput
            label="confirm password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              form.confirmPassword.$touch();
            }}
            validation={form.confirmPassword}
            placeholder="Enter your password..."
            type="password"
          />
          <AppButton type="submit" loading={loading}>
            register
          </AppButton>
          <S.register>
            Already have an account? <Link to="/login">Sign in</Link>
          </S.register>
        </form>
      </S.inputContainer>
    </S.container>
  );
}

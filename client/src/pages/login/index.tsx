import { useState } from "react";
import * as S from "./index.styles";
import AppInput from "~components/input";
import AppButton from "~components/button";
import axios from "axios";
import { useValidation } from "@/utils/validation";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "~store/auth";
import { updateUsername, updateBalance } from "~store/user";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useValidation({
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
          return true;
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
  });

  const login = (e) => {
    e.preventDefault();
    if (form.$anyInvalids) {
      form.$touch();
      return;
    }
    setLoading(true);

    axios
      .post("/auth/login", {
        username: email,
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
        {/* {validation} */}
        <form onSubmit={login}>
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
          <AppButton type="submit" loading={loading}>
            login
          </AppButton>
          <S.register>
            Don't have an account? <Link to="/register">Sign up</Link>
          </S.register>
        </form>
      </S.inputContainer>
    </S.container>
  );
}

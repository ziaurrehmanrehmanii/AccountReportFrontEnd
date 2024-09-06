import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const token = localStorage.getItem("token");
  const LocalStorageData = token ? JSON.parse(token) : null;
  const apikey = LocalStorageData.apiKey;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/protected`, {
      headers: {
        Authorization: `Bearer ${apikey}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        navigate("/");
      }
    });
  }, []);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState({
    status: 0,
    Body: {
      error: "",
    },
  });
  const handleSubmit = async (input: any) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    const responseData = await response.json();
    if (response.status === 200) {
      localStorage.setItem("token", JSON.stringify(responseData));
      navigate("/");
    } else {
      setApiError({ status: response.status, Body: responseData });
    }
  }; // Add your login logic here
  console.log("Error", apiError);
  return (
    <div className="flex flex-col justify-center min-h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(loginData);
            }}
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  onInput={(e) => {
                    setLoginData({
                      ...loginData,
                      email: e.currentTarget.value,
                    });
                  }}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                {/* <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div> */}
                <Input
                  onInput={(e) => {
                    setLoginData({
                      ...loginData,
                      password: e.currentTarget.value,
                    });
                  }}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
        {apiError.status !== 0 ? (
          <Alert variant="destructive">
            <p>{apiError.Body.error}</p>
          </Alert>
        ) : null}
      </Card>
    </div>
  );
}

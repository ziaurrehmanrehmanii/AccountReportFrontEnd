import { Link, Router } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Email validation function
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
export function Register() {
  const token = localStorage.getItem("token");
  const LocalStorageData = token ? JSON.parse(token) : null;
  const apikey = LocalStorageData.apiKey;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(import.meta.env.VITE_BASE_URL);
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
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState({
    status: 0,
    Body: "",
  });
  const handle_submit = async (data: any) => {
    let response = await fetch(`${import.meta.env.VITE_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log("Response", responseData);
    if (response.status === 200) {
      localStorage.setItem("token", JSON.stringify(responseData));
      navigate("/");
    } else {
      setApiError({ status: response.status, Body: responseData.error });
    }
  };
  console.log("Error", apiError);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.currentTarget.value;
    setIsEmailValid(validateEmail(email));
  };
  return (
    <>
      <div className="flex flex-col justify-center min-h-screen">
        <Card className="mx-auto   max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handle_submit(data);
              }}
            >
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      onInput={(e) =>
                        setData({ ...data, firstName: e.currentTarget.value })
                      }
                      id="first-name"
                      placeholder="Max"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      onInput={(e) =>
                        setData({ ...data, lastName: e.currentTarget.value })
                      }
                      id="last-name"
                      placeholder="Robinson"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    onInput={(e) =>
                      setData({ ...data, email: e.currentTarget.value })
                    }
                    id="email"
                    className={isEmailValid ? "" : "border-red-500"}
                    onBlur={handleEmailBlur}
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    onInput={(e) =>
                      setData({ ...data, password: e.currentTarget.value })
                    }
                    id="password"
                    type="password"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create an account
                </Button>
                {/* <Button variant="outline" className="w-full">
              Sign up with GitHub
            </Button> */}
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
          {
            // Show error alert if status is not 200
            apiError.status !== 0 && (
              <Alert variant="destructive" className="mt-4">
                {apiError.Body}
              </Alert>
            )
          }
        </Card>
      </div>
    </>
  );
}

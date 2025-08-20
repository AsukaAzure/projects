import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();
  // const { login } = useAuth();
  let url = "";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  if (activeTab === "signin") {
    url = "/api/auth/signin";
  } else {
    url = "/api/auth/signup";
  }
  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      // login(data.user);
      // console.log(data);
      setLoading(false);
      setError(null);
      navigate("/home");
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  };
  console.log(formData);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center min-h-screen mx-auto gap-6">
          <Tabs
            defaultValue="login"
            className="w-[400px]"
            onValueChange={(val) => {
              setActiveTab(val);
            }}
          >
            <div className="flex w-full max-w-sm flex-col gap-6">
              <TabsList className="w-[250px]">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="signup">Register</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">Log in</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Label>Email</Label>
                    <Input
                      id="email"
                      placeholder="user@gmail.com"
                      type="email"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3 pt-4">
                    <Label>Password</Label>
                    <Input
                      id="password"
                      placeholder="*********"
                      type="password"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button disabled={loading}>
                      {loading ? "Loading..." : "Log in"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <CardHeader className="text-3xl font-bold">Register</CardHeader>
                <CardContent>
                  <div className="grid gap-3 py-2">
                    <Label>Username</Label>
                    <Input
                      type="text"
                      placeholder="user"
                      id="username"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3 py-2">
                    <Label>Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@gmail.com"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3 py-2">
                    <Label>Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-center pt-2">
                    <Button disabled={loading} type="submit">
                      {loading ? "Loading..." : "Register"}
                    </Button>
                  </div>
                  {error && <p>{error}</p>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </>
  );
}

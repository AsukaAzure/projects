import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen mx-auto gap-6">
        <Tabs defaultValue="login" className="w-[400px]">
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
                  <Input id="email" placeholder="user@gmail.com" type="email" />
                </div>
                <div className="grid gap-3 pt-4">
                  <Label>Password</Label>
                  <Input
                    id="password"
                    placeholder="*********"
                    type="password"
                  />
                </div>
                <div className="flex justify-center pt-4">
                  <Button>Submit</Button>
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
                  <Input placeholder="user" id="user" />
                </div>
                <div className="grid gap-3 py-2">
                  <Label>Email</Label>
                  <Input id="email" type="email" placeholder="user@gmail.com" />
                </div>
                <div className="grid gap-3 py-2">
                  <Label>Password</Label>
                  <Input id="password" type="password" placeholder="********" />
                </div>
                <div className="flex justify-center pt-2">
                  <Button>Register</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

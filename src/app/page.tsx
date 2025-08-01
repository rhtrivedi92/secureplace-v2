"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, AtSign, KeyRound, Eye, EyeOff } from "lucide-react";

import { account, databases } from "@/lib/appwrite";
import { Query, Models } from "appwrite";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

interface UserProfile extends Models.Document {
  role: "employee" | "firm_admin" | "super_admin";
}

export default function ProfessionalLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

    try {
      await account.createEmailPasswordSession(values.email, values.password);

      const user = await account.get();

      const promise = await databases.listDocuments<UserProfile>(
        databaseId,
        collectionId,
        [Query.equal("userId", user.$id)]
      );

      if (promise.documents.length === 0) {
        throw new Error("User profile not found.");
      }

      const userProfile = promise.documents[0];
      const role = userProfile.role;

      if (role === "super_admin") {
        router.push("/super-admin-dashboard");
      } else if (role === "firm_admin") {
        router.push("/firm-admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      await account.deleteSession("current").catch(() => {});
      setError(err.message || "Login failed. Please check your credentials.");
      console.error("Login process failed:", err);
    }
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-slate-50">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960_1280.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-white opacity-60" />

        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image src={"/images/logo.png"} height={165} width={165} alt="Logo" />
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand-blue">
              Sign in to your Account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your credentials to access the employee safety portal.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="name@company.com"
                          {...field}
                          className="pl-10 h-12"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          className="pl-10 pr-10 h-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-slate-600"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}

              <div className="flex items-center justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-brand-blue hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-md bg-brand-orange hover:bg-orange-600 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Form>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-brand-blue"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

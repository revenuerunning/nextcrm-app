"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import SuspenseLoading from "@/components/loadings/suspense";

//TODO: fix all the types
type NewTaskFormProps = {
  initialData: any;
};

export function UpdateContactForm({ initialData }: NewTaskFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: accounts, isLoading: isLoadingAccounts } = useSWR(
    "/api/crm/account",
    fetcher
  );

  const { data: users, isLoading: isLoadingUsers } = useSWR(
    "/api/user",
    fetcher
  );

  const formSchema = z.object({
    id: z.string().min(5).max(30),
    birthday: z.date().nullable().optional(),
    first_name: z.string().nullable().optional(),
    last_name: z.string(),
    description: z.string().nullable().optional(),
    email: z.string(),
    personal_email: z.string().nullable().optional(),
    office_phone: z.string().nullable().optional(),
    mobile_phone: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
    position: z.string().nullable().optional(),
    status: z.boolean(),
    type: z.string(),
    assigned_to: z.string(),
    accountsIDs: z.string().nullable().optional(),
    social_twitter: z.string().nullable().optional(),
    social_facebook: z.string().nullable().optional(),
    social_linkedin: z.string().nullable().optional(),
    social_skype: z.string().nullable().optional(),
    social_youtube: z.string().nullable().optional(),
    social_tiktok: z.string().nullable().optional(),
  });

  type NewAccountFormValues = z.infer<typeof formSchema>;

  //TODO: fix this any
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const contactType = [
    { name: "Customer", id: "Customer" },
    { name: "Partner", id: "Partner" },
    { name: "Vendor", id: "Vendor" },
  ];

  const onSubmit = async (data: NewAccountFormValues) => {
    setIsLoading(true);
    try {
      await axios.put("/api/crm/contacts", data);
      toast({
        title: "Success",
        description: "Contact created successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data,
      });
    } finally {
      setIsLoading(false);
      router.refresh();
      router.push("/crm/contacts");
    }
  };

  if (isLoadingUsers || isLoadingAccounts)
    return (
      <div>
        <SuspenseLoading />
      </div>
    );

  if (!users || !accounts || !initialData)
    return <div>Something went wrong, there is no data for form</div>;

  //console.log(accounts, "accounts");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full px-10">
        {/*        <div>
          <pre>
            <code>{JSON.stringify(form.formState.errors, null, 2)}</code>
          </pre>
        </div> */}
        {/*     <pre>
          <code>{JSON.stringify(initialData, null, 2)}</code>
        </pre> */}
        {/*        <div>
          <pre>
            <code>{JSON.stringify(form.watch(), null, 2)}</code>
          </pre>
        </div> */}
        <div className=" w-[800px] text-sm">
          <div className="pb-5 space-y-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile phone</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="+11 1236 77 55"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="office_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office phone</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="+11 1236 77 55"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="john@domain.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personal_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="littlejohny@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="https://www.domain.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Birthday</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a contact birth day</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        //@ts-ignore
                        //TODO: fix this
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Useful information about the contact"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-5">
              <div className="w-1/2 space-y-2">
                <FormField
                  control={form.control}
                  name="assigned_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned user</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose an user " />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            //TODO: fix this
                            users.map((user: any) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="account"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign an Account</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose assigned account " />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            //TODO: fix this
                            accounts.map((account: any) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="CTO"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Is contact active?
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned user</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose contact type " />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contactType.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2 space-y-2">
                <FormField
                  control={form.control}
                  name="social_twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="https://www.twitter.com/john"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="social_facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="https://www.facebook.com/john"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="social_linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Linkedin</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="https://www.linkedin.com/john"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="social_skype"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skype</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="https://www.skype.com/john"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="social_youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="https://www.youtube.com/nextcrmio"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="social_tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="https://www.domain.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-2 py-5">
          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <span className="flex items-center animate-pulse">
                Saving data ...
              </span>
            ) : (
              "Create contact"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

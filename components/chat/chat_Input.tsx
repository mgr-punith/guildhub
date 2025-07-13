"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmileBeam, faPlus } from "@fortawesome/free-solid-svg-icons";

interface ChatInputProps {
  apiUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6 bg-[#313338]">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute top-6 left-8 h-6 w-6  flex items-center justify-center"
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-white dark:text-[#313338] "
                      style={{ color: "#ffffff" }}
                    />
                  </button>
                  <input
                    disabled={isLoading}
                    className="w-full pl-14 pr-4 py-2 rounded-md bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 text-zinc-600 dark:text-zinc-200 focus:outline-none focus:ring-0 focus:ring-offset-0"
                    placeholder={`Message  ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                  />
                  <div className="absolute top-6 right-8">
                    <FontAwesomeIcon icon={faFaceSmileBeam} size="xl" />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

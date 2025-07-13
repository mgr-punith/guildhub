"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FileUplaod } from "@/components/file-upload";
import axios from "axios";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const fromSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required.",
  }),
});

export const MessageFileModal = () => {
  const { isOpen, onClose, data, type } = useModal();
  const router = useRouter();
  const { apiUrl, query } = data;

  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "0",
        query,
      });
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-xl text-center font-semibold">
              Add an attachment
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Send a file as an attachment
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUplaod
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="bg-gray-100 py-4 px-6">
                <Button variant="primary" disabled={isLoading}>
                  Send
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

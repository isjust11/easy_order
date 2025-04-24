import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CategoryType } from "@/types/category-type"
import Switch from "@/components/form/switch/Switch"
import { SmilePlus } from "lucide-react"
import { useState } from "react";
import { IconPickerModal } from "@/components/IconPickerModal"
import { emojiToUnicode, unicodeToEmoji } from "@/lib/utils"
const formSchema = z.object({
  code: z.string().min(2, {
    message: "Mã loại phải có ít nhất 2 ký tự.",
  }),
  name: z.string().min(2, {
    message: "Tên loại phải có ít nhất 2 ký tự.",
  }),
  description: z.string().optional(),
  isActive: z.boolean(),
  icon: z.string().optional(),
})

interface CategoryTypeFormProps {
  initialData?: CategoryType;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export function CategoryTypeForm({ initialData, onSubmit, onCancel }: CategoryTypeFormProps) {
  if(initialData && initialData?.icon !==null){
    initialData.icon = unicodeToEmoji(initialData.icon ??'');
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code: "",
      name: "",
      description: "",
      isActive: true,
      icon: "",
    },
  })
   const handleSubmit = (values: z.infer<typeof formSchema>) => {
          // Chuyển đổi icon thành mã Unicode trước khi submit
          if (values.icon) {
              values.icon = emojiToUnicode(values.icon);
          }
          onSubmit(values);
      };
  
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã loại</FormLabel>
              <FormControl>
                <Input className="input-focus" placeholder="Nhập mã loại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên loại</FormLabel>
              <FormControl>
                <Input className="input-focus" placeholder="Nhập tên loại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea className="input-focus" placeholder="Nhập mô tả" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-start items-center gap-2">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <Switch
                  label="Trạng thái"
                  defaultChecked={field.value}
                  {...field}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      disabled
                      className="input-focus"
                      {...field}
                      value={field.value || ""}
                      placeholder="Chọn icon"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-10 p-0"
                    onClick={() => setIsIconPickerOpen(true)}
                  >
                    <SmilePlus className="h-4 w-4 text-amber-300" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            {initialData ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
        <IconPickerModal
          isOpen={isIconPickerOpen}
          onClose={() => setIsIconPickerOpen(false)}
          onSelect={(icon) => {
            form.setValue("icon", icon);
          }}
        />
      </form>
    </Form>
  )
}


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
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  code: z.string().min(2, {
    message: "Mã loại phải có ít nhất 2 ký tự.",
  }),
  name: z.string().min(2, {
    message: "Tên loại phải có ít nhất 2 ký tự.",
  }),
  description: z.string().optional(),
  status: z.enum(["1", "0"]),
})

interface CategoryTypeFormProps {
  initialData?: CategoryType;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export function CategoryTypeForm({ initialData, onSubmit, onCancel }: CategoryTypeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code: "",
      name: "",
      description: "",
      status: "1",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Switch
                label="Sử dụng"
                defaultChecked={field.value == "1" ? true : false}
                {...field}
              />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            {initialData ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 
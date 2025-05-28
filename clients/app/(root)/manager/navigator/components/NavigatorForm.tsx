import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Category } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Switch from "@/components/form/switch/Switch";
import { Textarea } from "@/components/ui/textarea";
import { Navigator } from "@/types/navigator";
import { useState } from "react";
import { SmilePlus } from "lucide-react";
import { IconPickerModal } from "@/components/IconPickerModal";
import { emojiToUnicode, unicodeToEmoji } from "@/lib/utils";

const formSchema = z.object({
    label: z.string().min(2, {
        message: "Tên chức năng phải có ít nhất 2 ký tự.",
    }),
    link: z.string().min(2, {
        message: "Đường dẫn phải có ít nhất 2 ký tự.",
    }),
    isActive: z.boolean(),
    order: z.number().optional(),
    roles: z.array(z.string()).optional(),
    icon: z.string().optional(),
    parentId: z.string().optional(),
});

interface NavigatorFormProps {
    initialData?: Navigator | null;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    onCancel: () => void;
    navigatorParents: Navigator[];
}

export function NavigatorForm({ initialData, onSubmit, onCancel, navigatorParents }: NavigatorFormProps) {
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                ...initialData,
                isActive: true,
                icon: initialData.icon ? unicodeToEmoji(initialData.icon) : "",
                parentId: initialData.parentId ? initialData.parentId.toString() : "",
                roles: initialData.roles?.map((role) => role.id) || [],
                order: initialData.order || 0,
                link: initialData.link || "",
                label: initialData.label || "",
            }
            : {
                label: "",
                link: "",
                isActive: true,
                icon: "",
                parentId: "",
                roles: [],
                order: 0,
            },
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        // Chuyển đổi icon thành mã Unicode trước khi submit
        if (values.icon) {
            values.icon = emojiToUnicode(values.icon);
        }
        onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên chức năng</FormLabel>
                            <FormControl>
                                <Input className="input-focus" placeholder="Nhập tên chức năng" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Đường dẫn</FormLabel>
                            <FormControl>
                                <Input className="input-focus" placeholder="Nhập đường dẫn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Danh mục cha</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục cha" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-60 overflow-y-auto bg-white z-[999991]">
                                    {navigatorParents.map((parent) => (
                                        <SelectItem key={parent.id} value={parent.id}>
                                            <div className="flex flex-start items-center">
                                                <span className="text-2xl mr-2"> {parent.icon && unicodeToEmoji(parent.icon)}</span>
                                                <span className="text-sm text-gray-500">{parent.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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


                <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                        {initialData ? "Cập nhật" : "Thêm mới"}
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
    );
}
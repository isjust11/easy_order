import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Switch from "@/components/form/switch/Switch";
import { Feature } from "@/types/feature";
import { useEffect, useState } from "react";
import { SmilePlus } from "lucide-react";
import { IconPickerModal } from "@/components/IconPickerModal";
import { decode, emojiToUnicode, getFeatureType, unicodeToEmoji } from "@/lib/utils";
import { IconType } from "@/enums/icon-type.enum";
import { Icon } from "@/components/ui/icon";
import { Slider } from "@/components/ui/slider";
import { Category } from "@/types/category";
import { getCategoryByCode } from "@/services/manager-api";

const formSchema = z.object({
    label: z.string().min(2, {
        message: "Tên chức năng phải có ít nhất 2 ký tự.",
    }),
    link: z.string().min(2, {
        message: "Đường dẫn phải có ít nhất 2 ký tự.",
    }),
    isActive: z.boolean(),
    order: z.string().optional(),
    roles: z.array(z.string()).optional(),
    icon: z.string().optional(),
    iconSize: z.number().optional().default(20),
    className: z.string().optional().default(''),
    iconType: z.nativeEnum(IconType),
    parentId: z.string().optional(),
    navigatorTypeId: z.string().optional(),
});

interface NavigatorFormProps {
    initialData?: Feature | null;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    onCancel: () => void;
    navigatorParents: Feature[];
}

export function NavigatorForm({ initialData, onSubmit, onCancel, navigatorParents }: NavigatorFormProps) {
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [iconType, setIconType] = useState(IconType.lucide);
    const [iconSize, setIconSize] = useState(20)
    const [navigatorType, setNavigatorType] = useState<Category[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                ...initialData,
                isActive: true,
                icon: initialData.icon ? unicodeToEmoji(initialData.icon) : "",
                parentId: initialData.parentId ? initialData.parentId.toString() : "",
                roles: initialData.roles?.map((role) => role.id) || [],
                order: initialData.order ? String(initialData.order) : "0",
                link: initialData.link || "",
                label: initialData.label || "",
                iconSize: initialData.iconSize || 20,
                className: initialData.className || "",
                iconType: IconType.lucide,
                navigatorTypeId: decode(initialData.navigatorTypeId || "")
            }
            : {
                label: "",
                link: "",
                isActive: true,
                icon: "",
                parentId: "",
                roles: [],
                order: "0",
                iconSize: 20,
                className: "",
                iconType: IconType.lucide,
                navigatorTypeId: ""
            },
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        // Chuyển đổi icon thành mã Unicode trước khi submit
        if (values.icon && values.iconType === IconType.emoji) {
            values.icon = emojiToUnicode(values.icon);
        }
        // Đảm bảo order là số
        values.order = values.order || "0";
        onSubmit(values);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loadNavigatorType = async () => {
                const response = await getCategoryByCode(getFeatureType());
                setNavigatorType(response);
            };
            loadNavigatorType();
        }
    }, []);
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
                            <FormMessage className="text-red-500"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="navigatorTypeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Loại chức năng</FormLabel>
                            <FormControl>
                                <Select 
                                    value={field.value} 
                                    onValueChange={field.onChange} 
                                    defaultValue={navigatorType[0]?.id}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại chức năng" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-60 overflow-y-auto bg-white z-[999991]">
                                        {navigatorType.length >0 ? navigatorType.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                <div className="flex flex-start items-center">
                                                    <span className="text-2xl mr-2">
                                                        {type.icon && (
                                                            <Icon name={type.icon} />
                                                        )}
                                                    </span>
                                                    <span className="text-sm text-gray-500">{type.name}</span>
                                                </div>
                                            </SelectItem>
                                        )): (
                                            <div className="flex flex-start items-center">
                                                <span className="text-sm px-2 py-2">
                                                    Không có dữ liệu
                                                </span>
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className="text-red-500"/> 
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
                            <FormMessage className="text-red-500"/> 
                        </FormItem>
                    )}
                />
                <div className="flex flex-start items-center gap-2">
                    <FormField
                        control={form.control}
                        name="parentId"
                        render={({ field }) => (
                            <FormItem className="w-2/3">
                                <FormLabel>Danh mục cha</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục cha" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-60 overflow-y-auto bg-white z-[999991]">
                                        {navigatorParents.length == 0 && (
                                            <div className="flex flex-start items-center">
                                                <span className="text-sm px-2 py-2">
                                                    Không có dữ liệu
                                                </span>
                                            </div>
                                        )}
                                        {navigatorParents.map((parent) => (
                                            <SelectItem key={parent.id} value={parent.id}>
                                                <div className="flex flex-start items-center">
                                                    <span className="text-2xl mr-2">
                                                        {parent.iconType === IconType.emoji
                                                            ? parent.icon && unicodeToEmoji(parent.icon)
                                                            : parent.icon && (
                                                                <Icon
                                                                    name={parent.icon}
                                                                    size={parent.iconSize}
                                                                    className={parent.className}
                                                                />
                                                            )
                                                        }
                                                    </span>
                                                    <span className="text-sm text-gray-500">{parent.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500"/> 
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                            <FormItem className="w-1/3">
                                <FormLabel>Thứ tự</FormLabel>
                                <FormControl>
                                    <Input
                                        className="input-focus"
                                        type="text"
                                        placeholder="Thứ tự"
                                        {...field}
                                        value={field.value || 0}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500"/> 
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-between items-center gap-2">
                    <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex gap-2 items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-9 w-10 p-0"
                                        onClick={() => setIsIconPickerOpen(true)}
                                    >
                                        <SmilePlus className="h-4 w-4" />
                                    </Button>
                                    {
                                        iconType == IconType.emoji ?
                                            <FormControl>
                                                <Input
                                                    disabled
                                                    className="input-focus"
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="Chọn icon"
                                                />
                                            </FormControl>
                                            :
                                            <div className="flex items-center gap-2">
                                                <div className="h-12 w-12 flex items-center justify-center
                                             hover:bg-gray-100 ring-1 ring-gray-100 shadow-2xl rounded-sm">
                                                    <Icon name={field.value ?? ''} size={iconSize} />
                                                </div>
                                                {field.value && (<div className="flex-1" >
                                                    <Slider
                                                        className="[&_.slider-track]:bg-gray-200 [&_.slider-range]:bg-blue-500 [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-blue-500"
                                                        defaultValue={[iconSize]}
                                                        max={40}
                                                        step={1}
                                                        onValueChange={(value) => {
                                                            setIconSize(value[0]);
                                                            form.setValue("iconSize", value[0]);
                                                        }}
                                                    />
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Kích thước: {iconSize}px
                                                    </div>
                                                </div>)}
                                            </div>

                                    }

                                </div>
                                <FormMessage className="text-red-500"/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem>
                                <Switch
                                    label="Trạng thái"
                                    defaultChecked={field.value}
                                    {...field}
                                />
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


            </form>
            <IconPickerModal
                isOpen={isIconPickerOpen}
                onClose={() => setIsIconPickerOpen(false)}
                onSelect={(icon, iconType) => {
                    console.log('icon type:' + iconType);
                    setIconType(iconType);
                    form.setValue("icon", icon);
                }}
            />
        </Form>
    );
}

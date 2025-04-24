import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import emojiData from "emoji-datasource";

interface IconPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (icon: string) => void;
}

const icons = emojiData
    .filter(emoji => emoji.has_img_apple) // Filter emojis that have images
    .map(emoji => ({
        shortName: emoji.short_name,
        unified: emoji.unified,
        char: String.fromCodePoint(...emoji.unified.split('-').map(u => parseInt(u, 16)))
    }));

export function IconPickerModal({ isOpen, onClose, onSelect }: IconPickerModalProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredIcons = icons.filter(icon =>
        icon.shortName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[600px] p-5"
        >
            <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">Chọn icon</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                        placeholder="Tìm kiếm icon..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {filteredIcons.length > 0 ? (
                    <div className="grid grid-cols-8 gap-2 max-h-[400px] overflow-y-auto">
                        {filteredIcons.map((icon, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="h-12 w-12 text-2xl flex items-center justify-center hover:bg-gray-100"
                                onClick={() => {
                                    onSelect(icon.char);
                                    onClose();
                                }}
                            >
                                {icon.char}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                        Không tìm thấy icon nào phù hợp với từ khóa "{searchTerm}"
                    </div>
                )}
            </div>
        </Modal>
    );
} 
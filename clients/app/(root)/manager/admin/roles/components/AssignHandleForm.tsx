// components/EnhancedAssignList.jsx
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigatorService } from '@/services/feature-api';
import { Feature } from '@/types/feature';
import { ArrowRight, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { set } from 'react-hook-form';
import { toast } from 'sonner';

interface EnhancedAssignListProps {
    assignedItems?: string[];
    onChange?: (assignedIds: (string | number)[]) => void;
    isView?: boolean;
}

export default function AssignHandleForm({
    assignedItems = [],
    onChange,
    isView = false
}: EnhancedAssignListProps) {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [unassigned, setUnassigned] = useState<Feature[]>([]);
    const [assigned, setAssigned] = useState<Feature[]>([]);
    const [searchUnassigned, setSearchUnassigned] = useState('');
    const [searchAssigned, setSearchAssigned] = useState('');
    const [selectedUnassigned, setSelectedUnassigned] = useState<(string | number)[]>([]);
    const [selectedAssigned, setSelectedAssigned] = useState<(string | number)[]>([]);
    const [filteredUnassigned, setFilteredUnassigned] = useState<Feature[]>([]);
    const [filteredAssigned, setFilteredAssigned] = useState<Feature[]>([]);

    useEffect(() => {
        fetchFeatures();
    }, []);

    // Thêm useEffect để cập nhật danh sách khi assignedItems thay đổi
    useEffect(() => {
        if (features.length > 0) {
            const initialUnassigned = features.filter((item: Feature) => !assignedItems?.includes(item.id));
            const initialAssigned = features.filter((item: Feature) => assignedItems?.includes(item.id));
            
            setUnassigned(initialUnassigned);
            setAssigned(initialAssigned);
            setFilteredUnassigned(initialUnassigned);
            setFilteredAssigned(initialAssigned);
        }
    }, [assignedItems, features]);

    const fetchFeatures = async () => {
        try {
            const data = await navigatorService.getNavigators();
            const newFeatures = data.data;
            setFeatures(newFeatures);
            
            // Khởi tạo danh sách ban đầu
            const initialUnassigned = newFeatures.filter((item: Feature) => !assignedItems?.includes(item.id));
            const initialAssigned = newFeatures.filter((item: Feature) => assignedItems?.includes(item.id));
            
            setUnassigned(initialUnassigned);
            setAssigned(initialAssigned);
            setFilteredUnassigned(initialUnassigned);
            setFilteredAssigned(initialAssigned);
        } catch (error: any) {
            toast.error('Lỗi khi tải danh sách chức năng: ' + error.message);
        }
    };

    // Assignment functions
    const assignItem = (item: Feature) => {
        const newUnassigned = unassigned.filter(i => i.id !== item.id);
        const newAssigned = [...assigned, item];

        setUnassigned(newUnassigned);
        setAssigned(newAssigned);
        setFilteredAssigned(newAssigned);
        setFilteredUnassigned(newUnassigned);
        setSelectedUnassigned(selectedUnassigned.filter(id => id !== item.id));

        // Thông báo thay đổi lên component cha
        onChange?.(newAssigned.map(item => item.id));
    };

    const unassignItem = (item: Feature) => {
        const newAssigned = assigned.filter(i => i.id !== item.id);
        const newUnassigned = [...unassigned, item];

        setAssigned(newAssigned);
        setUnassigned(newUnassigned);
        setFilteredAssigned(newAssigned);
        setFilteredUnassigned(newUnassigned);
        setSelectedAssigned(selectedAssigned.filter(id => id !== item.id));

        // Thông báo thay đổi lên component cha
        onChange?.(newAssigned.map(item => item.id));
    };

    // Bulk actions
    const assignSelected = () => {
        const itemsToAssign = unassigned.filter(item =>
            selectedUnassigned.includes(item.id)
        );

        const newUnassigned = unassigned.filter(item =>
            !selectedUnassigned.includes(item.id)
        );
        const newAssigned = [...assigned, ...itemsToAssign];

        setUnassigned(newUnassigned);
        setAssigned(newAssigned);
        setSelectedUnassigned([]);
        setFilteredAssigned(newAssigned);
        setFilteredUnassigned(newUnassigned);
        // Thông báo thay đổi lên component cha
        onChange?.(newAssigned.map(item => item.id));
    };

    const unassignSelected = () => {
        const itemsToUnassign = assigned.filter(item =>
            selectedAssigned.includes(item.id)
        );

        const newAssigned = assigned.filter(item =>
            !selectedAssigned.includes(item.id)
        );
        const newUnassigned = [...unassigned, ...itemsToUnassign];

        setAssigned(newAssigned);
        setUnassigned(newUnassigned);
        setSelectedAssigned([]);
        setFilteredAssigned(newAssigned);
        setFilteredUnassigned(newUnassigned);
        // Thông báo thay đổi lên component cha
        onChange?.(newAssigned.map(item => item.id));
    };

    // Toggle selection
    const toggleUnassignedSelection = (id: string | number) => {
        setSelectedUnassigned(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const toggleAssignedSelection = (id: string | number) => {
        setSelectedAssigned(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const handleSearchUnassigned = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchUnassigned(searchValue);
        const filtered = unassigned.filter(item =>
            item.label.toLowerCase().includes(searchValue)
        );

        setFilteredUnassigned(filtered);
    };

    const handleSearchAssigned = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchAssigned(searchValue);
        const filtered = assigned.filter(item =>
            item.label.toLowerCase().includes(searchValue)
        );

        setFilteredAssigned(filtered);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-8">
                {/* Unassigned List */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Danh sách chức năng ({unassigned.length})</h2>
                        {selectedUnassigned.length > 0 && (
                            <button
                                onClick={assignSelected}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Gán đã chọn ({selectedUnassigned.length})
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm chức năng..."
                        className="w-full p-2 border rounded mb-4"
                        value={searchUnassigned}
                        onChange={(e) => handleSearchUnassigned(e)
                        }
                    />
                    <ScrollArea className="h-[200px] border rounded-md p-4">
                        <ul className="space-y-2">
                            {filteredUnassigned.map((item: Feature) => (
                                <li
                                    key={item.id}
                                    className={`p-3 border rounded flex justify-between items-center ${selectedUnassigned.includes(item.id) ? 'bg-blue-100' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedUnassigned.includes(item.id)}
                                            onChange={() => toggleUnassignedSelection(item.id)}
                                            className="h-4 w-4"
                                            aria-label={`Chọn ${item.label}`}
                                            disabled={isView}
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                    <button
                                        onClick={() => assignItem(item)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        title="Gán chức năng"
                                        disabled={isView}
                                    >
                                        <ChevronRight className="h-4 w-4 inline-block" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </div>

                {/* Assigned List */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Chức năng đã gán ({assigned.length})</h2>
                        {selectedAssigned.length > 0 && (
                            <button
                                onClick={unassignSelected}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Bỏ chọn ({selectedAssigned.length})
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm chức năng đã gán..."
                        className="w-full p-2 border rounded mb-4"
                        value={searchAssigned}
                        onChange={(e) => handleSearchAssigned(e)
                        }
                    />
                    <ScrollArea className="h-[200px] border rounded-md p-4">
                        <ul className="space-y-2">
                            {filteredAssigned.map((item: Feature) => (
                                <li
                                    key={item.id}
                                    className={`p-3 border rounded flex justify-between items-center ${selectedAssigned.includes(item.id) ? 'bg-red-100' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedAssigned.includes(item.id)}
                                            onChange={() => toggleAssignedSelection(item.id)}
                                            className="h-4 w-4"
                                            aria-label={`Chọn ${item.label}`}
                                            disabled={isView}
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                    <button
                                        onClick={() => unassignItem(item)}
                                        className="px-3 py-1 bg-red-500  text-white rounded hover:bg-red-600"
                                        title="Bỏ gán chức năng"
                                        disabled={isView}
                                    >
                                        <X className="h-4 w-4 inline-block" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
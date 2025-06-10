// components/EnhancedAssignList.jsx
import { ScrollArea } from '@/components/ui/scroll-area';
import { Feature } from '@/types/feature';
import { useState } from 'react';

interface EnhancedAssignListProps {
    allFeatures?: Feature[];
    assignedItems?: (string | number)[];
}

export default function AssignHandleForm({ allFeatures = [], assignedItems = [] }: EnhancedAssignListProps) {
    const [unassigned, setUnassigned] = useState<Feature[]>(
        allFeatures.filter(item => !assignedItems.includes(item.id))
    );
    const [assigned, setAssigned] = useState<Feature[]>(
        allFeatures.filter(item => assignedItems.includes(item.id))
    );
    const [searchUnassigned, setSearchUnassigned] = useState('');
    const [searchAssigned, setSearchAssigned] = useState('');
    const [selectedUnassigned, setSelectedUnassigned] = useState([]);
    const [selectedAssigned, setSelectedAssigned] = useState([]);

    // Filter functions
    const filteredUnassigned = unassigned.filter(item =>
        item.label.toLowerCase().includes(searchUnassigned.toLowerCase())
    );
    const filteredAssigned = assigned.filter(item =>
        item.label.toLowerCase().includes(searchAssigned.toLowerCase())
    );
    // Assignment functions
    const assignItem = (item: Feature) => {
        setUnassigned(unassigned.filter(i => i.id !== item.id));
        setAssigned([...assigned, item]);
        setSelectedUnassigned(selectedUnassigned.filter(id => id !== item.id));
    };

    const unassignItem = (item: Feature) => {
        setAssigned(assigned.filter(i => i.id !== item.id));
        setUnassigned([...unassigned, item]);
        setSelectedAssigned(selectedAssigned.filter(id => id !== item.id));
    };

    // Bulk actions
    const assignSelected = () => {
        const itemsToAssign = unassigned.filter((item: Feature) =>
            selectedUnassigned.some(selectedId => selectedId === item.id)
        );
        setUnassigned(unassigned.filter(item =>
            !selectedUnassigned.some(selectedId => selectedId === item.id)
        ));
        setAssigned([...assigned, ...itemsToAssign]);
        setSelectedUnassigned([]);
    };

    const unassignSelected = () => {
        const itemsToUnassign = assigned.filter(item =>
            selectedAssigned.includes(item.id as never)
        );
        setAssigned(assigned.filter(item =>
            !selectedAssigned.includes(item.id as never)
        ));
        setUnassigned([...unassigned, ...itemsToUnassign]);
        setSelectedAssigned([]);
    };
    // Toggle selection
    const toggleUnassignedSelection = (id: string) => {
        setSelectedUnassigned((prev: any) =>
            prev.includes(id)
                ? prev.filter((itemId: any) => itemId !== id)
                : [...prev, id]
        );
    };

    const toggleAssignedSelection = (id: string) => {
        setSelectedAssigned((prev: any) =>
            prev.includes(id)
                ? prev.filter((itemId: any) => itemId !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-8">
                {/* Unassigned List */}
                <div className="flex-1">

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Available Items ({unassigned.length})</h2>
                        {selectedUnassigned.length > 0 && (
                            <button
                                onClick={assignSelected}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Assign Selected ({selectedUnassigned.length})
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Search available items..."
                        className="w-full p-2 border rounded mb-4"
                        value={searchUnassigned}
                        onChange={(e) => setSearchUnassigned(e.target.value)}
                    />
                    <ScrollArea className="h-[200px] border rounded-md p-4">
                        <ul className="space-y-2">
                            {filteredUnassigned.map((item: Feature) => (
                                <li
                                    key={item.id}
                                    className={`p-3 border rounded flex justify-between items-center ${selectedUnassigned.includes(item.id as never) ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedUnassigned.includes(item.id as never)}
                                            onChange={() => toggleUnassignedSelection(item.id as never)}
                                            className="h-4 w-4"
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                    <button
                                        onClick={() => assignItem(item)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Assign
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </div>

                {/* Assigned List */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Assigned Items ({assigned.length})</h2>
                        {selectedAssigned.length > 0 && (
                            <button
                                onClick={unassignSelected}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Remove Selected ({selectedAssigned.length})
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Search assigned items..."
                        className="w-full p-2 border rounded mb-4"
                        value={searchAssigned}
                        onChange={(e) => setSearchAssigned(e.target.value)}
                    />
                    <ScrollArea className="h-[200px] border rounded-md p-4">
                        <ul className="space-y-2">
                            {filteredAssigned.map((item: any) => (
                                <li
                                    key={item.id}
                                    className={`p-3 border rounded flex justify-between items-center ${selectedAssigned.includes(item.id as never) ? 'bg-red-50' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedAssigned.includes(item.id as never)}
                                            onChange={() => toggleAssignedSelection(item.id as never)}
                                            className="h-4 w-4"
                                        />
                                        <span>{item.name}</span>
                                    </div>
                                    <button
                                        onClick={() => unassignItem(item)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remove
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
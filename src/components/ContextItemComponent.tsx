import React from 'react';
import { ContextItem } from '../models/context.model';

interface ContextItemProps {
    item: ContextItem;
    onView: (item: ContextItem) => void;
}

const ContextItemComponent: React.FC<ContextItemProps> = ({ item, onView }) => (
    <div className="bg-[#fafafa] rounded-lg p-4 flex flex-col gap-y-2">
        <h1 className="text-base font-semibold">{item.title}</h1>
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
        <button
            className="text-blue-600 text-sm w-fit mt-2 hover:underline hover:underline-offset-4"
            onClick={() => onView(item)}
        >
            VIEW
        </button>
    </div>
);

export default ContextItemComponent;

import React, { useEffect, useState } from 'react';
import { BiCaretDown, BiCheck, BiX } from 'react-icons/bi';
import { ALL_VALUES_SELECTED } from '../constants/common.constants';
import { MutliSelectItem } from '../models/common.model';

interface MultiSelectProps {
    id: string;
    label: string;
    placeHolder: string;
    selected: (string | number)[];
    options: MutliSelectItem[];
    clearSelections: () => void;
    onSelection: (selectedId: number | string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    id,
    label,
    placeHolder,
    selected,
    options,
    clearSelections,
    onSelection,
}) => {
    const [isOpen, setIsOpen] = useState(false),
        [isAllSelected, setIsAllSelected] = useState(true),
        [firstSelectedOption, setFirstSelectedOption] = useState(''),
        [selectedCount, setSelectedCount] = useState(0);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const element = event.composedPath()[0] as HTMLElement;

            if (element.id === id || element.closest(`#${id}`)) return;

            setIsOpen(false);
        };

        document.addEventListener('click', handleOutsideClick);

        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    useEffect(() => {
        const allSelected =
            selected.length !== 0 && selected[0] === ALL_VALUES_SELECTED;

        setIsAllSelected(allSelected);
        setSelectedCount(
            allSelected ? options.length - 1 : Math.max(selected.length - 1, 0),
        );
    }, [selected, options]);

    useEffect(() => {
        if (selected.length === 0 || options.length === 0) {
            setFirstSelectedOption(placeHolder);
        } else {
            if (isAllSelected) {
                setFirstSelectedOption(options[0].value);
            } else {
                const idx = options.findIndex(
                    (option) => option.id === selected[0],
                );
                setFirstSelectedOption(
                    idx !== -1 ? options[idx].value : placeHolder,
                );
            }
        }
    }, [selected, options, isAllSelected]);

    return (
        <div
            id={id}
            className="multi-select relative"
        >
            <div className="flex flex-col gap-y-[10px]">
                <p className="text-base font-medium text-gray-800">{label}</p>
                <div
                    className={`multi-select-box w-full py-3 px-4 rounded-lg text-black bg-[#fafafa] cursor-pointer flex items-center justify-between ${isOpen ? 'border-2 border-blue-600' : 'border border-gray-300'}`}
                    onClick={(event) => {
                        event.stopPropagation();
                        setIsOpen((isOpen) => !isOpen);
                    }}
                >
                    <div className="flex-1 flex items-center">
                        <span>{firstSelectedOption}</span>
                        {selectedCount !== 0 && (
                            <span
                                style={{
                                    fontWeight: 600,
                                    marginLeft: 6,
                                }}
                            >
                                +{selectedCount} more
                            </span>
                        )}
                    </div>
                    <div className="flex items-center">
                        {selected.length !== 0 && (
                            <BiX
                                size={20}
                                title="Clear Selections"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    clearSelections();
                                }}
                            />
                        )}
                        <div
                            className="border-l border-l-gray-500"
                            style={{
                                marginLeft: 6,
                                paddingLeft: 6,
                            }}
                        >
                            <BiCaretDown
                                size={18}
                                fill="#3E4784"
                            />
                        </div>
                    </div>
                </div>
                {isOpen && (
                    <div
                        className="multi-select-dropdown absolute left-0 border border-gray-300 shadow-sm text-black w-full overflow-hidden bg-white rounded-lg"
                        style={{ marginTop: 92, maxHeight: 112 }}
                    >
                        <div
                            className="overflow-y-auto"
                            style={{ maxHeight: 112 }}
                        >
                            {options?.map((option) => {
                                const isSelected =
                                    isAllSelected ||
                                    selected.findIndex(
                                        (selectedItem) =>
                                            selectedItem === option.id,
                                    ) !== -1;

                                return (
                                    <div
                                        key={option.id}
                                        className="px-4 py-2 w-full flex items-center cursor-pointer select-none transition-all delay-75 duration-150 ease-linear hover:bg-[#fafafa] hover:text-blue-600"
                                        style={{
                                            columnGap: 8,
                                        }}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onSelection(option.id);
                                        }}
                                    >
                                        {isSelected && (
                                            <BiCheck
                                                size={18}
                                                color="#2563eb"
                                            />
                                        )}
                                        <span
                                            className="line-clamp-1"
                                            style={{
                                                marginLeft: !isSelected
                                                    ? 26
                                                    : 0,
                                            }}
                                        >
                                            {option.value}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiSelect;

import React, { useCallback, useEffect, useState } from 'react';
import { BiX } from 'react-icons/bi';
import { ALL_VALUES_SELECTED } from '../constants/common.constants';
import { ContextItem } from '../models/context.model';
import MultiSelect from './MultiSelect';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    contexts: ContextItem[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, contexts }) => {
    const [additionalInfo, setAdditionalInfo] = useState(''),
        [selectedContexts, setSelectedContexts] = useState<(string | number)[]>(
            [ALL_VALUES_SELECTED],
        );

    useEffect(() => {
        setSelectedContexts([ALL_VALUES_SELECTED]);
    }, [isOpen]);

    const handleRunScript = () => {
        console.log('Selected Contexts:', selectedContexts);
        console.log('Additional Info:', additionalInfo);
        // Make an API call
    };

    const handleSelections = useCallback(
        (selectedId: number | string) => {
            const isAllSelected = selectedContexts?.[0] === ALL_VALUES_SELECTED,
                isFound = selectedContexts.includes(selectedId);

            if (isAllSelected) {
                setSelectedContexts(
                    contexts
                        .filter((context) => context.id !== selectedId)
                        .map((context) => context.id),
                );
                return;
            }

            const updatedSelections = isFound
                ? selectedContexts.filter(
                      (selectedContext) => selectedContext !== selectedId,
                  )
                : [...selectedContexts, selectedId];
            setSelectedContexts(
                updatedSelections.length === contexts.length
                    ? [ALL_VALUES_SELECTED]
                    : updatedSelections,
            );
        },
        [selectedContexts, contexts],
    );

    if (!isOpen) return null;

    return (
        <div
            className="modal fixed inset-0 backdrop-blur-sm w-full h-full bg-black bg-opacity-50 z-[1000] flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg w-full max-w-screen-sm flex flex-col gap-y-[18px] p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-black">
                        Run Action
                    </h1>
                    <button
                        className="icon-btn"
                        onClick={onClose}
                    >
                        <BiX
                            color="gray"
                            size={24}
                        />
                    </button>
                </div>
                <MultiSelect
                    label="Select contexts from knowledgebase:"
                    placeHolder="Select one or more contexts..."
                    selected={selectedContexts}
                    options={contexts.map((context) => ({
                        id: context.id,
                        value: context.title,
                    }))}
                    clearSelections={() => setSelectedContexts([])}
                    onSelection={handleSelections}
                />
                <div className="flex flex-col gap-y-[10px]">
                    <label
                        htmlFor="additionalDetails"
                        className="text-base font-medium text-gray-800"
                    >
                        Add Additional Details:
                    </label>
                    <textarea
                        id="additionalDetails"
                        rows={2}
                        className="input-box"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                </div>
                <button
                    className={`${selectedContexts.length === 0 ? 'btn-primary-disabled' : 'btn-primary'} self-end px-6`}
                    onClick={handleRunScript}
                    disabled={selectedContexts.length === 0}
                >
                    Run Task
                </button>
            </div>
        </div>
    );
};

export default Modal;

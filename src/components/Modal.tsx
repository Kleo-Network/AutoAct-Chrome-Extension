import React, { useEffect, useState } from 'react';
import { BiX } from 'react-icons/bi';
import { ContextItem } from '../models/context.model';
import Pills from './Pills';
import SelectionBox from './SelectionBox';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [selectedOption, setSelectedOption] = useState('Fill Form'),
        [prompt, setPrompt] = useState(''),
        [contexts, setContexts] = useState<ContextItem[]>([]),
        [selectedContext, setSelectedContext] = useState('');

    const handleSelectionChange = (option: string) => {
        setSelectedOption(option);
    };

    const handleRunScript = () => {
        console.log('Selected Context:', selectedContext);
        console.log('Additional Info:', prompt);
    };

    useEffect(() => {
        if (isOpen) {
            chrome.runtime.sendMessage(
                { action: 'getContexts' },
                (response: { data: ContextItem[]; error: string | null }) => {
                    if (response && !response.error) {
                        setContexts(response.data);
                        setSelectedContext(
                            response.data.length ? response.data[0].title : '',
                        );
                    }
                },
            );
        }
    }, [isOpen]);

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
                    <h1 className="text-2xl font-semibold">Run Action</h1>
                    <button
                        className="rounded-full p-1 transition-colors delay-75 duration-100 ease-linear hover:bg-slate-100"
                        onClick={onClose}
                    >
                        <BiX
                            color="gray"
                            size={24}
                        />
                    </button>
                </div>
                <div className="flex flex-col gap-y-[10px]">
                    <p className="text-base font-medium text-gray-800">
                        Select action to perform:
                    </p>
                    <Pills
                        options={['Fill Form', 'Chat']}
                        selectedOption={selectedOption}
                        onSelectionChange={handleSelectionChange}
                    />
                </div>
                <SelectionBox
                    label="Select context from knowledgebase:"
                    options={contexts.map((context) => context.title)}
                    onSelectionChange={(event) =>
                        setSelectedContext(event.target.value)
                    }
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
                        className="w-full resize-none bg-slate-100 border border-gray-200 p-2 rounded-lg focus:outline-none focus:border-blue-600"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
                <button
                    className="w-fit self-end text-base font-semibold bg-blue-600 text-white rounded-lg transition-colors duration-100 ease-linear px-6 py-[10px] hover:bg-blue-700"
                    onClick={handleRunScript}
                >
                    Run Task
                </button>
            </div>
        </div>
    );
};

export default Modal;

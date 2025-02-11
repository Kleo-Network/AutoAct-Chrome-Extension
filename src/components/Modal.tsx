import React, { useEffect, useState } from 'react';
import { BiSolidXCircle } from 'react-icons/bi';
import { ContextItem } from '../models/context.model';
import Pills from './Pills';

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

    const handleContextSelectionChange = (context: string) => {
        setSelectedContext(context);
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
            className="modal fixed inset-0 w-full h-full bg-black backdrop-blur-sm bg-opacity-50 z-[1000] flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg w-full max-w-screen-sm flex flex-col gap-y-4 p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full flex items-center justify-between">
                    <Pills
                        options={['Fill Form', 'Chat']}
                        selectedOption={selectedOption}
                        onSelectionChange={handleSelectionChange}
                    />
                    <button
                        className="hover:text-blue-600"
                        onClick={onClose}
                    >
                        <BiSolidXCircle
                            color="gray"
                            size={30}
                        />
                    </button>
                </div>
                <Pills
                    options={contexts.map((context) => context.title)}
                    selectedOption={selectedContext}
                    onSelectionChange={handleContextSelectionChange}
                />
                <input
                    type="text"
                    className="w-full bg-slate-100 border border-gray-200 p-2 rounded-lg focus:outline-none focus:border-2 focus:border-blue-600"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button className="w-fit self-end bg-blue-600 text-white rounded-lg font-medium transition-colors duration-100 ease-linear px-4 py-2 hover:bg-blue-700">
                    Run
                </button>
            </div>
        </div>
    );
};

export default Modal;

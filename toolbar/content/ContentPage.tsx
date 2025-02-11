import React, { useEffect, useState } from 'react';
import { BiData, BiPlay, BiPlus, BiSolidMagicWand } from 'react-icons/bi';
import { ContextFormValues } from '../../sidebar/models/context.model';
import Modal from './components/Modal';

interface ButtonPosition {
    x: number;
    y: number;
}

const ContentPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false),
        [showAddButton, setShowAddButton] = useState(false),
        [buttonPosition, setButtonPosition] = useState<ButtonPosition>({
            x: 0,
            y: 0,
        }),
        [pageData, setPageData] = useState<ContextFormValues>({
            title: '',
            description: '',
        });

    useEffect(() => {
        document.addEventListener('mouseup', (event: MouseEvent) => {
            const selection = window.getSelection(),
                selectedText = selection?.toString().trim() || '';

            if (selectedText?.length !== 0 && selection?.rangeCount) {
                setShowAddButton(false);
                setPageData({
                    title: document.title,
                    description: selectedText,
                });

                const range = selection.getRangeAt(0),
                    rect = range.getBoundingClientRect();
                setButtonPosition({
                    x: rect.left + window.scrollX,
                    y: rect.bottom + window.scrollY,
                });

                setShowAddButton(true);
            }
        });

        document.addEventListener('mousedown', (event: MouseEvent) => {
            const element = event.target as HTMLElement;

            if (
                element.id === 'btnAddToKnowledgebase' ||
                element.parentElement?.id === 'btnAddToKnowledgebase'
            )
                return;

            setShowAddButton(false);
        });

        document.addEventListener('click', () => {
            setTimeout(() => {
                const selection = window.getSelection()?.toString().trim();
                if (!selection) setShowAddButton(false);
            }, 0);
        });
    }, []);

    const openSidebar = (contentType: 'contexts' | 'addNewContext') => {
        chrome.runtime.sendMessage({ action: 'openSidePanel', contentType });
    };

    const removeSelection = () => {
        document.getSelection()?.removeAllRanges();
        setShowAddButton(false);
    };

    const sendPageData = () => {
        console.log('sending pageData...');

        removeSelection();
        chrome.runtime.sendMessage({
            action: 'scrappedPageData',
            pageData,
        });
        openSidebar('addNewContext');
    };

    return (
        <div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            {showAddButton && (
                <button
                    id="btnAddToKnowledgebase"
                    className="absolute z-50 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 py-2 px-3 flex items-center gap-x-1 font-medium"
                    style={{
                        left: buttonPosition.x,
                        top: buttonPosition.y + 4,
                    }}
                    onClick={sendPageData}
                >
                    <BiPlus
                        size={14}
                        color="white"
                    />
                    <span>Add to Knowledgebase</span>
                </button>
            )}
            <div className="buttons-wrapper fixed top-[42%] right-0 flex flex-col bg-blue-600 w-fit p-1 rounded-tl-lg rounded-bl-lg z-50">
                <button className="p-1 rounded-md transition-colors duration-100 ease-linear hover:bg-blue-800">
                    <BiSolidMagicWand
                        color="white"
                        size={30}
                    />
                </button>
                <button className="p-1 mt-1 rounded-md transition-colors duration-100 ease-linear hover:bg-blue-800">
                    <BiPlay
                        color="white"
                        size={30}
                        onClick={() => {
                            setIsModalOpen(true);
                            removeSelection();
                        }}
                    />
                </button>
                <button
                    className="p-1 mt-1 rounded-md transition-colors duration-100 ease-linear hover:bg-blue-800"
                    onClick={() => {
                        openSidebar('contexts');
                        removeSelection();
                    }}
                >
                    <BiData
                        color="white"
                        size={30}
                    />
                </button>
            </div>
        </div>
    );
};

export default ContentPage;

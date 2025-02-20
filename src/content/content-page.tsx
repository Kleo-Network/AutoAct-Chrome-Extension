import React, { useEffect, useState } from 'react';
import { BiData, BiPlay, BiPlus, BiSolidMagicWand } from 'react-icons/bi';
import Modal from '../components/Modal';
import { ContextFormValues, ContextItem } from '../models/context.model';

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
        }),
        [contexts, setContexts] = useState<ContextItem[]>([]);

    const handleMouseUp = () => {
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
    };

    const handleMouseDown = (event: MouseEvent) => {
        const element = event.composedPath()[0] as HTMLElement;

        if (
            element.id === 'btnAddToKnowledgebase' ||
            element.closest('#btnAddToKnowledgebase')
        )
            return;

        setShowAddButton(false);
    };

    const handleClick = () => {
        setTimeout(() => {
            const selection = window.getSelection()?.toString().trim();
            if (!selection) setShowAddButton(false);
        }, 0);
    };

    const fetchContexts = () => {
        chrome.runtime.sendMessage(
            { action: 'getContexts' },
            (response: { data: ContextItem[]; error: string | null }) => {
                if (response && !response.error) {
                    setContexts(response.data);
                }
            },
        );
    };

    const handleRefetchContexts = (message: { action: string }) => {
        console.log(message.action);
        if (message.action === 'refetchContexts') fetchContexts();
    };

    useEffect(() => {
        fetchContexts();
        chrome.runtime.onMessage.addListener(handleRefetchContexts);

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('click', handleClick);

        return () => {
            chrome.runtime.onMessage.removeListener(handleRefetchContexts);

            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const removeSelection = () => {
        document.getSelection()?.removeAllRanges();
        setShowAddButton(false);
    };

    const openSidebar = (
        contentType: 'contexts' | 'addNewContext',
        notifySidePanel = false,
    ) => {
        chrome.runtime.sendMessage({
            action: 'openSidePanel',
            contentType,
            notifySidePanel,
        });
    };

    const sendPageData = () => {
        removeSelection();
        chrome.runtime.sendMessage({
            action: 'scrappedPageData',
            pageData,
        });
        openSidebar('addNewContext', true);
    };

    const handleKnowledgebaseClick = () => {
        chrome.runtime.sendMessage(
            { action: 'getSidebarState' },
            (
                response:
                    | {
                          contentType: 'contexts' | 'addNewContext';
                          isSidePanelOpen: boolean;
                      }
                    | undefined,
            ) => {
                if (response && response.isSidePanelOpen) {
                    if (response.contentType === 'addNewContext')
                        openSidebar('contexts', true);
                    else {
                        chrome.runtime.sendMessage({
                            action: 'closeSidePanel',
                        });
                    }
                } else {
                    openSidebar('contexts', true);
                }
            },
        );
        removeSelection();
    };

    return (
        <div className="font-inter">
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contexts={contexts}
            />
            {showAddButton && (
                <button
                    id="btnAddToKnowledgebase"
                    className="absolute z-50 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 py-2 px-3 flex items-center gap-x-1 font-medium transition-all delay-75 duration-100 ease-linear"
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
                    <span>Add to AutoAct</span>
                </button>
            )}
            <div className="buttons-wrapper fixed top-[42%] right-0 flex flex-col gap-y-1 bg-blue-600 w-fit p-1 rounded-tl-lg rounded-bl-lg z-[999]">
                <button
                    className="toolbar-btn"
                    title="Magic"
                >
                    <BiSolidMagicWand
                        color="white"
                        size={30}
                    />
                </button>
                <button
                    className={`toolbar-btn ${contexts.length === 0 ? 'hover:bg-blue-600' : ''}`}
                    onClick={() => {
                        setIsModalOpen(true);
                        removeSelection();
                    }}
                    disabled={contexts.length === 0}
                    title="Run"
                >
                    <BiPlay
                        color={contexts.length === 0 ? '#ffffff3b' : 'white'}
                        size={30}
                    />
                </button>
                <button
                    className="toolbar-btn"
                    onClick={handleKnowledgebaseClick}
                    title="Knowledgebase"
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

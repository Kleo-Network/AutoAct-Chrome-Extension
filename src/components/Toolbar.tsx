import React, { useEffect, useState } from 'react';
import { BiData, BiPlay, BiSolidMagicWand } from 'react-icons/bi';
import { TOOLBAR_ID } from '../constants/common.constants';
import { ContextItem } from '../models/context.model';

interface ToolbarProps {
    contexts: ContextItem[];
    openSidebar: (
        contentType: 'contexts' | 'addNewContext',
        notifySidePanel?: boolean,
    ) => void;
    removeSelection: () => void;
    openModal: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
    contexts,
    openSidebar,
    removeSelection,
    openModal,
}) => {
    const [showToolbar, setShowToolbar] = useState(false);

    const checkInputs = () => {
        const inputFields = document.querySelectorAll('input, textarea');
        setShowToolbar(inputFields.length > 3);
    };

    useEffect(() => {
        checkInputs();

        // MutationObserver for dynamically added/removed inputs
        const observer = new MutationObserver(() => checkInputs());
        observer.observe(document.body, { childList: true, subtree: true });

        // Listen for navigation within the same website (for SPAs)
        const handleNavigation = () => {
            setTimeout(checkInputs, 500);
        };

        window.addEventListener('popstate', handleNavigation); // For back/forward navigation
        window.addEventListener('hashchange', handleNavigation); // For hash-based navigation

        // Handle tab switching
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkInputs();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Run check when a new page loads
        window.addEventListener('load', checkInputs);

        return () => {
            observer.disconnect();
            window.removeEventListener('popstate', handleNavigation);
            window.removeEventListener('hashchange', handleNavigation);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
            window.removeEventListener('load', checkInputs);
        };
    }, []);

    const handleMagicButtonClick = () => {
        // Make an API call
        removeSelection();
    };

    const handleKnowledgebaseButtonClick = () => {
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

    if (!showToolbar) return null;

    return (
        <div
            id={TOOLBAR_ID}
            className="buttons-wrapper fixed top-[42%] right-0 flex flex-col gap-y-1 bg-blue-600 w-fit p-1 rounded-tl-lg rounded-bl-lg"
            style={{
                zIndex: 9999,
            }}
        >
            <button
                className="toolbar-btn"
                title="Magic"
                onClick={handleMagicButtonClick}
            >
                <BiSolidMagicWand
                    color="white"
                    size={30}
                />
            </button>
            <button
                className={`toolbar-btn ${contexts.length === 0 ? 'hover:bg-blue-600' : ''}`}
                onClick={() => {
                    openModal();
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
                onClick={handleKnowledgebaseButtonClick}
                title="Knowledgebase"
            >
                <BiData
                    color="white"
                    size={30}
                />
            </button>
        </div>
    );
};

export default Toolbar;

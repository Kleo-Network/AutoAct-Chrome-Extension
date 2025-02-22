import React, { useContext, useEffect, useState } from 'react';
import { BiArrowBack, BiPlus, BiSolidPencil } from 'react-icons/bi';
import AddContextForm from './components/AddContextForm';
import ContextDetail from './components/ContextDetail';
import ContextList from './components/ContextList';
import { ContextsContext } from './contexts/ContextsContext';
import { ContextFormValues, ContextItem } from './models/context.model';

const App: React.FC = () => {
    const { contexts: contextItems } = useContext(ContextsContext),
        [currentContext, setCurrentContext] = useState<ContextItem | null>(
            null,
        ),
        [isEditMode, setIsEditMode] = useState(false),
        [sidebarContentType, setSidebarContentType] = useState<
            'contexts' | 'addNewContext'
        >('contexts');

    useEffect(() => {
        chrome.runtime.sendMessage(
            { action: 'getSidebarState' },
            (response?: { contentType: 'contexts' | 'addNewContext' }) => {
                if (response) {
                    setSidebarContentType(response.contentType);
                }
            },
        );

        const handleMessage = ({
            action,
            contentType,
        }: {
            action: string;
            contentType?: 'contexts' | 'addNewContext';
        }) => {
            if (action === 'updateSidebarContentType' && contentType) {
                setSidebarContentType(contentType);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    const handleViewContext = (item: ContextItem) => {
        setCurrentContext(item);
        setIsEditMode(false);
    };

    const handleSave = (updateContext: ContextFormValues) => {
        setCurrentContext((prevContext) =>
            prevContext ? { ...prevContext, ...updateContext } : null,
        );
        setIsEditMode(false);
    };

    const addNewContext = () => {
        chrome.runtime.sendMessage({
            action: 'scrappedPageData',
            pageData: {
                title: '',
                description: '',
            },
        });
        chrome.runtime.sendMessage({
            action: 'openSidePanel',
            contentType: 'addNewContext',
        });
        setSidebarContentType('addNewContext');
    };

    const backToKnowledgebase = () => {
        if (sidebarContentType === 'contexts') {
            setCurrentContext(null);
            setIsEditMode(false);
        } else {
            setSidebarContentType('contexts');
            chrome.runtime.sendMessage({
                action: 'openSidePanel',
                contentType: 'contexts',
            });
        }
    };

    return (
        <div className="text-base flex flex-col h-screen overflow-hidden">
            <div className="w-full px-6 py-[14px] bg-[#EDF0F9] flex items-center justify-between">
                {sidebarContentType === 'contexts' && !currentContext && (
                    <>
                        <h1 className="text-lg font-semibold">
                            Your Knowledgebase
                        </h1>
                        <button
                            className="btn-primary flex items-center gap-x-1"
                            onClick={addNewContext}
                        >
                            <BiPlus
                                size={18}
                                color="white"
                            />
                            <span>New</span>
                        </button>
                    </>
                )}
                {(currentContext || sidebarContentType === 'addNewContext') && (
                    <button
                        className="transition-all duration-150 delay-75 ease-linear text-black flex items-center gap-x-2 hover:text-blue-600"
                        onClick={backToKnowledgebase}
                        title="Back to Knowledebase"
                    >
                        <BiArrowBack size={18} />
                    </button>
                )}
                {sidebarContentType === 'addNewContext' ? (
                    <p className="flex-1 text-center font-medium">
                        Add New Context
                    </p>
                ) : sidebarContentType === 'contexts' && currentContext ? (
                    isEditMode ? (
                        <p className="flex-1 text-center font-medium">
                            Edit Context Details
                        </p>
                    ) : (
                        <p className="font-medium">Context Details</p>
                    )
                ) : null}
                {sidebarContentType === 'contexts' &&
                    currentContext &&
                    !isEditMode && (
                        <button
                            className="icon-btn hover:bg-white"
                            onClick={() => setIsEditMode(true)}
                        >
                            <BiSolidPencil
                                size={18}
                                color="black"
                            />
                        </button>
                    )}
            </div>
            {sidebarContentType === 'contexts' &&
                (currentContext ? (
                    <ContextDetail
                        context={currentContext}
                        isEditMode={isEditMode}
                        onSave={handleSave}
                        onCancel={() => setIsEditMode(false)}
                    />
                ) : (
                    <ContextList
                        contextItems={contextItems}
                        onView={handleViewContext}
                    />
                ))}
            {sidebarContentType === 'addNewContext' && (
                <AddContextForm
                    onSaved={() => {
                        chrome.runtime.sendMessage({
                            action: 'openSidePanel',
                            contentType: 'contexts',
                        });
                        setSidebarContentType('contexts');
                        setCurrentContext(null);
                    }}
                />
            )}
        </div>
    );
};

export default App;

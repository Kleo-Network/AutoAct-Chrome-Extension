import React, { useContext, useEffect } from 'react';
import { ContextsContext } from '../contexts/ContextsContext';
import { ContextFormValues } from '../models/context.model';
import ContextForm from './ContextForm';

interface AddContextFormProps {
    onSaved: () => void;
}

const AddContextForm: React.FC<AddContextFormProps> = ({ onSaved }) => {
    const [contextFormData, setContextFormData] =
            React.useState<ContextFormValues>({
                title: '',
                description: '',
            }),
        { addNewContext } = useContext(ContextsContext);

    const getContextFormData = () => {
        chrome.runtime.sendMessage(
            { action: 'getPageData' },
            (response: { pageData: ContextFormValues } | undefined) => {
                if (response) {
                    setContextFormData(response.pageData);
                }
            },
        );
    };

    const updateContextFormData = (message: { action: string }) => {
        if (message.action === 'updatePageData') getContextFormData();
    };

    useEffect(() => {
        getContextFormData();
        chrome.runtime.onMessage.addListener(updateContextFormData);

        return () =>
            chrome.runtime.onMessage.removeListener(updateContextFormData);
    }, []);

    const handleChange = (name: keyof ContextFormValues, value: string) => {
        setContextFormData({
            ...contextFormData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        if (
            contextFormData.title.trim() === '' ||
            contextFormData.description.trim() === ''
        ) {
            return;
        }

        await addNewContext(contextFormData);
        chrome.runtime.sendMessage({ action: 'informModalToRefetchContexts' });
        onSaved();
    };

    const handleCancel = () => {
        chrome.runtime.sendMessage({ action: 'closeSidePanel' });
        setContextFormData({
            title: '',
            description: '',
        });
    };

    return (
        <div className="p-6 text-base flex flex-col gap-y-4 flex-1 bg-[#fafafa]">
            <ContextForm
                context={contextFormData}
                onChange={handleChange}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default AddContextForm;

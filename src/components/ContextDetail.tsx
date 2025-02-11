import React, { useContext } from 'react';
import { BiSolidPencil } from 'react-icons/bi';
import { ContextsContext } from '../contexts/ContextsContext';
import { ContextFormValues, ContextItem } from '../models/context.model';
import EditContextForm from './EditContextForm';

interface ContextDetailProps {
    context: ContextItem;
    isEditMode: boolean;
    onEdit: () => void;
    onSave: (updateContext: ContextFormValues) => void;
    onCancel: () => void;
}

const ContextDetail: React.FC<ContextDetailProps> = ({
    context,
    isEditMode,
    onEdit,
    onSave,
    onCancel,
}) => {
    const [contextData, setContextData] = React.useState<ContextFormValues>({
            title: context.title,
            description: context.description,
        }),
        { updateContext } = useContext(ContextsContext);

    const handleContextDataChange = (
        name: keyof ContextFormValues,
        value: string,
    ) => {
        setContextData({
            ...contextData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        if (
            contextData.title.trim() === '' ||
            contextData.description.trim() === ''
        ) {
            return;
        }

        await updateContext({
            id: context.id,
            ...contextData,
        });
        onSave(contextData);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="p-4 w-full">
            {!isEditMode ? (
                <div className="w-full">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">
                            {context.title}
                        </h1>
                        <BiSolidPencil
                            size={18}
                            className="cursor-pointer hover:text-blue-600"
                            onClick={onEdit}
                        />
                    </div>
                    <p className="text-gray-600 text-base mt-2">
                        {context.description}
                    </p>
                </div>
            ) : (
                <EditContextForm
                    context={contextData}
                    onChange={handleContextDataChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default ContextDetail;

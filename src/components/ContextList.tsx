import React from 'react';
import Step1 from '../assets/images/step1.svg';
import Step2 from '../assets/images/step2.svg';
import { ContextItem } from '../models/context.model';
import ContextItemComponent from './ContextItemComponent';

interface ContextListProps {
    contextItems: ContextItem[];
    onView: (item: ContextItem) => void;
}

const ContextList: React.FC<ContextListProps> = ({ contextItems, onView }) => {
    if (contextItems.length === 0) {
        return (
            <div className="px-6 flex flex-col justify-center items-center bg-[#fafafa] flex-1 gap-y-6">
                <div className="w-full text-center">
                    <h3 className="text-xl text-black font-semibold">
                        Your Knowledgebase is empty
                    </h3>
                    <p className="text-xs text-[#667085] font-normal mt-2">
                        Start by adding first context into your knowlegebase by
                        following these quick steps:
                    </p>
                </div>
                <div className="step-1 w-full flex flex-col items-center gap-y-[14px]">
                    <img
                        src={Step1}
                        alt="Select and Add to AutoAct"
                        width="40%"
                    />
                    <p className="text-sm font-medium text-gray-700">
                        Select and Add to AutoAct
                    </p>
                </div>
                <div className="step-2 w-full flex flex-col items-center gap-y-[14px]">
                    <img
                        src={Step2}
                        alt="Edit and Save to Knowledgebase"
                        width="40%"
                    />
                    <p className="text-sm font-medium text-gray-700">
                        Edit and Save to Knowledgebase
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-4 flex flex-col space-y-4 bg-[#fafafa] flex-1 overflow-auto">
            {contextItems.map((item) => (
                <ContextItemComponent
                    key={item.id}
                    item={item}
                    onView={onView}
                />
            ))}
        </div>
    );
};

export default ContextList;

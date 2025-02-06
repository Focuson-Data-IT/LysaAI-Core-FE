import React from 'react';

const ActivityCard = () => {
    return (
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-900">
            <div className="mb-1 font-bold">Activity</div>
            <div className="h-[200px] overflow-auto">
                {/* Add your content here */}
                <h3>This is Activity Card</h3>
            </div>
        </div>
    );
};

export default ActivityCard;
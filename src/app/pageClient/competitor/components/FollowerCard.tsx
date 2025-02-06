import React from 'react';

const FollowerCard = () => {
    return (
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-900">
            <div className="mb-1 font-bold">Follower</div>
            <div className="h-[200px] overflow-auto">
                {/* Add your content here */}
                <div>
                    <h3>This is Follower Card</h3>
                </div>
            </div>
        </div>
    );
};

export default FollowerCard;
import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...rest }) => {
    return <div {...rest} className={`bg-white/5 skeleton-shimmer ${className}`} />;
};

export default Skeleton;

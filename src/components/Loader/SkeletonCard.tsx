import './SkeletonCard.css';

// Define the SkeletonCard component
const SkeletonCard = () => {
  // Render skeleton layout
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-decal"></div>
    </div>
  );
};

// Export the SkeletonCard component as default
export default SkeletonCard;

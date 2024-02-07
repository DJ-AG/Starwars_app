import './Loader.css'; // Make sure to create this CSS file

const LoadingComponent = () => {
  return (
    <div className="loading-backdrop">
      <div className="loading-spinner">
        {/* You can add your own spinner or loading animation here */}
        Loading...
      </div>
    </div>
  );
};

export default LoadingComponent;

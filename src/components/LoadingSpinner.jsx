// components/LoadingSpinner.jsx
const LoadingSpinner = ({ fullPage = false }) => (
    <div className={`flex justify-center items-center ${fullPage ? 'h-screen' : 'h-full'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  export default LoadingSpinner; // Agrega esta línea
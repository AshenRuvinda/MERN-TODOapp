const NotFound = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="card text-center">
          <h2 className="text-4xl font-bold text-danger mb-4">404 - Page Not Found</h2>
          <p className="text-secondary">The page you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  };

  export default NotFound;
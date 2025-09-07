import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-card px-6 py-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          © {new Date().getFullYear()} AdminLTE Dashboard. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span>Version 3.2.0</span>
          <a href="#" className="hover:text-foreground">
            Documentation
          </a>
          <a href="#" className="hover:text-foreground">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
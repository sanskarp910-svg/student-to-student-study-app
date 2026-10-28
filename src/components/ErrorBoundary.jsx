import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
          <div className="bg-cream-100 border border-cream-300 rounded-3xl p-8 max-w-md w-full text-center shadow-card space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-extrabold text-navy-900">Something went wrong</h2>
            <p className="text-xs text-navy-600">
              An unexpected error occurred while loading the screen.
            </p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-left font-mono text-[11px] text-red-800 overflow-x-auto max-h-32">
              {this.state.error?.message || "Unknown error"}
            </div>
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.reload();
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl transition"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

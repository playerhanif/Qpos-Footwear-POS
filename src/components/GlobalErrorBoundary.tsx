import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">Error:</h2>
                        <pre className="text-sm text-red-700 whitespace-pre-wrap">
                            {this.state.error?.toString()}
                        </pre>
                    </div>
                    {this.state.errorInfo && (
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 custom-scrollbar overflow-auto max-h-[500px]">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Stack Trace:</h2>
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

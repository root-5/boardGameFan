import React, { Component, ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // エラーが発生した場合に状態を更新
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // エラー情報をログに出力
        console.error("Error!!:", error, errorInfo);
        console.warn("Error message:", error.message);

        // エラーが発生した場合にローカルストレージを削除
        console.log("Delete localStorage");
        localStorage.clear();
    }

    render() {
        if (this.state.hasError) {
            // エラー発生時に表示するUI
            return (
                <>
                    <h1
                        className="mt-12 text-2xl text-center"
                    >
                        Error occurred. Please reload the page🙇
                    </h1>
                    <div
                        onClick={() => {
                            localStorage.clear(); // ローカルストレージを削除
                            window.location.reload(); // ページをリロードして初期状態に戻す
                        }}
                        className="mt-4 text-center text-blue-500 cursor-pointer"
                    >
                        Reload
                    </div>
                </>

            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
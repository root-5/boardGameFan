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
                <div className="flex flex-col items-center justify-center h-screen bg-gray-700 gap-8">
                    <h1 className="text-2xl text-center text-white" >
                        Error occurred. <br/>Please reload the page🙇
                    </h1>
                    <div
                        onClick={() => {
                            localStorage.clear(); // ローカルストレージを削除
                            window.location.reload(); // ページをリロードして初期状態に戻す
                        }}
                        className="text-3xl p-4 text-center rounded-md cursor-pointer duration-200 hover:opacity-70 text-white bg-red-500"
                    >
                        Reload
                    </div>
                </div>

            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
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
        console.error("エラーが発生しました:", error, errorInfo);

        // 特定のエラーメッセージを検知
        if (error.message.includes("Application error: a client-side exception has occurred")) {
            console.warn("ローカルストレージをリセットします。");
            localStorage.clear(); // ローカルストレージを削除
            window.location.reload(); // ページをリロードして初期状態に戻す
        }
    }

    render() {
        if (this.state.hasError) {
            // エラー発生時に表示するUI
            return <h1>エラーが発生しました。ページをリロードしてください。</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
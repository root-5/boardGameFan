"use client";

/**
 * ランタイムエラーを捕捉し、リカバリ UI を表示する境界コンポーネント
 *
 * 破損したローカルストレージ等が原因のことが多いため、
 * エラー時は localStorage をクリアして再読み込みを促します。
 */

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary がエラーを捕捉しました:", error, errorInfo);

    try {
      localStorage.clear();
    } catch {
      // Private Mode などでは clear に失敗することがある
    }
  }

  handleReload = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-700 gap-8">
          <h1 className="text-2xl text-center text-white">
            Error occurred.
            <br />
            Please reload the page.
          </h1>
          <button
            type="button"
            onClick={this.handleReload}
            className="text-3xl p-4 text-center rounded-md cursor-pointer duration-200 hover:opacity-70 text-white bg-red-500"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

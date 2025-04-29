"use client";

import Image from "next/image";
import React, { Component, ReactNode, ErrorInfo } from "react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-10 w-full h-full flex flex-col items-center justify-center">
          <Image
            src={"/images/svg/Glyph-01.svg"}
            alt="glyph logo"
            width={50}
            height={50}
            className="mb-3"
          />
          <h2 className="text-xl font-bold mb-2">
            Oops! Something went a little sideways.
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            It&apos;s probably not us... but just in case, try not doing what
            you did right before this error popped up.
          </p>
          <p className="text-sm text-gray-600 mb-5">
            Click the link below to go back — or go grab a coffee while we sort
            this out. ☕️
          </p>
          <Link
            href={"/verify"}
            className="border px-3 py-2 rounded-md text-xs"
          >
            Back to editor
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

"use client";

import { Component } from "react";

interface CommentSectionProps {
    children?: Component | any;
}

interface CommentEntryProps {
    user?: string;
    content: string;
    date: Date;
}

function CommentEntry(props: CommentEntryProps) {
    const { content, date } = props;

    const sinceDate = date.getDate();
    return (
        <div>

        </div>
    );
}

function CommentSection(props: CommentSectionProps) {
    return (
        <div>

        </div>
    );
}

export default function Page() {
    return (
        <main className="w-full h-full bg-neutral-50">

        </main>
    );
}

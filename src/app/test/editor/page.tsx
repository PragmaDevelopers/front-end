"use client";

import RichEditor from '@/app/components/dashboard/RichEditor';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { useRef } from 'react';

export default function Page() {
    const editorRef = useRef<MDXEditorMethods>(null);
    return (
        <main className="w-full h-full">
            <div className="w-[75%] h-[75%]">
                <div className='z-[2]'>
                    <RichEditor ref={editorRef} markdown='' />
                </div>
            </div>
        </main>
    );
}

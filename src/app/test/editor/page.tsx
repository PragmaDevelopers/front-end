"use client";

import { MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, linkPlugin, linkDialogPlugin, tablePlugin, markdownShortcutPlugin, toolbarPlugin, UndoRedo, BlockTypeSelect, BoldItalicUnderlineToggles, InsertTable, ListsToggle, CreateLink } from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css';
import { forwardRef } from "react";

const Editor = forwardRef(() => {
    return (
            <MDXEditor
            className="MDXEditor"
            onChange={console.log}
            markdown={""}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                tablePlugin(),
                markdownShortcutPlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <UndoRedo />
                            <BlockTypeSelect />
                            <BoldItalicUnderlineToggles />
                            <InsertTable />
                            <ListsToggle />
                            <CreateLink />
                        </>
                    )
                }),
            ]}

        />

    );
});

Editor.displayName = "Editor";

export default function Page() {
    return (
        <main className="w-full h-full">
            <div className="w-[75%] h-[75%]">
                <Editor/>
            </div>
        </main>
    );
}

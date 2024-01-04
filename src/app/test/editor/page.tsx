"use client";

import { MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, linkPlugin, linkDialogPlugin, tablePlugin, markdownShortcutPlugin, toolbarPlugin, UndoRedo, BlockTypeSelect, BoldItalicUnderlineToggles, InsertTable, ListsToggle, CreateLink } from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css';

export default function Page() {
    return (
        <main className="w-full h-full">
            <div className="w-[75%] h-[75%]">
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
            </div>
        </main>
    );
}

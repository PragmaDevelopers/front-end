"use client";

import { MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, linkPlugin, linkDialogPlugin, tablePlugin, markdownShortcutPlugin, toolbarPlugin, UndoRedo, BlockTypeSelect, BoldItalicUnderlineToggles, InsertTable, ListsToggle, CreateLink } from "@mdxeditor/editor";

export default function Page() {
    return (
        <main className="w-full h-full flex items-center justify-center">
            <div className="w-fit h-fit">
                <MDXEditor
            className={"MDXEditor block"}
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

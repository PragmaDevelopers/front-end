"use client";

import { RichEditorProps } from "@/app/interfaces/KanbanInterfaces";
import { MDXEditorMethods, MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, linkPlugin, linkDialogPlugin, tablePlugin, markdownShortcutPlugin, toolbarPlugin, UndoRedo, BlockTypeSelect, BoldItalicUnderlineToggles, InsertTable, ListsToggle, CreateLink } from "@mdxeditor/editor";
import { forwardRef, Ref } from "react";

const RichEditor = forwardRef((props: RichEditorProps, ref: Ref<MDXEditorMethods> | undefined) => {
    return (
        <MDXEditor
            className={"MDXEditor"}
            onChange={props.onChange}
            markdown={props.markdown != undefined ? props?.markdown : ""}
            ref={ref}
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
RichEditor.displayName = "RichEditor";

export default RichEditor;

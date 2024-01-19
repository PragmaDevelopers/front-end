"use client";

import { RichEditorProps } from "@/app/interfaces/KanbanInterfaces";
import { MDXEditorMethods, MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, linkPlugin, linkDialogPlugin, tablePlugin, markdownShortcutPlugin, toolbarPlugin, UndoRedo, BlockTypeSelect, BoldItalicUnderlineToggles, InsertTable, ListsToggle, CreateLink } from "@mdxeditor/editor";
import { forwardRef, Ref, useEffect, useRef, useState } from "react";

const RichEditor = forwardRef((props: RichEditorProps) => {
    const cardDescriptionRef = useRef<MDXEditorMethods>(null);
    useEffect(()=>{
        cardDescriptionRef.current?.setMarkdown(props.tempCard.description)
    },[props.tempCard.description])
    return (
        <MDXEditor
            markdown={""}
            className={"MDXEditor"}
            ref={cardDescriptionRef}
            onChange={(value)=>{
                props.setTempCard({...props.tempCard,description:value});
            }}
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

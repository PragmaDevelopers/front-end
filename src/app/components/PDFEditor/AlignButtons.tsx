import { usePdfEditorContext } from "@/app/contexts/pdfEditorContext";
import { Button, JsxEditorProps, corePluginHooks, JsxComponentDescriptor, NestedLexicalEditor, jsxPluginHooks, diffSourcePluginHooks } from "@mdxeditor/editor"
import { $createRangeSelection, RangeSelection } from "lexical";

// a toolbar button that will insert a JSX element into the editor.
export const AlignLeftButton = () => {
    const { editorLines, setEditorLines } = usePdfEditorContext();
    return (
        <Button
            title="Left Align"
            onClick={() => {
                const newLines = editorLines.lines;
                newLines[editorLines.selectedLineIndex].style = "left";
                setEditorLines({...editorLines,lines:newLines});
            }}
        >
            &larr;
        </Button>
    )
}

export const AlignCenterButton = () => {
    const { editorLines, setEditorLines } = usePdfEditorContext();
    return (
        <Button
            title="Center Align"
            onClick={() => {
                const newLines = editorLines.lines;
                newLines[editorLines.selectedLineIndex].style = "center";
                setEditorLines({...editorLines,lines:newLines});
            }}
        >
            &harr;
        </Button>
    )
}

export const AlignRightButton = () => {
    const { editorLines, setEditorLines } = usePdfEditorContext();
    return (
        <Button
            title="Right Align"
            onClick={() => {
                const newLines = editorLines.lines;
                newLines[editorLines.selectedLineIndex].style = "right";
                setEditorLines({...editorLines,lines:newLines});
            }}
        >
            &rarr;
        </Button>
    )
}
import { Button, JsxEditorProps, corePluginHooks, JsxComponentDescriptor, NestedLexicalEditor, jsxPluginHooks, diffSourcePluginHooks } from "@mdxeditor/editor"
import { $createRangeSelection, RangeSelection } from "lexical";

// a toolbar button that will insert a JSX element into the editor.
export const AlignLeftButton = () => {
    return (
        <Button
            title="Left Align"
            onClick={() => {
                const lineIndex = Number(sessionStorage.getItem("edit_pdf_line_selected")?.split("-")[1]);
                const lineStyleJson = sessionStorage.getItem("pdf_style_line_"+lineIndex);
                if(lineStyleJson){
                    const lineStyle = JSON.parse(lineStyleJson);
                    lineStyle.textAlign = "left";
                    sessionStorage.setItem("pdf_style_line_"+lineIndex, JSON.stringify(lineStyle));
                }else{
                    sessionStorage.setItem("pdf_style_line_"+lineIndex, JSON.stringify({
                        textAlign: "left"
                    }));
                }
            }}
        >
            &larr;
        </Button>
    )
}

export const AlignCenterButton = () => {
    return (
        <Button
            title="Center Align"
            onClick={() => {
                const lineIndex = Number(sessionStorage.getItem("edit_pdf_line_selected")?.split("-")[1]);
                const lineStyleJson = sessionStorage.getItem("pdf_style_line_"+lineIndex);
                if(lineStyleJson){
                    const lineStyle = JSON.parse(lineStyleJson);
                    lineStyle.textAlign = "center";
                    sessionStorage.setItem("pdf_style_line_"+lineIndex, JSON.stringify(lineStyle));
                }else{
                    sessionStorage.setItem("pdf_style_line_"+lineIndex, JSON.stringify({
                        textAlign: "center"
                    }));
                }
            }}
        >
            &harr;
        </Button>
    )
}

export const AlignRightButton = () => {
    return (
        <Button
            title="Right Align"
            onClick={() => {
                const lineIndex = Number(sessionStorage.getItem("edit_pdf_line_selected")?.split("-")[1]);
                const lineStyleJson = sessionStorage.getItem("pdf_style_line_"+lineIndex);
                if(lineStyleJson){
                    const lineStyle = JSON.parse(lineStyleJson);
                    lineStyle.textAlign = "right";
                    sessionStorage.setItem("pdf_style_line_"+lineIndex, JSON.stringify(lineStyle));
                }else{
                    sessionStorage.setItem("pdf_style_line_"+lineIndex, JSON.stringify({
                        textAlign: "right"
                    }));
                }
            }}
        >
            &rarr;
        </Button>
    )
}
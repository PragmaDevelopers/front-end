"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
const Mustache = require('mustache');

import '@mdxeditor/editor/style.css'
import { MDXEditor, headingsPlugin, MDXEditorMethods, BlockTypeSelect, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, InsertImage, imagePlugin } from "@mdxeditor/editor";
import { IFormSignUpInputs } from "@/app/types/RegisterClientFormTypes";
import { AlignLeftButton, AlignCenterButton, AlignRightButton } from "@/app/components/PDFEditor/AlignButtons";

function EditPdf() {
  const [signUpData, setSignUpData] = useState<IFormSignUpInputs>();
  const [variable, setVariable] = useState<string>("");
  const [editorOpacity, setEditorOpacity] = useState<number>(1);

  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null)

  useEffect(() => {
    const sessionData = sessionStorage.getItem("clientSignUp");
    if (sessionData) {
      setSignUpData(JSON.parse(sessionData))
    }
    manipulateProseClass({ restoreIds: true });
  }, [])

  function manipulateProseClass({ restoreIds }: { restoreIds?: boolean }) {
    if (restoreIds) {
      const editorWrapper = document.querySelectorAll(".prose p") as any;
      let formattedLineLength = 0;
      for (let i = 0; i < editorWrapper.length; i++) {
        editorWrapper[i].id = "line-" + i;
        const lineStyleJson = sessionStorage.getItem("pdf_style_line_"+i);
        if(lineStyleJson){
          const lineStyle = JSON.parse(lineStyleJson);
          editorWrapper[i].style.textAlign = lineStyle.textAlign;
        }else{
          editorWrapper[i].style.textAlign = "left";
        }
        const content = editorRef.current?.getMarkdown().split(/\n\n/g);
        if(content && content[i]){
          formattedLineLength++;
          sessionStorage.setItem("pdf_line_"+i,content[i]);
        }     
      }
      sessionStorage.setItem("pdf_line_length",String(editorWrapper.length));
      sessionStorage.setItem("pdf_formatted_line_length",String(formattedLineLength));
    }
  }

  function selectList(list: object | undefined) {
    if (list) {
      const arr = []
      for (const item in list) {
        arr.push(item)
      }
      return arr;
    } else {
      return [""];
    }
  }

  function addVariable() {
    const lines = editorRef.current?.getMarkdown().split(/\n\n/g);
    const lineIndex = Number(sessionStorage.getItem("edit_pdf_line_selected")?.split("-")[1]);
    const wordIndex = Number(sessionStorage.getItem("edit_pdf_word_selected")?.split("-")[1]);
    const lineChildrenNumber = Number(sessionStorage.getItem(`edit_pdf_line_children_count`));
    
    if (lines) {
      const line = lines[lineIndex];
      let replacementLine = line;

      if (!line?.match(/^<u>[\s]*<\/u>$/) && !line?.match(/^[ ]*$/) && ![undefined, "&#x20;", "****&#x20;", "******&#x20;"]?.includes(line)) {
        if (lineChildrenNumber > 1 || line.split("\n")[0].match(/^\| ([\s\S]*?) \|$/g)) {

          const regexBoldUnderlineItalic = /(?:\*\*\*([\s\S]*?)\*\*\*|\*\*([\s\S]*?)\*\*|\*([\s\S]*?)\*|<u>([\s\S]*?)<\/u>|([^*]+)|<u>([^<]+)<\/u>)/g;
          const wordArr = line?.match(regexBoldUnderlineItalic);
          if (wordArr && wordArr.length != 0) {
            const replacementWord = specialCharVerification(wordArr, wordIndex);
            wordArr.splice(wordIndex, 1, replacementWord);
            replacementLine = wordArr.join("");
          }

        } else {
          replacementLine = specialCharVerification(lines, lineIndex);
        }
      } else {
        replacementLine = variable;
      }

      lines.splice(lineIndex, 1, replacementLine);
      const formattedLines = spaceVerification(lines);
      editorRef.current?.setMarkdown(formattedLines.join("\n\n"));

      setTimeout(()=>{
        //ATUALIZA O CACHE DAS LINHAS APÓS ADICIONAR AS VARIÁVEIS
        manipulateProseClass({ restoreIds: true });
        setEditorOpacity(1);
      },0)
    }
  }

  function specialCharVerification(arr: RegExpMatchArray | string[], arrIndex: number) {
    let specialCharNumber = 0;
    if (arr[arrIndex].includes("*")) {
      const boldNumber = arr[arrIndex]?.match(/\*/g)?.length;
      if (boldNumber) {
        specialCharNumber += boldNumber / 2;
      }
    }
    if (arr[arrIndex].includes("<u>")) {
      const underLineNumber = arr[arrIndex]?.match(/<u>|<\/u>/g)?.length;
      if (underLineNumber) {
        specialCharNumber += underLineNumber + 1;
      }
    }
    const startIndex = Number(sessionStorage.getItem("edit_pdf_start_index"));
    const modify = arr[arrIndex].replace(/[\\]/g, "").replace(/&#x20;/g, " ").split("").map((char, index, arr) => {
      if (startIndex - specialCharNumber === arr.length && index === arr.length - 1) {
        char = char + variable;
      } else if (index === startIndex + specialCharNumber) {
        char = variable + char;
      }
      return char;
    }).join("");
    return modify;
  }

  function spaceVerification(arr: string[]) {
    const newArr: string[] = [];
    arr.forEach((line) => {
      if (line.match(/^[ ]*$/)) {
        newArr.push("&#x20;");
      } else {
        newArr.push(line);
      }
    });
    return newArr;
  }

  function formSubmit() {
    manipulateProseClass({ restoreIds: true });
    let pdfLineLength = sessionStorage.getItem("pdf_line_length");
    for(let i = 0;i < Number(pdfLineLength);i++){
      const line = sessionStorage.getItem("pdf_line_"+i);
      var formattedLine = Mustache.render(line, signUpData);
      sessionStorage.setItem("pdf_formatted_line_"+i, formattedLine);
    }
    router.push("./view");
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-3">
      <h1>Editor de pdf:</h1>
      <div className="flex justify-between">
        <div>
          <select className="bg-slate-400 p-2 rounded-md me-2" onChange={(e) => setVariable(e.target.value)}>
            {selectList(signUpData).map((option) => {
              return <option key={option} value={`{{${option}}}`}>{option}</option>
            })}
          </select>
          <button onClick={() => { 
            setEditorOpacity(0);
            setTimeout(()=>{
              addVariable();
            },500)
          }} className="bg-slate-400 p-2 rounded-md" type="button">Adicionar Variável</button>
        </div>
        <button onClick={() => formSubmit()} type="button" className="bg-slate-400 p-2 rounded-md">Criar PDF</button>
      </div>
      <div
        style={{opacity: editorOpacity,transition:"0.3s"}} 
        onClick={(e:any)=>{
          setTimeout(()=>{
            const imageForm = document.body.getElementsByClassName("_multiFieldForm_lug8m_1101");
            if(imageForm[0]){
              sessionStorage.setItem("is_background_image","false")
              const imageInputs = imageForm[0].getElementsByClassName("_formField_lug8m_1107");

              const type = imageInputs[2].children[1].getAttribute("type");
              console.log(type)
              if(type != "checkbox"){
                imageInputs[2].children[1].insertAdjacentHTML("beforebegin",`<input type="checkbox" name="isBackgroundImage" />`)
              }

              const altLabel = imageInputs[2]?.children[0];
              const altInput = imageInputs[2]?.children[2] as any;
              const titleLabel = imageInputs[3]?.children[0];
              const titleInput = imageInputs[3]?.children[1];
              if(altLabel && altInput && titleLabel && titleInput){
                altLabel.textContent = "É uma imagem de fundo?";
                altInput.setAttribute("style","display:none;");
                titleLabel.setAttribute("style","display:none;")
                titleInput.setAttribute("style","display:none;")

                if(e.target.name == "isBackgroundImage"){
      
                  if(altInput.value == "on"){
                    altInput.value = "off";
                    sessionStorage.setItem("is_background_image","false");
                  }else{
                    altInput.value = "on";
                    sessionStorage.setItem("is_background_image","true");
                  }
                  
                }
              }
            }
          },0)

          if(["Left Align","Center Align","Right Align"].includes(e.target.title)){
            manipulateProseClass({ restoreIds: true });
          }

          const selection = window.getSelection();
          if (selection?.rangeCount) {
            manipulateProseClass({ restoreIds: true });

            let start = selection.getRangeAt(0).startOffset;
            sessionStorage.setItem("edit_pdf_start_index", start.toString())

            let targetElement: HTMLElement | null | undefined = null;
            let targetElementChild: HTMLElement | null | undefined = null;
            if (selection.anchorNode?.nodeName === "#text") {
              targetElement = selection.anchorNode.parentElement?.parentElement;
              targetElementChild = selection.anchorNode.parentElement
            } else {
              targetElement = selection.anchorNode as HTMLElement;
            }

            if (targetElement) {
              sessionStorage.setItem(`edit_pdf_line_selected`, targetElement.id);
              sessionStorage.setItem(`edit_pdf_line_children_count`, targetElement.children.length.toString());
            }
            const targetElementChildren = targetElement?.children;
            if (targetElementChildren) {
              for (let i = 0; i < targetElementChildren.length; i++) {
                targetElementChildren[i].id = "word-" + i;
              }
              if (targetElementChild) {
                sessionStorage.setItem(`edit_pdf_word_selected`, targetElementChild.id);
              }
            }

          }
        }}
      >
        <MDXEditor contentEditableClassName="prose" ref={editorRef} markdown={""}
          toMarkdownOptions={{handlers:{image:(e)=>{
            let alt = sessionStorage.getItem("is_background_image");
            if(alt != "true"){
              return `![false](${e.url})`;
            }else{
              return `![true](${e.url})`;
            }
          }}}}
          plugins={[imagePlugin({
            imageUploadHandler: async (image) => {
              let alt = sessionStorage.getItem("is_background_image");
              if(alt != "true"){
                // Função para converter uma imagem para base64
                const imageToBase64 = (file:any) => {
                  return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                  });
                };

                // Converta a imagem para base64
                const base64String = await imageToBase64(image) as string;

                // Retorne a string base64
                return Promise.resolve(base64String);
              }else{
                // Retorne nada pois é uma imagem de fundo
                return Promise.resolve("");
              }
            },
          }),
          headingsPlugin(),
          toolbarPlugin({
            toolbarContents: () => (<><UndoRedo /><BlockTypeSelect /><BoldItalicUnderlineToggles />
            <AlignLeftButton /><AlignCenterButton /><AlignRightButton /><InsertImage /></>)
          })]}
        />
      </div>
    </div>
  );
}

export default EditPdf;
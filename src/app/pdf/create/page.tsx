"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
const Mustache = require('mustache');

import '@mdxeditor/editor/style.css'
import { MDXEditor, headingsPlugin, MDXEditorMethods, BlockTypeSelect, CodeToggle,UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, InsertImage, imagePlugin } from "@mdxeditor/editor";
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

      const currentImageTitle = sessionStorage.getItem("pdf_current_image_title");
      if(currentImageTitle){
        const img = document.querySelectorAll(`.prose img[title="${currentImageTitle}"]`)[0];

        let width = sessionStorage.getItem("pdf_current_image_width");
        let height = sessionStorage.getItem("pdf_current_image_height");
        if(img && width && height){
          img.setAttribute("width",width);
          img.setAttribute("height",height);
          img.setAttribute("style",`height: ${height}px; width: ${width}px;`)
          sessionStorage.removeItem("pdf_current_image_width");
          sessionStorage.removeItem("pdf_current_image_height");
          sessionStorage.removeItem("pdf_current_image_title");
        }
      }

      const editorWrapper = document.querySelectorAll(".prose p, .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6") as any;
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
          sessionStorage.setItem("pdf_line_"+i,content[i]);
        }else{
          sessionStorage.setItem("pdf_line_"+i,"&#x20;");
        }
        formattedLineLength++;
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
    const letterIndex = Number(sessionStorage.getItem("edit_pdf_start_index"));
    
    if (lines) {
      const line = lines[lineIndex];
      let replacementLine = line;
      const regexBoldUnderlineItalic = /(\*\*\*[\s\S]*?\*\*\*)|(\*\*[\s\S]*?\*\*)|(\*[\s\S]*?\*)|(<u>[\s\S]*<\/u>)|(<img[^>]*\ssrc="[^"]*"\s*\/>)|([\s\S]?)/g;
      let dbWordIndex = 0;
      let dbLetterIndex = 0;
      let lastIsLetter = false;
      let isPaste = false;
      let newLine:string[] = [];

      line?.replace("&#x20;","").replace(/^#{0,6} /,"").replace(/[\\]/g,"").replace(regexBoldUnderlineItalic, (match, p1, p2, p3, p4, p5, p6) => {
          if(p1){
            let ajuste = 3;
            if(lastIsLetter){
              dbLetterIndex = 0;
              lastIsLetter = false;
              dbWordIndex++;
            }
            const letterArr = p1.split("");
            if(dbWordIndex == wordIndex){
              if(letterIndex == letterArr.length - 6){
                ajuste = 6;
              }
              letterArr.splice(letterIndex+ajuste,0," `"+variable+"` ");
              isPaste = true;
            }
            
            dbWordIndex++;
            newLine.push(letterArr.join(""));;
          }
          if(p2){
            let ajuste = 2;
            if(lastIsLetter){
              dbLetterIndex = 0;
              lastIsLetter = false;
              dbWordIndex++;
            }
            const letterArr = p2.split("");
            if(dbWordIndex == wordIndex){
              if(letterIndex == letterArr.length - 4){
                ajuste = 4;
              }
              letterArr.splice(letterIndex+ajuste,0," `"+variable+"` ");
              isPaste = true;
            }
            
            dbWordIndex++;
            newLine.push(letterArr.join(""));
          }
          if(p3){
            let ajuste = 1;
            if(lastIsLetter){
              dbLetterIndex = 0;
              lastIsLetter = false;
              dbWordIndex++;
            }
            const letterArr = p3.split("");
            if(dbWordIndex == wordIndex){
              if(letterIndex == letterArr.length - 2){
                ajuste = 2;
              }
              letterArr.splice(letterIndex+ajuste,0," `"+variable+"` ");
              isPaste = true;
            }
            
            dbWordIndex++;
            newLine.push(letterArr.join(""));;
          }
          if(p5){
            if(lastIsLetter){
              dbLetterIndex = 0;
              lastIsLetter = false;
              dbWordIndex++;
            }
            if(dbWordIndex == wordIndex){
              newLine.push(p5+" `"+variable+"` ")
              isPaste = true;
            }else{
              newLine.push(p5)
            }
            dbWordIndex++;
          }
          if(p6){
            if(dbLetterIndex == letterIndex && !lastIsLetter && dbWordIndex == wordIndex){
              newLine.push(" `"+variable+"` "+p6);
              isPaste = true;
              console.log("primeiro")
            }else if(dbLetterIndex == letterIndex - 1 && dbWordIndex == wordIndex){
              newLine.push(p6+" `"+variable+"` ");
              isPaste = true;
            }else{
              newLine.push(p6);
            }

            dbLetterIndex++;
            lastIsLetter = true;
          }
          return match;
      });

      if(!isPaste){
        newLine.push(" `"+variable+"` ");
      }
      console.log(newLine)
        replacementLine = newLine.join("");
             
      const correspondencias = line?.match(/^#{0,6}/);

      let hashtagsRemovidas = "";
      
      if (correspondencias && correspondencias[0]) {
        hashtagsRemovidas = correspondencias[0]+" ";
      }

      lines.splice(lineIndex, 1, hashtagsRemovidas+replacementLine);
      const formattedLines = spaceVerification(lines);
      editorRef.current?.setMarkdown(formattedLines.join("\n\n"));

      setTimeout(()=>{
        //ATUALIZA O CACHE DAS LINHAS APÓS ADICIONAR AS VARIÁVEIS
        manipulateProseClass({ restoreIds: true });
        setEditorOpacity(1);
      },0)
    }
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
      if(line){
        var formattedLine = Mustache.render(line.replace(/`([^`]+)`/g, '$1'), signUpData);
        sessionStorage.setItem("pdf_formatted_line_"+i, formattedLine);
      }
    }
    router.push("./view");
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-3">
      <h1>Editor de pdf:</h1>
      <div className="flex justify-between">
        <div>
          <select defaultValue="default" className="bg-slate-400 p-2 rounded-md me-2" onChange={(e) => setVariable(e.target.value)}>
            <option disabled value="default">-- Escolha uma opção --</option>
            {selectList(signUpData).map((option) => {
              return <option key={option} value={`{{${option}}}`}>{option}</option>
            })}
          </select>
          <button onClick={() => { 
            if(variable != ""){
              setEditorOpacity(0);
              setTimeout(()=>{
                addVariable();
              },500)
            }
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
              
              if(type != "checkbox"){
                imageInputs[2].children[1].insertAdjacentHTML("beforebegin",`<input type="checkbox" name="isBackgroundImage" />`)
                imageInputs[3].insertAdjacentHTML("afterbegin",`<input required name="image-height" type="number" />`)
                imageInputs[3].insertAdjacentHTML("afterbegin",`<label for="image-height">Qual a altura da imagem?</label>`)
                imageInputs[3].insertAdjacentHTML("afterbegin",`<input required name="image-width" type="number" />`)
                imageInputs[3].insertAdjacentHTML("afterbegin",`<label for="image-width">Qual a largura da imagem?</label>`)
              }
              
              const altLabel = imageInputs[2]?.children[0];
              const altInput = imageInputs[2]?.children[2] as any;
              const widthInput = imageInputs[3]?.children[1] as any;
              const heightInput = imageInputs[3]?.children[3] as any;
              const titleLabel = imageInputs[3]?.children[4];
              const titleInput = imageInputs[3]?.children[5];
              if(altLabel && altInput && titleLabel && titleInput){
                altLabel.textContent = "É uma imagem de fundo?";
                altInput.setAttribute("style","display:none;");
                titleLabel.textContent = "Identificador da imagem? *";
                titleInput.setAttribute("required","true");
                titleInput.setAttribute("maxLength","10");

                if(altInput.value == "on"){
                  if(widthInput && heightInput){
                    sessionStorage.setItem("pdf_current_background_image_width",widthInput.value);
                    sessionStorage.setItem("pdf_current_background_image_height",heightInput.value);
                  }
                }else{
                  if(widthInput && heightInput){
                    sessionStorage.setItem("pdf_current_image_width",widthInput.value);
                    sessionStorage.setItem("pdf_current_image_height",heightInput.value);
                  }
                }

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
              const t = selection.anchorNode.parentElement?.parentElement;
              console.log(t?.nodeName)
              if(t?.nodeName == "CODE"){
                targetElement = selection.anchorNode.parentElement?.parentElement?.parentElement;
              }else{
                targetElement = selection.anchorNode.parentElement?.parentElement;
              }
              targetElementChild = selection.anchorNode.parentElement
            } else {
              targetElement = selection.anchorNode as HTMLElement;
            }
            console.log(selection.anchorNode?.nodeName)
            console.log(targetElement)
            if (targetElement) {
              sessionStorage.setItem(`edit_pdf_line_selected`, targetElement.id);
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
          toMarkdownOptions={{handlers:{
            image:(e)=>{
              sessionStorage.setItem("pdf_current_image_title",e.title);
              let width = sessionStorage.getItem("pdf_current_image_width");
              let height = sessionStorage.getItem("pdf_current_image_height");
              setTimeout(()=>{
                manipulateProseClass({ restoreIds: true });
              },600)
              return `<img height="${height}" width="${width}" src="${e.url}" />`;
            }
          }}}
          plugins={[imagePlugin({
            imageUploadHandler: async (image) => {
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
            },
          }),
          headingsPlugin(),
          toolbarPlugin({
            toolbarContents: () => (<><UndoRedo /><BlockTypeSelect /><BoldItalicUnderlineToggles />
            <CodeToggle /><AlignLeftButton /><AlignCenterButton /><AlignRightButton /><InsertImage /></>)
          })]}
        />
      </div>
    </div>
  );
}

export default EditPdf;
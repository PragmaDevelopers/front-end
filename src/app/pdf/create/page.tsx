"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
const Mustache = require('mustache');

import '@mdxeditor/editor/style.css'
import { MDXEditor, headingsPlugin, MDXEditorMethods, BlockTypeSelect, CodeToggle, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, InsertImage, imagePlugin } from "@mdxeditor/editor";
import { IFormSignUpInputs } from "@/app/types/RegisterClientFormTypes";
import { AlignLeftButton, AlignCenterButton, AlignRightButton } from "@/app/components/PDFEditor/AlignButtons";
import { useUserContext } from "@/app/contexts/userContext";
import { API_BASE_URL } from "@/app/utils/variables";
import ClientPdfTemplateHandle from "@/app/components/PDFEditor/ClientTemplateModal";
import BackgroundImageModal from "@/app/components/PDFEditor/BackgroundModal";
import { usePdfEditorContext } from "@/app/contexts/pdfEditorContext";
import PdfEditorTemplateModal from "@/app/components/PDFEditor/PdfEditorTemplateModal";
import { set } from "zod";
import { EditorLine } from "@/app/types/PdfEditorTypes";
import { CustomModal } from "@/app/components/ui/CustomModal";
import { useModalContext } from "@/app/contexts/modalContext";

function EditPdf() {
	const [variable, setVariable] = useState<string>("");
	const [editorOpacity, setEditorOpacity] = useState<number>(1);

	const router = useRouter();
	const editorRef = useRef<MDXEditorMethods>(null)

	const [clientTemplateList, setClientTemplateList] = useState<{
        id: number,
        name: string,
        template: any[]
    }[]>([]);

	const [pdfEditorTemplateList, setPdfEditorTemplateList] = useState<{
        id: number,
        name: string,
        template: any[]
    }[]>([]);

	const [selectedClientModal, setSelectedClientModal] = useState<boolean>(false);
    const [backgroundImageModal, setBackgroundImageModal] = useState<boolean>(false);
	const [useDraftModal,setUseDraftModal] = useState<boolean>(false);

	const { userValue } = useUserContext();
	const modalContextProps = useModalContext();
	const { editorLines, setEditorLines, setBackupPdfEditorTemplate, currentClientTemplate, setCurrentClientTemplate } = usePdfEditorContext();

	const returnToHome = () => {
		router.push("/");
	}

	useEffect(() => {
		if (userValue.token === "") {
			returnToHome();
		}
	}, [userValue, router]);

	useEffect(() => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${userValue.token}`,
			}
		};
		fetch(`${API_BASE_URL}/api/private/user/signup/client/templates?value=true`, requestOptions)
		.then(response => response.json()).then((clientTemplates: any) => {
			setClientTemplateList(clientTemplates)
		})
		fetch(`${API_BASE_URL}/api/private/user/signup/pdfEditor/templates`, requestOptions)
		.then(response => response.json()).then((pdfEditorTemplates: any) => {
			setPdfEditorTemplateList(pdfEditorTemplates);
		})
	}, [])

	useEffect(()=>{
		const lines = editorLines.lines.map(line=>line.value);
		editorRef.current?.setMarkdown(lines.join("\n\n"));
	},[editorLines]);

	function manipulateProseClass({ restoreIds, submit,noUpdate }: { noUpdate?:boolean,restoreIds?: boolean,submit?:boolean }) {
		if (restoreIds) {
			const editorWrapper = document.querySelectorAll(".prose:not(._placeholder_lug8m_993) p, .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6") as any;
			const newLines = [];
			for (let i = 0; i < editorWrapper.length; i++) {
				editorWrapper[i].id = "line-" + i;
				const lineStyle = editorLines.lines[i]?.style || "left";
				editorWrapper[i].style.textAlign = lineStyle;
			
				const content = editorRef.current?.getMarkdown().split(/\n\n/g);
				if (content && content[i]) {
					newLines.push({value:content[i],style:lineStyle});
				} else if (content && content[i] == "") {
					newLines.push({value:"&#x20;",style:lineStyle});;
				}
			}
			if(noUpdate == undefined){
				setEditorLines({...editorLines,lines:newLines});
			}
		}
		if(submit){
			const formattedLines = editorLines.lines.map((line)=>{
				if (line.value.replace(/&#x20;/g, '').trim().length > 0) {
					// Remove "&#x20;" e "\" da string
					line.value = line.value.replace(/&#x20;|\\/g, '');
				}
				line.value = Mustache.render(line.value, currentClientTemplate);
				return line;
			});
			setBackupPdfEditorTemplate(formattedLines);
			router.push("./view");
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
		const lineIndex = editorLines.selectedLineIndex;
		const wordIndex = editorLines.selectedWordIndex;
		const letterIndex = editorLines.selectedLetterIndex;
	
		if (lines) {
			const line = lines[lineIndex];
			let replacementLine = line;
			const regexBoldUnderlineItalic = /(\*\*\*[\s\S]*?\*\*\*)|(\*\*[\s\S]*?\*\*)|(\*[\s\S]*?\*)|(<u>[\s\S]*<\/u>)|(<img[^>]*\ssrc="[^"]*"\s*\/>)|([\s\S]?)/g;
			let dbWordIndex = 0;
			let dbLetterIndex = 0;
			let lastIsLetter = false;
			let isPaste = false;
			let newLine: string[] = [];
	
			line?.replace("&#x20;", "").replace(/^#{0,6} /, "").replace(/[\\]/g, "").replace(regexBoldUnderlineItalic, (match, p1, p2, p3, p4, p5, p6,index) => {
				const isLastMatch = index === line.length;
				if (p1) {
					if (lastIsLetter) {
						dbLetterIndex = 0;
						lastIsLetter = false;
						dbWordIndex++;
					}
					const letterArr = p1.replace(/\*\*\*([\s\S]*)\*\*\*/,"$1").split("")
					if (dbWordIndex == wordIndex) {
						letterArr.splice(letterIndex, 0, "&#x20;" + variable + "&#x20;");
						isPaste = true;
					}
					dbWordIndex++;
					newLine.push("***"+letterArr.join("")+"***");
					if(isLastMatch && isPaste){
						newLine.push("&#x20;");
					}
				}
				if (p2) {
					if (lastIsLetter) {
						dbLetterIndex = 0;
						lastIsLetter = false;
						dbWordIndex++;
					}
					const letterArr = p2.replace(/\*\*([\s\S]*)\*\*/,"$1").split("");
					if (dbWordIndex == wordIndex) {
						letterArr.splice(letterIndex, 0, "&#x20;" + variable + "&#x20;");
						isPaste = true;
					}
					dbWordIndex++;
					newLine.push("**"+letterArr.join("")+"**");
					if(isLastMatch && isPaste){
						newLine.push("&#x20;");
					}
				}
				if (p3) {
					if (lastIsLetter) {
						dbLetterIndex = 0;
						lastIsLetter = false;
						dbWordIndex++;
					}
					const letterArr = p3.replace(/\*([\s\S]*)\*/,"$1").split("");
					if (dbWordIndex == wordIndex) {
						letterArr.splice(letterIndex, 0, "&#x20;" + variable + "&#x20;");
						isPaste = true;
					}
					dbWordIndex++;
					newLine.push("*"+letterArr.join("")+"*");
					if(isLastMatch && isPaste){
						newLine.push("&#x20;");
					}
				}
				if(p4){
					if (lastIsLetter) {
						dbLetterIndex = 0;
						lastIsLetter = false;
						dbWordIndex++;
					}
					const letterArr = p4.replace(/<u>([\s\S]*)<\/u>/,"$1").split("");
					if (dbWordIndex == wordIndex) {
						letterArr.splice(letterIndex, 0, "&#x20;" + variable + "&#x20;");
						isPaste = true;
					}
					dbWordIndex++;
					newLine.push("<u>"+letterArr.join("")+"</u>");
					if(isLastMatch && isPaste){
						newLine.push("&#x20;");
					}
				}
				if (p5) {
					if (lastIsLetter) {
						dbLetterIndex = 0;
						lastIsLetter = false;
						dbWordIndex++;
					}
					if (dbWordIndex == wordIndex) {
						if(letterIndex == 0){
							newLine.push("&#x20;"+variable+"&#x20;"+p5);
						}else if(letterIndex == 1){
							newLine.push(p5+"&#x20;"+variable+"&#x20;");
						}
						isPaste = true;
					} else {
						newLine.push(p5)
					}
					dbWordIndex++;
				}
				if (p6) {
					if (dbLetterIndex == letterIndex && !lastIsLetter && dbWordIndex == wordIndex) {
						newLine.push("&#x20;"+variable+"&#x20;"+p6);
						isPaste = true;
					} else if (dbLetterIndex == letterIndex - 1 && dbWordIndex == wordIndex) {
						newLine.push(p6+"&#x20;"+variable+"&#x20;");
						isPaste = true;
					} else {
						newLine.push(p6);
					}
					dbLetterIndex++;
					lastIsLetter = true;
					if(isLastMatch && isPaste){
						newLine.push("&#x20;");
					}
				}
				return match;
			});
	
			if (!isPaste) {
				newLine.push("&#x20;");
				newLine.push(variable);
				newLine.push("&#x20;");
			}
			replacementLine = newLine.join("");
	
			const correspondencias = line?.match(/^#{0,6}/);
			let hashtagsRemovidas = "";
	
			if (correspondencias && correspondencias[0]) {
				hashtagsRemovidas = correspondencias[0] + " ";
			}
	
			lines.splice(lineIndex, 1, hashtagsRemovidas + replacementLine);
			const formattedLines = spaceVerification(lines);
			editorRef.current?.setMarkdown(formattedLines.join("\n\n"));
	
			setTimeout(() => {
				manipulateProseClass({ restoreIds: true });
				setEditorOpacity(1);
			}, 0);
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

	return (
		<div className="w-full h-full overflow-auto flex justify-center items-start bg-neutral-100">
			<CustomModal description={modalContextProps.modalDescription} focusRef={modalContextProps.modalFocusRef} 
                isOpen={modalContextProps.modalOpen} options={modalContextProps.modalOptions} 
                setIsOpen={modalContextProps.setModalOpen} text={modalContextProps.modalText} title={modalContextProps.modalTitle} borderColor={modalContextProps.modalBorderColor} 
            />
			<div className="p-3 w-full max-w-4xl">
				<div className="flex flex-col gap-3 justify-center rounded-md">
					<div className="flex gap-3 items-center rounded-md">
						<button className="bg-neutral-50 drop-shadow rounded-md p-2" onClick={() => {
							setSelectedClientModal(!selectedClientModal);
							setUseDraftModal(false);
							setBackgroundImageModal(false);
						}} type="button">Cliente</button>
						<select defaultValue="" onChange={(e) => setVariable(e.target.value)}>
							<option disabled value=""> -- Escolha uma opção -- </option>
							{selectList(currentClientTemplate).map((option) => {
								return <option key={option} value={`{{${option}}}`}>{option}</option>
							})}
						</select>
						<button onClick={() => {
							if (variable != "") {
								setEditorOpacity(0);
								setTimeout(() => {
									addVariable();
								}, 500)
							}
						}} className="bg-neutral-50 drop-shadow rounded-md p-2" type="button">Adicionar Variável</button>
					</div>
					<div className="flex gap-3 items-center justify-between rounded-md">
						<div className="flex gap-3 items-center rounded-md">
							<button className="bg-neutral-50 drop-shadow rounded-md p-2" onClick={() => {
								setBackgroundImageModal(!backgroundImageModal);
								setUseDraftModal(false);
								setSelectedClientModal(false);
							}} type="button">Papel timbrado/Margin</button>
							<button className="bg-neutral-50 drop-shadow rounded-md p-2" onClick={() => {
								setUseDraftModal(!useDraftModal);
								setBackgroundImageModal(false);
								setSelectedClientModal(false);
							}} type="button">Rascunhos</button>
						</div>
						<button onClick={() => manipulateProseClass({restoreIds:true,submit:true})} type="button" className="bg-neutral-50 drop-shadow rounded-md p-2">Criar PDF</button>
					</div>
				</div>
				<div className="flex gap-5">
					{
						selectedClientModal && <ClientPdfTemplateHandle
							setTemplateList={setClientTemplateList} templateList={clientTemplateList}
							currentTemplate={currentClientTemplate} setCurrentTemplate={setCurrentClientTemplate}
						/>
					}
					{
						backgroundImageModal && <BackgroundImageModal />
					}
					{
						useDraftModal && <PdfEditorTemplateModal currentTemplate={editorLines} 
						setCurrentTemplate={setEditorLines} setTemplateList={setPdfEditorTemplateList} templateList={pdfEditorTemplateList}  />
					}
				</div>
				<div
					className="relative mt-3"
					style={{ opacity: editorOpacity, transition: "0.3s" }}
					onClick={(e: any) => {
						const form = document.getElementsByClassName("_multiFieldForm_lug8m_1101");

						if (["Left Align", "Center Align", "Right Align"].includes(e.target.title) && form.length == 0) {
							manipulateProseClass({ restoreIds: true });
						}

						const selection = window.getSelection();
						if (selection?.rangeCount && form.length == 0) {
							manipulateProseClass({ restoreIds: true });

							const newEditorLines = editorLines;

							let start = selection.getRangeAt(0).startOffset;
							newEditorLines.selectedLetterIndex = start;
							setEditorLines(newEditorLines);

							let targetElement: HTMLElement | null | undefined = null;
							let targetElementChild: HTMLElement | null | undefined = null;
							if (selection.anchorNode?.nodeName === "#text") {
								const t = selection.anchorNode.parentElement?.parentElement;
								if (t?.nodeName == "CODE") {
									targetElement = selection.anchorNode.parentElement?.parentElement?.parentElement;
								} else {
									targetElement = selection.anchorNode.parentElement?.parentElement;
								}
								targetElementChild = selection.anchorNode.parentElement
							} else {
								targetElement = selection.anchorNode as HTMLElement;
							}

							if (targetElement) {
								const lineIndex = Number(targetElement.id.split("-")[1]);
								console.log(lineIndex)
								newEditorLines.selectedLineIndex = lineIndex;
								setEditorLines(newEditorLines);
							}
							
							const targetElementChildren = targetElement?.children;
							if (targetElementChildren) {
								for (let i = 0; i < targetElementChildren.length; i++) {
									targetElementChildren[i].id = "word-" + i;
								}
								if (targetElementChild) {
									const wordIndex = Number(targetElementChild.id.split("-")[1]);
									newEditorLines.selectedWordIndex = wordIndex;
									setEditorLines(newEditorLines);
								}
							}
						}
					}}
				>
					<MDXEditor onChange={()=>{manipulateProseClass({restoreIds:true,noUpdate:false})}} onBlur={()=>manipulateProseClass({restoreIds:true})} contentEditableClassName="prose" 
					ref={editorRef} markdown={""}
						toMarkdownOptions={{
							handlers: {
								image: (e) => {
									return `<img height="{{height}}" width="{{width}}" src="${e.url}" />`;
								}
							}
						}}
						plugins={[imagePlugin({
							imageUploadHandler: async (image) => {
								// Função para converter uma imagem para base64
								const imageToBase64 = (file: any) => {
									return new Promise((resolve, reject) => {
										const reader = new FileReader();
										reader.onload = () => resolve(reader.result);
										reader.onerror = (error) => reject(error);
										reader.readAsDataURL(file);
									});
								};

								// Converta a imagem para base64
								const base64String = await imageToBase64(image) as string;

								const img = new Image();
								img.src = base64String;

								img.onload = () => {
									const width = img.width;
									const height = img.height;

									const lines = editorRef.current?.getMarkdown().split(/\n\n/g);
									const lineIndex = editorLines.selectedLineIndex || 0;
									if (lines) {
										const newLine = lines[lineIndex].replace('{{height}}', height.toString()).replace('{{width}}', width.toString());
										lines.splice(lineIndex, 1, newLine);
										editorRef.current?.setMarkdown(lines.join("\n\n"));
									}

									setTimeout(() => {
										manipulateProseClass({ restoreIds: true });
									}, 0)
								};

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
		</div>
	);
}

export default EditPdf;
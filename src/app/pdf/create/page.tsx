"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

function EditPdf() {
	const [variable, setVariable] = useState<string>("");
	const [editorOpacity, setEditorOpacity] = useState<number>(1);
	const [isLoadImage, setisLoadImage] = useState<boolean>(false)

	const router = useRouter();
	const editorRef = useRef<MDXEditorMethods>(null)

	const [templateList, setTemplateList] = useState<{
        id: number,
        name: string,
        template: any[]
    }[]>([]);

	const [currentTemplate, setCurrentTemplate] = useState<{} | "">("");

	const [selectedClientModal, setSelectedClientModal] = useState<boolean>(false);
    const [backgroundImageModal, setBackgroundImageModal] = useState<boolean>(false);

	const { userValue } = useUserContext();
	const { editorLines, setEditorLines,backgroundImage,setBackgroundImage } = usePdfEditorContext();

	const returnToHome = () => {
		router.push("/");
	}

	useEffect(() => {
		if (userValue.token === "") {
			returnToHome();
		}
	}, [userValue, router]);

	useEffect(() => {

		if (userValue.token === "") {
			returnToHome();
		}

		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${userValue.token}`,
			}
		};
		fetch(`${API_BASE_URL}/api/private/user/signup/client/templates?value=true`, requestOptions)
		.then(response => response.json()).then((clientTemplates: any) => {
			setTemplateList(clientTemplates)
		})

		if(editorLines.lines.length > 0){
			const values = editorLines.lines.map(line=>line.value);
			editorRef.current?.setMarkdown(values.join("\n\n"));
		}
	}, [])

	function manipulateProseClass({ restoreIds, submit }: { restoreIds?: boolean,submit?:boolean }) {
		const newEditorLines = editorLines;
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
			newEditorLines.lines = newLines;
			setEditorLines(newEditorLines);
		}
		if(submit){
			const formattedLines = newEditorLines.lines.map((line)=>{
				line.value = Mustache.render(line.value.replace(/`([^`]+)`/g, '$1'), currentTemplate);
				return line;
			});
			newEditorLines.formattedLines = formattedLines;
			setEditorLines(newEditorLines);

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

			line?.replace("&#x20;", "").replace(/^#{0,6} /, "").replace(/[\\]/g, "").replace(regexBoldUnderlineItalic, (match, p1, p2, p3, p4, p5, p6) => {
				if (p1) {
					let ajuste = 3;
					if (lastIsLetter) {
						dbLetterIndex = 0;
						lastIsLetter = false;
						dbWordIndex++;
					}
					const letterArr = p1.split("");
					if (dbWordIndex == wordIndex) {
						if (letterIndex == letterArr.length - 6) {
							ajuste = 6;
						}
						letterArr.splice(letterIndex + ajuste, 0, " `" + variable + "` ");
						isPaste = true;
					}

					dbWordIndex++;
					newLine.push(letterArr.join(""));;
				}
				if (p2) {
					let ajuste = 2;
					if (lastIsLetter) {
						dbLetterIndex = 0;
						lastIsLetter = false;
						dbWordIndex++;
					}
					const letterArr = p2.split("");
					if (dbWordIndex == wordIndex) {
						if (letterIndex == letterArr.length - 4) {
							ajuste = 4;
						}
						letterArr.splice(letterIndex + ajuste, 0, " `" + variable + "` ");
						isPaste = true;
					}

					dbWordIndex++;
					newLine.push(letterArr.join(""));
				}
				if (p3) {
					let ajuste = 1;
					if (lastIsLetter) {
						dbLetterIndex = 0;
						lastIsLetter = false;
						dbWordIndex++;
					}
					const letterArr = p3.split("");
					if (dbWordIndex == wordIndex) {
						if (letterIndex == letterArr.length - 2) {
							ajuste = 2;
						}
						letterArr.splice(letterIndex + ajuste, 0, " `" + variable + "` ");
						isPaste = true;
					}

					dbWordIndex++;
					newLine.push(letterArr.join(""));;
				}
				if (p5) {
					if (lastIsLetter) {
						dbLetterIndex = 0;
						lastIsLetter = false;
						dbWordIndex++;
					}
					if (dbWordIndex == wordIndex) {
						newLine.push(p5 + " `" + variable + "` ")
						isPaste = true;
					} else {
						newLine.push(p5)
					}
					dbWordIndex++;
				}
				if (p6) {
					if (dbLetterIndex == letterIndex && !lastIsLetter && dbWordIndex == wordIndex) {
						newLine.push(" `" + variable + "` " + p6);
						isPaste = true;
					} else if (dbLetterIndex == letterIndex - 1 && dbWordIndex == wordIndex) {
						newLine.push(p6 + " `" + variable + "` ");
						isPaste = true;
					} else {
						newLine.push(p6);
					}

					dbLetterIndex++;
					lastIsLetter = true;
				}
				return match;
			});

			if (!isPaste) {
				newLine.push(" `" + variable + "` ");
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
				//ATUALIZA O CACHE DAS LINHAS APÓS ADICIONAR AS VARIÁVEIS
				manipulateProseClass({ restoreIds: true });
				setEditorOpacity(1);
			}, 0)
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

	async function imageParseBase64(image:File,isBackgroundImage?:boolean){
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
			const lineIndex = editorLines.selectedLineIndex;

			if (lines) {
				const newLine = Mustache.render(lines[lineIndex], {
					width,
					height
				});
				lines.splice(lineIndex, 1, newLine);
				editorRef.current?.setMarkdown(lines.join("\n\n"));
			}

			setTimeout(() => {
				manipulateProseClass({ restoreIds: true });
			}, 0)

			setisLoadImage(false);
		};

		if(isBackgroundImage){
			setBackgroundImage({...backgroundImage,url:base64String});
			setBackgroundImageModal(true);
			setSelectedClientModal(false);
		}

		// Retorne a string base64
		return Promise.resolve(base64String);
	}

	return (
		<div className="w-full h-full overflow-auto flex justify-center items-start bg-neutral-100">
			<div className="p-3 w-full max-w-4xl">
				<div className="flex justify-between items-center">
					<div className="flex gap-3 items-center rounded-md p-2">
						<button className="bg-neutral-50 drop-shadow rounded-md p-2" onClick={() => {
							setSelectedClientModal(!selectedClientModal);
							setBackgroundImageModal(false);
						}} type="button">Cliente</button>
						{currentTemplate != "" && (
							<>
								<select defaultValue="" className="mx-2" onChange={(e) => setVariable(e.target.value)}>
									<option disabled value=""> -- Escolha uma opção -- </option>
									{selectList(currentTemplate).map((option) => {
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
							</>
						)}
						<button className="bg-neutral-50 drop-shadow rounded-md p-2" onClick={() => {
							setBackgroundImageModal(!backgroundImageModal);
							setSelectedClientModal(false);
						}} type="button">Papel timbrado</button>
					</div>
					<button onClick={() => manipulateProseClass({restoreIds:true,submit:true})} type="button" className="bg-neutral-50 drop-shadow rounded-md p-2">Criar PDF</button>
				</div>
				<div className="flex gap-5">
					{
						selectedClientModal && <ClientPdfTemplateHandle
							setTemplateList={setTemplateList} templateList={templateList}
							currentTemplate={currentTemplate} setCurrentTemplate={setCurrentTemplate}
						/>
					}
					{
						backgroundImageModal && <BackgroundImageModal />
					}
				</div>
				<div
					className="relative mt-3"
					style={{ opacity: editorOpacity, transition: "0.3s" }}
					onClick={(e: any) => {
						setTimeout(() => {
							const imageForm = document.body.getElementsByClassName("_multiFieldForm_lug8m_1101");
							if (imageForm[0]) {
								setisLoadImage(true);
								const imageInputs = imageForm[0].getElementsByClassName("_formField_lug8m_1107");
								const type = imageInputs[2].children[1].getAttribute("type");

								if (type != "checkbox") {
									imageInputs[2].children[1].insertAdjacentHTML("beforebegin", `<input type="checkbox" name="isBackgroundImage" />`)
								}

								const fileInput = imageInputs[0].children[1] as any;
								const urlLabel = imageInputs[1].children[0];
								const urlInput = imageInputs[1].children[1];
								const altLabel = imageInputs[2]?.children[0];
								const altInput = imageInputs[2]?.children[2] as any;
								const titleLabel = imageInputs[3]?.children[0];
								const titleInput = imageInputs[3]?.children[1];
								if (altLabel && altInput && titleLabel && titleInput) {
									altLabel.textContent = "É uma imagem de fundo?";
									altInput.setAttribute("style", "display:none;");
									titleLabel.setAttribute("style", "display:none;");
									titleInput.setAttribute("style", "display:none;");
									urlLabel.setAttribute("style", "display:none;");
									urlInput.setAttribute("style", "display:none;");
									if (e.target.name == "isBackgroundImage") {

										if (altInput.value == "on") {
											altInput.value = "off";
										} else {
											altInput.value = "on";
											const confirmBtn = imageForm[0].getElementsByClassName("_primaryButton_lug8m_453")[0];
											confirmBtn.setAttribute("type", "button");
										}

									}

									if (e.target.title == "Save" && altInput.value == "on") {
										document.getElementsByClassName("_dialogContent_lug8m_543")[0].setAttribute("style", "display:none;");
										document.getElementsByClassName("_dialogOverlay_lug8m_787")[0].setAttribute("style", "display:none;");
										imageParseBase64(fileInput.files[0],true);
									}
								}
							}
						}, 0)

						if (["Left Align", "Center Align", "Right Align"].includes(e.target.title) && !isLoadImage) {
							manipulateProseClass({ restoreIds: true });
						}

						const selection = window.getSelection();
						if (selection?.rangeCount && !isLoadImage) {
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
					<MDXEditor onChange={()=>manipulateProseClass({restoreIds:true})} contentEditableClassName="prose" 
					ref={editorRef} markdown={""}
						toMarkdownOptions={{
							handlers: {
								image: (e) => {
									return `<img height="{{height}}" width="{{width}}" title="${e.title}" src="${e.url}" />`;
								}
							}
						}}
						plugins={[imagePlugin({
							imageUploadHandler: async (image) => {
								return await imageParseBase64(image);
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
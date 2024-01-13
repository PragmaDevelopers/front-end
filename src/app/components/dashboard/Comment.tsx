"use client";

import {  SystemID, Comment, User } from "@/app/types/KanbanTypes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { BACKEND_DATE_FORMAT } from "@/app/utils/variables";
import { CommentEntryProps } from "@/app/interfaces/KanbanInterfaces";
import { useKanbanContext } from "@/app/contexts/kanbanContext";
import { useUserContext } from "@/app/contexts/userContext";

dayjs.locale('pt-br');
dayjs.extend(relativeTime);

interface IconsProps {
    className?: string
}

function PencilSquareIcon(props: IconsProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={props.className !== "" ? props.className : "w-5 h-5"}>
            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
        </svg>
    );
}

function XCircleIcon(props: IconsProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={props.className !== "" ? props.className : "w-5 h-5"}>
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
        </svg>
    );
}

function ChatBubbleLeftEllipsisIcon(props: IconsProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={props.className !== "" ? props.className : "w-5 h-5"}>
            <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
    );
}

// function CommentEntry(props: CommentEntryProps) {
//     const { content, user, answers, date, edited, id, setIsAnswering, removeCurrentComment, editComment } = props;
//     const currDate = dayjs();
//     const sinceDate: string = currDate.to(dayjs(date, BACKEND_DATE_FORMAT));

//     let currComment: Comment = {
//         answers: answers,
//         content: content,
//         date: date,
//         edited: edited,
//         id: id,
//         user: user
//     }

//     const renderAnswers = (answers: Comment[]): JSX.Element[] => {
//         return answers.map((element: Comment, index: number) => (
//             <CommentEntry
//                 answers={element.answers}
//                 content={element.content}
//                 date={element.date}
//                 edited={element.edited}
//                 id={element.id}
//                 user={element.user}
//                 key={index}
//                 setIsAnswering={setIsAnswering}
//                 removeCurrentComment={removeCurrentComment}
//                 editComment={editComment}
//             />
//         ));
//     };

//     return (
//         <div className="flex flex-col justify-start items-start w-full h-fit p-1 my-2">
//             <div className="flex justify-between items-center mb-1 w-full h-fit">
//                 <div className="flex flex-row justify-start items-center w-fit h-fit mr-1">
//                     <Image width={64} height={64} alt="Profile" src="/84693449.png" className="w-8 aspect-square rounded-full mr-1" />
//                     <h1 className="ml-2 flex font-medium text-base">{user.name}</h1>
//                 </div>
//                 <div className="flex justify-center items-center">
//                     <h2 className="text-sm ml-1 text-neutral-500">{sinceDate}</h2>
//                     <div className="flex justify-center items-center mx-1">
//                         <button className="mx-0.5" type="submit" onClick={() => editComment(currComment)} value="commentEdit" id="commentEdit" name="commentEdit">
//                             <PencilSquareIcon className="aspect-square w-5 fill-neutral-500" />
//                         </button>
//                         <button className="mx-0.5" type="button" onClick={() => setIsAnswering({ isAnswering: true, answeringUser: user, commentId: id })}>
//                             <ChatBubbleLeftEllipsisIcon className="aspect-square w-5 fill-neutral-500" />
//                         </button>
//                         <button className="mx-0.5" type="button" onClick={() => removeCurrentComment(id)}>
//                             <XCircleIcon className="aspect-square w-5 fill-neutral-500" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <p className="mt-1 text-justify text-sm">
//                 {content}
//             </p>
//             <div className="pl-2 border-l-2 border-neutral-200 w-full">
//                 {renderAnswers(answers)}
//             </div>
//         </div>
//     );
// }

interface CommentSectionProps {
    commentsArray: Comment[];
    failModalOption: any;
    noButtonRef: RefObject<HTMLButtonElement>;
}

export function CommentSection(props: CommentSectionProps) {
    const { commentsArray, failModalOption, noButtonRef } = props;

    const { tempCard, setTempCard } = useKanbanContext();
    const { userValue } = useUserContext();

    const [commentUIDs, setCommentsUIDs] = useState<number>(2);
    const incrementCommentUIDs = () => {
        let newValue: number = commentUIDs + 1;
        setCommentsUIDs(newValue);
    }
    const [comments, setComments] = useState<Comment[]>([]);

    const [isAnswering, setIsAnswering] = useState<{
        isAnswering: boolean;
        answeringUser: User;
        commentId: SystemID;
    }>();

    const [isEditing, setIsEditing] = useState<{
        isEditing: boolean,
        editingComment: Comment,
    }>();

    const [textAreaDefaultValue, setTextAreaDefaultValue] = useState<string>("");


    // const findCommentById = (comments: Comment[], targetId: SystemID): Comment | null => {
    //     for (const comment of comments) {
    //         const result = findCommentInTree(comment, targetId);
    //         if (result !== null) {
    //             return result;
    //         }
    //     }

    //     return null;
    // };

    // const addAnswerById = (node: Comment, targetId: SystemID, newAnswer: Comment): void => {
    //     console.log("[INFO] @ addAnswerById Looking at node", node);
    //     console.log("[INFO] @ addAnswerById Target ID", targetId);
    //     const recursiveAddAnswerById = (json: Comment, tId: SystemID, nAnswer: Comment): void => {
    //         if (json.id === tId) {
    //             json.answers.push(nAnswer);
    //             return;
    //         }

    //         for (const answer of json.answers) {
    //             recursiveAddAnswerById(answer, tId, nAnswer);
    //         }
    //     }
    //     let tempComments = comments;
    //     for (let comment of tempComments) {
    //         recursiveAddAnswerById(comment, targetId, newAnswer);
    //     }
    //     setComments(tempComments);
    //     console.log("[INFO] @ addAnswerById Updated Array", tempComments);
    //     return;
    // };

    // const removeCommentById = (targetId: SystemID): void => {
    //     const recursiveRemoveCommentById = (json: Comment, tId: SystemID): void => {
    //         json.answers = json.answers.filter((answer) => answer.id !== tId);

    //         for (const answer of json.answers) {
    //             recursiveRemoveCommentById(answer, tId);
    //         }
    //     };

    //     let tempComments = [...comments];
    //     tempComments = tempComments.filter((comment) => comment.id !== targetId);

    //     for (let comment of tempComments) {
    //         recursiveRemoveCommentById(comment, targetId);
    //     }

    //     setComments(tempComments);
    // };

    // const findCommentInTree = (node: Comment, targetId: SystemID): Comment | null => {
    //     console.log("[INFO] @ findCommentInTree Looking at node", node);
    //     if (node.id === targetId) {
    //         return node;
    //     }

    //     for (const answer of node.answers) {
    //         const result = findCommentInTree(answer, targetId);
    //         if (result !== null) {
    //             return result;
    //         }
    //     }

    //     return null;
    // };


    // const getContentById = (comments: Comment[], targetId: SystemID): string | null => {
    //     const recursiveGetContentById = (json: Comment, tId: SystemID): string | null => {
    //         if (json.id === tId) {
    //             return json.content;
    //         }

    //         for (const answer of json.answers) {
    //             const result = recursiveGetContentById(answer, tId);
    //             if (result !== null) {
    //                 return result;
    //             }
    //         }

    //         return null;
    //     };

    //     for (let comment of comments) {
    //         const content = recursiveGetContentById(comment, targetId);
    //         if (content !== null) {
    //             return content;
    //         }
    //     }

    //     return null;
    // };



    // const replaceContentById = (
    //     comments: Comment[],
    //     targetId: SystemID,
    //     newContent: string,
    //     setComments: Dispatch<SetStateAction<Comment[]>>
    // ): void => {
    //     const recursiveReplaceContentById = (json: Comment, tId: SystemID): void => {
    //         if (json.id === tId) {
    //             json.content = newContent;
    //             json.edited = true;
    //             return;
    //         }

    //         for (const answer of json.answers) {
    //             recursiveReplaceContentById(answer, tId);
    //         }
    //     };

    //     let tempComments: Comment[] = comments;
    //     for (let comment of tempComments) {
    //         recursiveReplaceContentById(comment, targetId);
    //     }

    //     setComments(tempComments);
    // };

    // const handleEditComment = (comment: Comment) => {
    //     console.log("[INFO] @ handleEditComment Editing Comment of #ID", comment.id);
    //     const commentValue: string | null = getContentById(comments, comment.id);
    //     if (commentValue !== null) {
    //         setIsEditing({ isEditing: true, editingComment: comment });
    //         setTextAreaDefaultValue(commentValue);
    //     }
    // }

    // const addComment = (e: React.FormEvent<HTMLFormElement>) => {
    //     //e.preventDefault();
    //     incrementCommentUIDs();
    //     const commentcont = (e.target as any).commentarea.value;

    //     setComments((prevComments) => {
    //         if (isAnswering?.isAnswering === true) {
    //             const answeredComment = findCommentById(prevComments, isAnswering.commentId);
    //             if (answeredComment) {
    //                 const currId = commentUIDs;
    //                 const newAnswer: Comment = {
    //                     user: userData,
    //                     content: commentcont,
    //                     id: currId,
    //                     edited: false,
    //                     date: new Date(),
    //                     answers: [],
    //                 };
    //                 addAnswerById(answeredComment, isAnswering.commentId, newAnswer);

    //                 console.log("[INFO] @ addComment New Answer", newAnswer);
    //                 console.log("[INFO] @ addComment Answered Comment", answeredComment);
    //             }
    //         } else {
    //             const currId = commentUIDs;
    //             const newComment: Comment = {
    //                 user: userData,
    //                 content: commentcont,
    //                 id: currId,
    //                 edited: false,
    //                 date: new Date(),
    //                 answers: [],
    //             };
    //             return [...prevComments, newComment];
    //         }

    //         return prevComments;
    //     });

    //     setIsAnswering(undefined);
    //     //(e.target as any).commentarea.value = "";
    // }

    // const handleSetIsAnswering = (isAnsweringProps: { isAnswering: boolean; answeringUser: Member; commentId: SystemID }): void => {
    //     setIsAnswering(isAnsweringProps);
    //     console.log("[INFO] @ handleSetIsAnswering Comments Stateful Array", comments);
    // };

    function processComments(comments:Comment[]) {
        const commentElements: JSX.Element[] = [];
      
        comments.forEach((comment,index) => {
          // Processar o comentário atual
          const commentObj = (
            <>
                {index > 0 && <div className="bg-neutral-300 w-full h-1 opacity-55 rounded-sm"></div>}
                <div className="flex flex-col overflow-x-hidden justify-start items-start w-full h-fit p-1 my-2">
                    <div className="flex justify-between items-center w-full h-fit">
                        <div className="flex flex-row justify-start items-center w-fit h-fit mr-1">
                            <Image width={64} height={64} alt="Profile" src={comment.user.profilePicture || ""} className="w-8 aspect-square rounded-full mr-1" />
                            <h1 className="ml-2 flex font-medium text-base">{comment.user.name}</h1>
                        </div>
                        <div className="flex justify-center items-center">
                            <h2 className="text-sm ml-1 text-neutral-500">{comment.registrationDate.toDateString()}</h2>
                            <div className="flex justify-center items-center mx-1">
                                {/* <button className="mx-0.5" type="submit" onClick={() => {
                                    
                                }} value="commentEdit" id="commentEdit" name="commentEdit">
                                    <PencilSquareIcon className="aspect-square w-5 fill-neutral-500" />
                                </button> */}
                                <button className="mx-0.5" type="button" onClick={() => {}}>
                                    <ChatBubbleLeftEllipsisIcon className="aspect-square w-5 fill-neutral-500" />
                                </button>
                                <button className="mx-0.5" type="button" onClick={() => {}}>
                                    <XCircleIcon className="aspect-square w-5 fill-neutral-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="mt-1 text-justify text-sm p-3">
                        {comment.content}
                    </p>
                    <div className={`${(comment.answers == undefined || comment.answers.length == 0) && "hidden"} ms-5 border-l-2 bg-neutral-200 w-full mt-2 rounded-sm h-fit ps-2 pe-4`}>
                        {comment.answers && comment.answers.length > 0 && (
                            processComments(comment.answers)
                        )}
                    </div>
                </div>
            </>
        );
      
          commentElements.push(commentObj);
        });
      
        return commentElements;
      }      

    return (
        <div className="flex flex-col justify-start overflow-y-auto max-h-96 items-start h-full w-full">
            <div className="h-full overflow-auto shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2 w-full">
                {processComments([{
                    content: "Conteudo do comentario",edited:false,id:1,registrationDate:new Date(),user:userValue.profileData,answers:[
                    {content: "Resposta do comentário",edited:false,id:3,registrationDate:new Date(),user:userValue.profileData,answers:[
                        {content: "Resposta do comentário",edited:false,id:3,registrationDate:new Date(),user:userValue.profileData,answers:[]}
                    ]},
                    {content: "Resposta do comentário",edited:false,id:3,registrationDate:new Date(),user:userValue.profileData,answers:[]},
                ],},
                {content: "Conteudo do comentario",edited:false,id:2,registrationDate:new Date(),user:userValue.profileData,answers:[]},
                {content: "Resposta do comentário",edited:false,id:3,registrationDate:new Date(),user:userValue.profileData,answers:[]},
                {content: "Resposta do comentário",edited:false,id:3,registrationDate:new Date(),user:userValue.profileData,answers:[]}])}
            </div>
            <div className="w-full flex flex-col items-center">
                <div className="w-full flex flex-row items-center">
                    <div className="w-full mt-1 flex flex-col">
                        {isAnswering?.isAnswering ? (
                            <div className="text-center flex items-center justify-center w-full shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-1 mb-1 transition-all">
                                <h1 className="italic font-semibold">
                                    Respondendo ao usuário <span className="text-blue-700">@{isAnswering?.answeringUser?.name}</span>
                                </h1>
                            </div>
                        ) : null}
                        <textarea id="commentarea" name="commentarea" className="w-full resize-none shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2 mt-1 transition-all" placeholder="Insira um comentário" />
                    </div>
                    <button type="submit" className="ml-2" value="commentSend" id="commentSend" name="commentSend">
                        <PaperAirplaneIcon className="w-8 aspect-square stroke-neutral-950 hover:stroke-green-600 fill-neutral-100 hover:fill-green-100 transition-all" />
                    </button>
                </div>
            </div>
        </div>
    );
};
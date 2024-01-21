"use client";

import {  SystemID, Comment, User, Kanban, Card } from "@/app/types/KanbanTypes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Dispatch, RefObject, SetStateAction, useEffect, useState } from "react";
import { BACKEND_DATE_FORMAT } from "@/app/utils/variables";
import { CommentEntryProps } from "@/app/interfaces/KanbanInterfaces";
import { useKanbanContext } from "@/app/contexts/kanbanContext";
import { useUserContext } from "@/app/contexts/userContext";
import { ConfirmDeleteOtherComment, ConfirmDeleteYourComment, CreateComment, ShowCreateAnsweredComment } from "@/app/utils/dashboard/functions/Page/CreateEditCard";
import { useModalContext } from "@/app/contexts/modalContext";
import { CustomModalButtonAttributes } from "../ui/CustomModal";
import { ProfilePicture } from "./user/ProfilePicture";
import { delete_comment } from "@/app/utils/fetchs";

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

    const { cardManager, setCardManager, tempCard, setTempCard } = useKanbanContext();
    const { userValue } = useUserContext();
    const modalContextProps = useModalContext();

    const [answerComment,setAnswerComment] = useState<{
        parentComment?: Comment,
        newComment?: Comment
    }>();
    const [newComment,setNewComment] = useState<string>("");

    function deleteCommentById(comments: Comment[], commentId: SystemID): Comment[] {
        return comments.filter(comment => {
            if (comment.id == commentId) {
            // Se encontrarmos o comentário com o ID correspondente, não o incluímos na nova lista
            return false;
            } else if (comment.answers && comment.answers.length > 0) {
            // Se o comentário tiver respostas, chamamos recursivamente a função para processar as respostas
            comment.answers = deleteCommentById(comment.answers, commentId);
            return true; // Incluímos o comentário na nova lista, pois não é o comentário que estamos excluindo
            } else {
            return true; // Incluímos o comentário na nova lista, pois não é o comentário que estamos excluindo
            }
        });
    }

    function handleRemoveComment(comment:Comment){
        const delComment = () => {
            delete_comment(undefined,comment.id,userValue.token,(response)=>response.text().then(()=>{
                if(response.ok){
                    console.log("DELETE COMMENT SUCCESS");
                }
            }));
            const commentsAfterDeletion = deleteCommentById(commentsArray,comment.id);
            setTempCard({...tempCard,comments:commentsAfterDeletion});
            modalContextProps.setModalOpen(false);
        }

        const successOption: CustomModalButtonAttributes[] = [
            {
                text: "Sim",
                onclickfunc: delComment,
                type: "button",
                className: "rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            },
            {
                text: "Não",
                onclickfunc: () => modalContextProps.setModalOpen(false),
                ref: noButtonRef,
                type: "button",
                className: "rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
            }
        ]

        const successModalOption: any = successOption.map(
            (el: CustomModalButtonAttributes, idx: number) => <button className={el?.className} type={el.type} key={idx} onClick={el.onclickfunc} ref={el?.ref}>{el.text}</button>
        );

        if(comment.user.id == userValue.profileData.id){
            ConfirmDeleteYourComment(
                userValue,
                cardManager,
                successModalOption,
                failModalOption,
                noButtonRef,
                modalContextProps
            );
        }else{
            ConfirmDeleteOtherComment(
                userValue,
                cardManager,
                successModalOption,
                failModalOption,
                noButtonRef,
                modalContextProps
            );
        }
    }

    function addCommentToAnswers(comments: Comment[], parentId: SystemID, newComment: Comment): Comment[] {
        return comments.map(comment => {
            if (comment.id == parentId) {
                // Se encontrarmos o comentário com o ID correspondente, adicionamos o novo comentário às respostas
                return {
                    ...comment,
                    answers: comment.answers ? [...comment.answers, newComment] : [newComment],
                };
            } else if (comment.answers && comment.answers.length > 0) {
                // Se o comentário tiver respostas, chamamos recursivamente a função para processar as respostas
                return {
                    ...comment,
                    answers: addCommentToAnswers(comment.answers, parentId, newComment),
                };
            } else {
                return comment;
            }
        });
    }

    function handleAddCommentToAnswers(){
        const parentId = answerComment?.parentComment?.id;
        const newComment = answerComment?.newComment;
        if(parentId && newComment){
            const commentsWithNewAnswer = addCommentToAnswers(commentsArray,parentId,newComment);
            setTempCard({...tempCard,comments:commentsWithNewAnswer});
            setCardManager({...cardManager,isShowCreateAnsweredComment:false});
        }
    }      

    function handleAddComment(){
        CreateComment(
            userValue,
            newComment,
            setNewComment,
            setTempCard,
            tempCard,
            failModalOption,
            noButtonRef,
            modalContextProps
        );
    }

    function handleShowCreateAnsweredComment(){
        ShowCreateAnsweredComment(
            userValue,
            setCardManager,
            cardManager,
            failModalOption,
            noButtonRef,
            modalContextProps
        );
    }

    function processComments(comments:Comment[],asweredComment?:Comment) {
        const commentElements: JSX.Element[] = [];
        
        comments?.forEach((comment,index) => {
            // Processar o comentário atual
            const commentObj = (
                <div key={index}>
                    {index > 0 && <div className="bg-neutral-300 w-full h-1 opacity-55 rounded-sm"></div>}
                    <div className={`${asweredComment ? "mt-2" : "my-2"} flex flex-col overflow-x-hidden justify-start items-start w-full h-fit p-1`}>
                        <div className="flex justify-between items-center w-full h-fit">
                            <div className="flex flex-row justify-start items-center w-fit h-fit mr-1">
                                <ProfilePicture className="aspect-square" size={64} source={userValue.profileData?.profilePicture} />
                                <h1 className="ml-3 flex font-medium text-base">{comment.user.name} { asweredComment && " | respondeu #"+ asweredComment.id}</h1>
                            </div>
                            <div className="flex justify-center items-center">
                                <h2 className="text-sm ml-1 text-neutral-500">{dayjs(comment.registrationDate || new Date()).format('DD [de] MMMM [de] YYYY')}</h2>
                                <div className={`flex justify-center items-center mx-1`}>
                                    {/* <button className="mx-0.5" type="submit" onClick={() => {}} value="commentEdit" id="commentEdit" name="commentEdit">
                                        <PencilSquareIcon className="aspect-square w-5 fill-neutral-500" />
                                    </button> */}
                                    <button className={`${comment.id == "" || comment.id.toString().includes("|") ? "pointer-events-none opacity-20" : ""} mx-0.5`} type="button" onClick={() => {
                                        handleShowCreateAnsweredComment();
                                        setAnswerComment({parentComment:comment});
                                    }}>
                                        <ChatBubbleLeftEllipsisIcon className="aspect-square w-5 fill-neutral-500" />
                                    </button>
                                    <button className="mx-0.5" type="button" onClick={() => {
                                        handleRemoveComment(comment);
                                    }}>
                                        <XCircleIcon className="aspect-square w-5 fill-neutral-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="mt-1 text-justify text-sm p-3">
                            #{comment.id} - {comment.content}
                        </p>
                        <div className={`${(comment.answers == undefined || comment.answers.length == 0) && "hidden"} 
                            ${!asweredComment && "ps-2 ms-5 pe-4"} border-l-2 bg-neutral-200 w-full mt-2 rounded-sm h-fit`}>
                            {comment.answers && comment.answers.length > 0 && (
                                processComments(comment.answers,comment)
                            )}
                        </div>
                    </div>
                </div>
            );
            commentElements.push(commentObj);
        });
      
        return commentElements;
    }

    return (
        <div className="flex flex-col justify-start overflow-y-auto relative max-h-96 items-start h-full w-full">
            <div className="h-full overflow-auto shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2 w-full">
                {processComments(commentsArray)}
                { 
                    cardManager.isShowCreateAnsweredComment && (
                        <div className="p-3 w-full h-full flex justify-center items-center absolute top-0 left-0">
                            <div className="bg-neutral-50 shadow-xl rounded-md border-2 border-neutral-400 w-full max-w-[75%] p-4">
                                <span>#{answerComment?.parentComment?.id} - {answerComment?.parentComment?.user.name}</span>
                                <input className="w-full" onChange={(e)=>{setAnswerComment({...answerComment,newComment:{
                                    content: e.target.value,
                                    edited: false,
                                    id: "|"+answerComment?.parentComment?.id+"|"+tempCard.comments.length,
                                    user: userValue.profileData,
                                    registrationDate: new Date().toDateString(),
                                    answers: []
                                }})}} placeholder="Digite sua resposta" type="text" />
                                <div className="flex justify-between">
                                    <button type="button" onClick={()=>handleAddCommentToAnswers()}
                                    className="bg-neutral-200 p-2 drop-shadow rounded-md mt-3">Adicionar</button>
                                    <button type="button" onClick={()=>setCardManager({...cardManager,isShowCreateAnsweredComment:false})}
                                    className="bg-neutral-200 p-2 drop-shadow rounded-md mt-3">Voltar</button>
                                </div>
                            </div>
                        </div>
                    ) 
                }
            </div>
            <div className="w-full flex flex-col items-center mb-3">
                <div className="w-full flex flex-row items-center">
                    <div className="w-full mt-1 flex flex-col">
                        <textarea value={newComment} onChange={(e)=>setNewComment(e.target.value)} id="commentarea" name="commentarea" className="w-full resize-none shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2 mt-1 transition-all" placeholder="Insira um comentário" />
                    </div>
                    <button type="button" onClick={handleAddComment} className="ml-2" value="commentSend" id="commentSend" name="commentSend">
                        <PaperAirplaneIcon className="w-8 aspect-square stroke-neutral-950 hover:stroke-green-600 fill-neutral-100 hover:fill-green-100 transition-all" />
                    </button>
                </div>
            </div>
        </div>
    );
};
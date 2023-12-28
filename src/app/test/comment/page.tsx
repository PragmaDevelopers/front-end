"use client";

import { Member, SystemID } from "@/app/types/KanbanTypes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/pt-br';
import { ChatBubbleLeftEllipsisIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { BACKEND_DATE_FORMAT } from "@/app/utils/variables";

dayjs.locale('pt-br');
dayjs.extend(relativeTime);

type Comment = {
    user: Member;
    content: string;
    id: SystemID;
    answers: Comment[];
    edited: boolean;
    date: string;
}

interface CommentEntryProps {
    user: Member;
    content: string;
    id: SystemID;
    answers: Comment[];
    edited: boolean;
    date: string;
    setIsAnswering: (arg0: { isAnswering: boolean, answeringUser: Member, commentId: SystemID }) => void;
}

function CommentEntry(props: CommentEntryProps) {
    const { content, user, answers, date, edited, id, setIsAnswering } = props;
    const currDate = dayjs();
    const sinceDate: string = currDate.to(dayjs(date, BACKEND_DATE_FORMAT));

    const renderAnswers = (answers: Comment[]): JSX.Element[] => {
        return answers.map((element: Comment, index: number) => (
            <CommentEntry
                answers={element.answers}
                content={element.content}
                date={element.date}
                edited={element.edited}
                id={element.id}
                user={element.user}
                key={index}
                setIsAnswering={setIsAnswering}
            />
        ));
    };

    return (
        <div className="flex flex-col justify-start items-start w-full h-fit p-1 my-2">
            <div className="flex justify-between items-center mb-1 w-full h-fit">
                <div className="flex flex-row justify-start items-center w-fit h-fit mr-1">
                    <Image width={64} height={64} alt="Profile" src="/84693449.png" className="w-8 aspect-square rounded-full mr-1" />
                    <h1 className="ml-2 flex font-medium text-base">{user.name}</h1>
                </div>
                <div className="flex">
                    <h2 className="text-sm ml-1 text-neutral-500">{sinceDate}</h2>
                    <button type="button" onClick={() => setIsAnswering({ isAnswering: true, answeringUser: user, commentId: id })}>
                        <ChatBubbleLeftEllipsisIcon className="aspect-square w-8" />
                    </button>
                </div>
            </div>
            <p className="mt-1 text-justify text-sm">
                {content}
            </p>
            <div className="pl-2 border-l-2 border-neutral-200 w-full">
                {renderAnswers(answers)}
            </div>
        </div>
    );
}

function CommentSection() {
    const newUser: Member = {
        name: "Fulano da Silva",
        email: null,
        nacionalidade: null,
        password: null,
        gender: null,
        accountCreation: null,
        profilePicture: null,
        pushEmail: null,
        generalPermissions: null,
        id: null,
        role: null,
        kanban_role: null
    };

    const exampleDate: string = "2023-12-06T11:56:43.800294";
    const commentContent: string =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

    const [commentUIDs, setCommentsUIDs] = useState<number>(2);
    const incrementCommentUIDs = () => {
        let newValue: number = commentUIDs + 1;
        setCommentsUIDs(newValue);
    }
    const [comments, setComments] = useState<Comment[]>([
        {
            user: newUser,
            content: commentContent,
            id: 0,
            edited: false,
            date: exampleDate,
            answers: [
                {
                    user: newUser,
                    content: commentContent,
                    id: 1,
                    edited: false,
                    date: dayjs().toISOString(),
                    answers: [],
                },
            ],
        },
    ]);

    const [isAnswering, setIsAnswering] = useState<{
        isAnswering: boolean;
        answeringUser: Member;
        commentId: SystemID;
    }>();

    const findCommentById = (comments: Comment[], targetId: SystemID): Comment | null => {
        for (const comment of comments) {
            const result = findCommentInTree(comment, targetId);
            if (result !== null) {
                return result;
            }
        }

        return null;
    };



    const addAnswerById = (node: Comment, targetId: SystemID, newAnswer: Comment): void => {
        console.log("[INFO] @ addAnswerById Looking at node", node);
        console.log("[INFO] @ addAnswerById Target ID", targetId);
        const recursiveAddAnswerById = (json: Comment, tId: SystemID, nAnswer: Comment): void => {
            if (json.id === tId) {
                json.answers.push(nAnswer);
                return;
            }
            
            for (const answer of json.answers) {
                recursiveAddAnswerById(answer, tId, nAnswer);
            }
        }
        let tempComments = comments;
        for (let comment of tempComments) {
            recursiveAddAnswerById(comment, targetId, newAnswer);
        }
        setComments(tempComments);
        console.log("[INFO] @ addAnswerById Updated Array", tempComments);
        return;
    };

    const removeCommentById = (targetId: SystemID): void => {
        setComments((prevComments) => {
            const updatedComments = prevComments.filter((comment) => comment.id !== targetId);
            return [...updatedComments];
        });
    };

    const findCommentInTree = (node: Comment, targetId: SystemID): Comment | null => {
        console.log("[INFO] @ findCommentInTree Looking at node", node);
        if (node.id === targetId) {
            return node;
        }

        for (const answer of node.answers) {
            const result = findCommentInTree(answer, targetId);
            if (result !== null) {
                return result;
            }
        }

        return null;
    };

    const addComment = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        incrementCommentUIDs();
        const commentcont = (e.target as any).commentarea.value;

        setComments((prevComments) => {
            if (isAnswering?.isAnswering === true) {
                const answeredComment = findCommentById(prevComments, isAnswering.commentId);
                if (answeredComment) {
                    const currId = commentUIDs;
                    const newAnswer: Comment = {
                        user: newUser,
                        content: commentcont,
                        id: currId,
                        edited: false,
                        date: dayjs().toISOString(),
                        answers: [],
                    };
                    addAnswerById(answeredComment, isAnswering.commentId, newAnswer);

                    console.log("[INFO] @ addComment New Answer", newAnswer);
                    console.log("[INFO] @ addComment Answered Comment", answeredComment);
                }
            } else {
                const currId = commentUIDs;
                const newComment: Comment = {
                    user: newUser,
                    content: commentcont,
                    id: currId,
                    edited: false,
                    date: dayjs().toISOString(),
                    answers: [],
                };
                return [...prevComments, newComment];
            }

            return prevComments;
        });

        setIsAnswering(undefined);
        (e.target as any).commentarea.value = "";
    };

    const handleSetIsAnswering = (isAnsweringProps: { isAnswering: boolean; answeringUser: Member; commentId: SystemID }): void => {
        setIsAnswering(isAnsweringProps);
        console.log("[INFO] @ handleSetIsAnswering Comments Stateful Array", comments);
    };

    return (
        <div className="flex flex-col justify-start items-start h-full w-full">
            <div className="h-64 overflow-auto mb-1 shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2 divide-y divide-neutral-300">
                {comments.map((comment, idx) => (
                    <CommentEntry
                        key={idx}
                        user={comment.user}
                        content={comment.content}
                        id={comment.id}
                        answers={comment.answers}
                        edited={comment.edited}
                        date={comment.date}
                        setIsAnswering={handleSetIsAnswering}
                    />
                ))}
            </div>
            <div className="w-full flex flex-col items-center">
                {isAnswering?.isAnswering ? (
                    <div className="p-1 rounded-md text-center flex items-center justify-center bg-neutral-200 w-full">
                        <h1 className="italic font-semibold">
                            Respondendo ao usuário <span className="text-blue-700">@{isAnswering?.answeringUser?.name}</span>
                        </h1>
                    </div>
                ) : null}
                <form onSubmit={addComment} className="w-full flex flex-row items-center">
                    <textarea name="commentarea" className="w-full resize-none shadow-inner bg-neutral-100 border-[1px] border-neutral-100 rounded-md p-2 mt-1" placeholder="Insira um comentário" />
                    <button type="submit" className="ml-2">
                        <PaperAirplaneIcon className="w-8 aspect-square stroke-neutral-950 hover:stroke-green-600 fill-neutral-100 hover:fill-green-100 transition-all" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function Page() {
    return (
        <main className="w-full h-full bg-neutral-50 flex flex-col justify-center items-center">
            <div className="w-[50%] h-96">
                <CommentSection />
            </div>
        </main>
    );
}
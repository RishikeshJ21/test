import { MessageCircle, MoreHorizontal } from "lucide-react";
import { Button } from "../button";
import { Comment } from "./types";

interface CommentItemProps {
  comment: Comment;
  handleLikeComment: (commentId: string) => void;
  handleLikeReply: (commentId: string, replyId: string) => void;
  toggleShowReplies: (commentId: string) => void;
  handleReplyComment: (commentId: string) => void;
  replyingTo: string | null;
  replyText: string;
  handleReplyTextareaInput: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleAddReply: () => void;
  replyTextAreaRef: React.RefObject<HTMLTextAreaElement>;
  formatTimeAgo: (dateString: string) => string;
}

const CommentItem = ({
  comment,
  handleLikeComment,
  handleLikeReply,
  toggleShowReplies,
  handleReplyComment,
  replyingTo,
  replyText,
  handleReplyTextareaInput,
  handleAddReply,
  replyTextAreaRef,
  formatTimeAgo
}: CommentItemProps) => {
  return (
    <div className="py-6 border-b border-gray-100">
      <div>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <div className="flex space-x-3">
              {comment.author.image ? (
                <img
                  src={comment.author.image}
                  alt={comment.author.name}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center p-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-500">
                    <path
                      fillRule="evenodd"
                      d="M12 2a6 6 0 100 12 6 6 0 000-12zm0 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

            </div>
            <div className="flex flex-col items-start ">
              <h4 className="font-medium text-black mr-2">{comment.author.name}</h4>
              <span className="text-gray-500 text-sm ">{formatTimeAgo(comment.date)}</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={16} />
          </button>
        </div>
        <div className="flex-grow mt-2 mb-1">
          {/* <div className="flex items-center justify-between mb-1">



          </div> */}
          <p className="text-gray-800 break-words mt-4 mb-6">{comment.text}</p>
          <div className="flex items-center space-x-4 ml-2 mb-1 gap-3">
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`text-sm flex items-center group ${comment.isLiked ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}`}
              aria-label={comment.isLiked ? "Unlike comment" : "Like comment"}
            >
              {comment.likes > 0 && (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="mr-1">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill={comment.isLiked ? "#9333ea" : "none"}
                      stroke={comment.isLiked ? "#9333ea" : "currentColor"}
                      strokeWidth="2"
                    />
                  </svg>
                  <span className={comment.isLiked ? "text-purple-600" : ""}>{comment.likes}</span>
                </>
              )}
              {comment.likes === 0 && (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="mr-1">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </>
              )}
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <div className="flex items-center  space-x-1" onClick={() => toggleShowReplies(comment.id)}>
                <MessageCircle size={20} className="text-gray-500" />
                <button
                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                  aria-label={comment.showReplies ? "Hide replies" : "Show replies"}
                >
                  {comment.showReplies ? "Hide replies" : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
                </button>
              </div>
            )}

            <button
              onClick={() => handleReplyComment(comment.id)}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center underline underline-offset-2"
              aria-label={`Reply to ${comment.author.name}`}
            >
              Reply
            </button>
          </div>
          {replyingTo === comment.id && (
        <div className="mt-4 ml-12 pl-1">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                <path
                  fillRule="evenodd"
                  d="M12 2a6 6 0 100 12 6 6 0 000-12zm0 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-grow">
              <textarea
                ref={replyTextAreaRef}
                value={replyText}
                onChange={handleReplyTextareaInput}
                placeholder={`Replying to ${comment.author.name}...`}
                className="w-full p-3 bg-gray-50 rounded-md border border-gray-200 resize-none focus:ring-1 focus:ring-gray-300 focus:outline-none text-black overflow-hidden"
                rows={2}
                style={{ minHeight: "50px" }}
              />
              <div className="flex justify-end mt-2 gap-2">
                <Button
                  onClick={() => handleReplyComment(comment.id)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddReply}
                  disabled={!replyText.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300 disabled:cursor-not-allowed px-3 py-1 text-sm"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
          {comment.showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-6 space-y-4 ml-4 pl-4 border-l border-gray-100">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex flex-col gap-3 mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        {reply.author.image ? (
                          <img
                            src={reply.author.image}
                            alt={reply.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center p-1.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 text-gray-500"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 2a6 6 0 100 12 6 6 0 000-12zm0 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-start  ">
                        <h4 className="font-medium text-black">{reply.author.name}</h4>
                        <span className="text-gray-500 text-sm">
                          {formatTimeAgo(reply.date)}
                        </span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <div className="flex flex-col items-start flex-grow">
               
                    <p className="text-gray-800 break-words mt-2 mb-3">{reply.text}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLikeReply(comment.id, reply.id)}
                        className={`text-sm flex items-center ${reply.isLiked
                          ? "text-purple-600"
                          : "text-gray-500 hover:text-purple-600"
                          }`}
                        aria-label={reply.isLiked ? "Unlike reply" : "Like reply"}
                      >
                        {reply.likes > 0 ? (
                          <>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="mr-1"
                            >
                              <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill={reply.isLiked ? "#9333ea" : "none"}
                                stroke={reply.isLiked ? "#9333ea" : "currentColor"}
                                strokeWidth="2"
                              />
                            </svg>
                            <span className={reply.isLiked ? "text-purple-600" : ""}>
                              {reply.likes}
                            </span>
                          </>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mr-1"
                          >
                            <path
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

     
    </div>
  );
};

export default CommentItem;
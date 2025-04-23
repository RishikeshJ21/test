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
    <div className="py-6 border-b border-gray-100 last:border-b-0">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {comment.author.image ? (
            <img
              src={comment.author.image}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
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
        
        <div className="flex-grow">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h4 className="font-medium text-gray-900">{comment.author.name}</h4>
              <span className="text-gray-500 text-sm">{formatTimeAgo(comment.date)}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          <div className="mt-3">
            <p className="text-gray-800 whitespace-pre-wrap">{comment.text}</p>
            
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={`text-sm flex items-center group ${comment.isLiked ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}`}
                aria-label={comment.isLiked ? "Unlike comment" : "Like comment"}
              >
                {comment.likes > 0 && (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-1.5">
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-1.5">
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>Like</span>
                  </>
                )}
              </button>

              {comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={() => toggleShowReplies(comment.id)}
                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                  aria-label={comment.showReplies ? "Hide replies" : "Show replies"}
                >
                  <MessageCircle size={18} className="mr-1.5" />
                  {comment.showReplies ? "Hide replies" : `${comment.replies.length} ${comment.replies.length === 1 ? 'Reply' : 'Replies'}`}
                </button>
              )}

              <button
                onClick={() => handleReplyComment(comment.id)}
                className="text-gray-500 hover:text-gray-700 text-sm"
                aria-label={`Reply to ${comment.author.name}`}
              >
                Reply
              </button>
            </div>
            
            {replyingTo === comment.id && (
              <div className="mt-4">
                <div className="flex gap-3">
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
                    <div className="bg-gray-50 rounded-xl p-3">
                      <textarea
                        ref={replyTextAreaRef}
                        value={replyText}
                        onChange={handleReplyTextareaInput}
                        placeholder={`Replying to ${comment.author.name}...`}
                        className="w-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-800 min-h-[60px] placeholder-gray-400"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end mt-3 gap-3">
                      <button
                        onClick={() => handleReplyComment(comment.id)}
                        className="px-4 py-1.5 rounded-full text-gray-700 hover:bg-gray-100 text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddReply}
                        disabled={!replyText.trim()}
                        className={`px-4 py-1.5 rounded-full text-white text-sm font-medium ${!replyText.trim() ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {comment.showReplies && comment.replies && comment.replies.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="space-y-5">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        {reply.author.image ? (
                          <img
                            src={reply.author.image}
                            alt={reply.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
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
                      
                      <div className="flex-grow">
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium text-gray-900 text-sm mr-2">{reply.author.name}</h4>
                          <span className="text-gray-500 text-xs">{formatTimeAgo(reply.date)}</span>
                        </div>
                        
                        <p className="text-gray-800 text-sm whitespace-pre-wrap mb-2">{reply.text}</p>
                        
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLikeReply(comment.id, reply.id)}
                            className={`text-xs flex items-center ${reply.isLiked ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}`}
                            aria-label={reply.isLiked ? "Unlike reply" : "Like reply"}
                          >
                            {reply.likes > 0 && (
                              <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
                                  <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill={reply.isLiked ? "#9333ea" : "none"}
                                    stroke={reply.isLiked ? "#9333ea" : "currentColor"}
                                    strokeWidth="2"
                                  />
                                </svg>
                                <span className={reply.isLiked ? "text-purple-600" : ""}>{reply.likes}</span>
                              </>
                            )}
                            {reply.likes === 0 && (
                              <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
                                  <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                </svg>
                                <span>Like</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
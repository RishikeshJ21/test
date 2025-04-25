import { MessageCircle, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "../button";
import { Comment } from "./types";
import { useState } from "react";

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
  handleDeleteComment?: (commentId: string) => void;
  handleDeleteReply?: (commentId: string, replyId: string) => void;
  currentUserId?: string;
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
  formatTimeAgo,
  handleDeleteComment,
  handleDeleteReply,
  currentUserId
}: CommentItemProps) => {
  const [showCommentOptions, setShowCommentOptions] = useState(false);
  const [showReplyOptions, setShowReplyOptions] = useState<string | null>(null);

  // Return fallback UI if comment is malformed
  if (!comment || !comment.author) {
    return (
      <div className="py-6 border-b border-gray-100 last:border-b-0">
        <div className="text-gray-400">Invalid comment data</div>
      </div>
    );
  }

  // Check if the current user is the comment owner (for delete permissions)
  const isCommentOwner = currentUserId && comment.user_id === currentUserId;
  
  return (
    <div className="py-6 border-b border-gray-100 last:border-b-0">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {comment.author.image ? (
            <img
              src={comment.author.image}
              alt={comment.author.name || 'Anonymous'}
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow-sm border border-gray-200">
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
          <div className="flex justify-between relative">
            <div className="flex flex-col">
              <h4 className="font-semibold text-gray-900">{comment.author.name || 'Anonymous'}</h4>
              <span className="text-gray-500 text-xs">{formatTimeAgo(comment.date)}</span>
            </div>
            
            {/* Options button - only show for comment owner */}
            {isCommentOwner && handleDeleteComment && (
              <div className="relative">
                <button 
                  className="text-gray-400 hover:text-gray-600 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setShowCommentOptions(!showCommentOptions)}
                >
                  <MoreHorizontal size={16} />
                </button>
                
                {showCommentOptions && (
                  <div className="absolute right-0 mt-1 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-10 py-1">
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      onClick={() => {
                        if (handleDeleteComment) {
                          handleDeleteComment(comment.id);
                          setShowCommentOptions(false);
                        }
                      }}
                    >
                      <Trash size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-3">
            <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">{comment.text}</p>
            
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={`text-sm flex items-center group transition-colors ${comment.isLiked ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}`}
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
                    <span className={`font-medium ${comment.isLiked ? "text-purple-600" : ""}`}>{comment.likes}</span>
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
                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center transition-colors"
                  aria-label={comment.showReplies ? "Hide replies" : "Show replies"}
                >
                  <MessageCircle size={18} className="mr-1.5" />
                  {comment.showReplies ? "Hide replies" : `${comment.replies.length} ${comment.replies.length === 1 ? 'Reply' : 'Replies'}`}
                </button>
              )}

              <button
                onClick={() => handleReplyComment(comment.id)}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                aria-label={`Reply to ${comment.author.name}`}
              >
                Reply
              </button>
            </div>
            
            {replyingTo === comment.id && (
              <div className="mt-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-gray-200 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                      <path
                        fillRule="evenodd"
                        d="M12 2a6 6 0 100 12 6 6 0 000-12zm0 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
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
                        className="px-4 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddReply}
                        disabled={!replyText.trim()}
                        className={`px-4 py-1.5 rounded-md text-white text-sm font-medium transition-all ${!replyText.trim() ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-sm hover:shadow'}`}
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
                  {comment.replies.map((reply) => {
                    // Skip rendering replies with missing data
                    if (!reply || !reply.author) {
                      return null;
                    }
                    
                    return (
                      <div key={reply.id} className="flex gap-3">
                        <div className="flex-shrink-0">
                          {reply.author.image ? (
                            <img
                              src={reply.author.image}
                              alt={reply.author.name || 'Anonymous'}
                              className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shadow-sm border border-gray-200">
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
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <h4 className="font-medium text-gray-900 text-sm mr-2">{reply.author.name || 'Anonymous'}</h4>
                              <span className="text-gray-500 text-xs">{formatTimeAgo(reply.date)}</span>
                            </div>
                            
                            {/* Reply options button */}
                            {currentUserId && handleDeleteReply && reply.user_id === currentUserId && (
                              <div className="relative">
                                <button 
                                  className="text-gray-400 hover:text-gray-600 h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                                  onClick={() => setShowReplyOptions(showReplyOptions === reply.id ? null : reply.id)}
                                >
                                  <MoreHorizontal size={14} />
                                </button>
                                
                                {showReplyOptions === reply.id && (
                                  <div className="absolute right-0 mt-1 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                                    <button
                                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      onClick={() => {
                                        if (handleDeleteReply) {
                                          handleDeleteReply(comment.id, reply.id);
                                          setShowReplyOptions(null);
                                        }
                                      }}
                                    >
                                      <Trash size={14} />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
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
                    );
                  })}
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
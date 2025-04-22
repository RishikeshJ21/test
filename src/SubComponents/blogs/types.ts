export interface CommentAuthor {
  name: string;
  image: string;
  username?: string;
}

export interface Reply {
  id: string;
  author: CommentAuthor;
  text: string;
  date: string;
  likes: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  text: string;
  date: string;
  likes: number;
  isLiked?: boolean;
  replies?: Reply[];
  showReplies?: boolean;
}

export interface BlogPostAuthor {
  name: string;
  image: string;
}

export interface BlogPostProps {
  title: string;
  date: string;
  tags: string[];
  content: string[];
  imageSrc: string;
  slug: string;
  author: BlogPostAuthor;
  initialComments?: Comment[];
}

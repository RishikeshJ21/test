export interface CommentAuthor {
  name: string;
  image: string;
  username?: string;
  user_id?: string;
}

export interface Reply {
  id: string;
  author: CommentAuthor;
  text: string;
  date: string;
  likes: number;
  isLiked?: boolean;
  isLoading?: boolean;
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
  isNew?: boolean;
}

export interface BlogPostAuthor {
  name: string;
  image: string;
}

export interface TocSection {
  id: string;
  title: string;
}

export interface BlogPostProps {
  title: string;
  date: string;
  tags: string[];
  content: string[];
  imageSrc: string;
  slug: string;
  blogId: number | null;
  author: BlogPostAuthor;
  initialComments?: Comment[];
  tocSections?: TocSection[];
  isCommentsOpen?: boolean;
  onToggleComments?: (isOpen: boolean) => void;
}

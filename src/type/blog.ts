export type Mark = {
  type: "bold" | "italic" | "link" | "strike" | "highlight" | "code";
  attrs?: { href?: string };
};

export type Node = {
  type:
    | "paragraph"
    | "heading"
    | "bulletList"
    | "orderedList"
    | "listItem"
    | "image"
    | "blockquote"
    | "codeBlock"
    | "text";
  content?: Node[];
  text?: string;
  marks?: Mark[];
  attrs?: {
    level?: number; // For headings (h1, h2, etc.)
    src?: string; // For images
    alt?: string; // For images
  };
};

export type Blog = {
  _localID: string;
  content: {
    title: string;
    description: string;
    tags?: string[];
    mainImage?: {
      url?: string;
      alt?: string;
    };
    mainImageBlobUrl?: string;
    body?: Node[];
    conclusion?: Node[];
    links?: string[];
  };
  creator: string;
};

export type BlogContentProp = {
  title: string;
  tags?: string[];
  mainImage?: {
    url?: string;
    alt?: string;
  };
  mainImageBlobUrl?: string;
  body?: {
    content: Node[];
  };
  conclusion?: Node[];
  links?: string[];
};

export type BlogState = {
  blogs: Blog[];
  addBlog: (blog: Blog) => void;
  deleteBlog: (id: string) => void;
  updateBlog: (blog: Blog) => void;
  activeBlog: Blog | null;
  setActiveBlog: (id: string | null) => void;
  activeTask: null | "structure" | "preview" | "code";
  setActiveTask: (task: null | "structure" | "preview" | "code") => void;
  isSearching: boolean;
  setIsSearcing: (mode: boolean) => void;
  listMode: "all" | "category";
  setListMode: (mode: "all" | "category") => void;
};

export interface BlogUpload {
  _localID: string;
  content: string;
  creator: string;
}

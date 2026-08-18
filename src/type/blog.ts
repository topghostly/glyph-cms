export type Mark = {
  type:
    | "bold"
    | "italic"
    | "link"
    | "strike"
    | "highlight"
    | "code"
    | "underline";
  attrs?: { href?: string };
};

export type NodeType =
  | "doc"
  | "paragraph"
  | "heading"
  | "bulletList"
  | "orderedList"
  | "listItem"
  | "image"
  | "blockquote"
  | "codeBlock"
  | "horizontalRule"
  | "hardBreak"
  | "text";

export type Node = {
  type: NodeType;
  content?: Node[];
  text?: string;
  marks?: Mark[];
  attrs?: {
    level?: number; // headings
    src?: string; // images
    alt?: string; // images
    href?: string; // links
    textAlign?: "left" | "center" | "right" | "justify";
    start?: number; // ordered lists
    language?: string; // code blocks
  };
};

/** What `editor.getJSON()` actually returns — a doc node, not a bare array. */
export type TiptapDoc = {
  type: "doc";
  content: Node[];
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
      key?: string;
    };
    body?: TiptapDoc;
    conclusion?: Node[];
    links?: string[];
  };
  creator: string;
};

export type BlogContentProp = {
  title: string;
  description?: string;
  tags?: string[];
  mainImage?: {
    url?: string;
    alt?: string;
    key?: string;
  };
  body?: TiptapDoc;
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
  isSyncing: boolean;
  setIsSyncing: (syncing: boolean) => void;
};

export interface BlogUpload {
  _localID: string;
  content: string;
  creator: string;
}

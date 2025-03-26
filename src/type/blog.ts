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
    level?: number;
    src?: string;
    alt?: string;
  };
};

export type Blog = {
  _id?: string;
  _localID: string;
  content: {
    title: string;
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
  createdAt?: string;
  updatedAt?: string;
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

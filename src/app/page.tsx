import { Editor } from "@/components/editor/Editor";
import { EditorProvider } from "@/store/editor";

export default function Home() {
  return (
    <div className="w-screen max-h-screen h-screen bg-background overflow-hidden select-none">
      <EditorProvider>
        <Editor />
      </EditorProvider>
    </div>
  );
}

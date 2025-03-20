import { PostLayer } from "./list/post-layer";

export const ListLayers
    : React.FC = () => {
        return (
            <div className="basis-[250px] w-full shrink-0 relative scrollbar-h pt-5 px-2">
                <div>
                    <PostLayer />
                </div>
            </div>
        );
    };

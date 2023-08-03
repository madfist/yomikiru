import { useContext, memo, useEffect, useState } from "react";
import { AppContext } from "../App";
// import { setContextMenu } from "../store/contextMenu";
// import { useAppDispatch } from "../store/hooks";

const ReaderSideListItem = memo(
    ({
        name,
        pages,
        link,
        inHistory,
        current,
        focused,
    }: {
        name: string;
        pages: number;
        link: string;
        /**
         * `[0]` - index of manga in history
         * `[1]` - index of chapter in manga chapter read
         */
        inHistory: [number, number];
        current: boolean;
        focused: boolean;
    }) => {
        const { openInReader, setContextMenuData, contextMenuData } = useContext(AppContext);
        const [contextMenuFocused, setContextMenuFocused] = useState(false);
        useEffect(() => {
            if (!contextMenuData) setContextMenuFocused(false);
        }, [contextMenuData]);

        // useEffect(()=>{
        //     if()
        // },[focused])

        return (
            <li
                className={`${inHistory && inHistory[1] >= 0 ? "alreadyRead" : ""} ${current ? "current" : ""} ${
                    contextMenuFocused ? "focused" : ""
                }`}
                data-focused={focused}
                ref={(node) => {
                    // todo, not working
                    if (node && focused) node.scrollIntoView({ block: "nearest" });
                }}
            >
                <a
                    onClick={() => openInReader(link)}
                    title={name}
                    ref={(node) => {
                        if (current && node !== null) node.scrollIntoView({ block: "nearest" });
                    }}
                    onContextMenu={(e) => {
                        const items = [
                            window.contextMenu.template.open(link),
                            window.contextMenu.template.openInNewWindow(link),
                            window.contextMenu.template.showInExplorer(link),
                            window.contextMenu.template.copyPath(link),
                        ];
                        if (inHistory && inHistory[1] >= 0) {
                            items.push(window.contextMenu.template.unreadChapter(...inHistory));
                        }
                        setContextMenuFocused(true);
                        setContextMenuData({
                            clickX: e.clientX,
                            clickY: e.clientY,
                            focusBackElem: e.nativeEvent.relatedTarget,
                            items,
                        });
                    }}
                >
                    <span className="text">{name.split(" $")[0]}</span>
                    {window.app.isSupportedFormat(name) ? (
                        <code className="nonFolder">{name.split(" $")[1]}</code>
                    ) : (
                        <span className="pageNum" title="Total Pages">
                            {pages}
                        </span>
                    )}
                </a>
            </li>
        );
    }
);

export default ReaderSideListItem;

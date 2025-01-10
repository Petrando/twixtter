/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChannelList
} from "stream-chat-react";
import { useSession } from "../SessionProvider";


export default function ChatSidebar() {
    const { user } = useSession();

    return (
        <div
            className="size-full flex-col border-e md:flex md:w-72"
        >            
            <ChannelList />
        </div>
    );
}
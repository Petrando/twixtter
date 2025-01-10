import { cn } from "@/lib/utils";
import {
    Channel,
    ChannelHeader,
    MessageInput,
    MessageList,
    Window,
} from "stream-chat-react";


export default function ChatChannel() {
    return (
        <div className={cn("w-full md:block", !open && "hidden")}>
            <Channel>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                </Window>
            </Channel>
        </div>
    );
}

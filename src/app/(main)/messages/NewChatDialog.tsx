/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface NewChatDialogProps {
    onOpenChange: (open: boolean) => void;
    onChatCreated: () => void;
}

export default function NewChatDialog({
    onOpenChange,
    onChatCreated,
  }: NewChatDialogProps) {

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className="bg-card p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>New chat</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
"use client"

import { useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import profilePic from "@/assets/profile.jpg";

const AppInfoButton = () => {
    const [ showInfo, setShowInfo ] = useState(false)
    return (
        <>
        <Button
            variant="ghost"
            className="flex items-center justify-start gap-3"
            title="About Me"
            onClick={()=>{setShowInfo(prev => !prev)}}
        >
            <Info />
            <span className="hidden lg:inline">App Info</span>
        </Button>
        <InfoDialog open={showInfo} onOpenChange={setShowInfo} />
        </>
    )
}

interface IInfoDialog {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const InfoDialog = ({ open, onOpenChange}: IInfoDialog) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-lg sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex flex-row items-center">
                        <Info className="mr-3" />App Info
                    </DialogTitle>
                </DialogHeader>
                <figure className="mx-2 md:mx-0 max-w-md flex flex-col justify-center items-center pt-8 text-center rounded-t-lg md:rounded-t-none md:rounded-tl-lg">
                    <div className="space-y-1.5">                
                        <figcaption className="flex items-center space-x-3 pl-10">                            
                            <Image
                                src={profilePic}
                                alt="Petrando's Pic"
                                width={100}
                                height={100}
                                className="rounded"
                                />
                            <div className="space-y-0.5 font-medium text-center flex-auto">
                                <p className='text-sm font-semibold italic'>Created by:</p>
                                <div className='text-lg'>Petrando Richard</div>
                                <div className="text-sm font-semibold text-gray-700 dark:text-slate-50">Fullstack Developer</div>
                            </div>
                        </figcaption>
                        <blockquote className="mx-4 mb-4 max-w-2xl text-gray-600 dark:text-gray-50 lg:mb-8">
                            <p className="my-4 font-light">
                                6 years of front-end experience. 2 years of fullstack experience. 
                                <span className="italic">Attention to details.</span> Penchant of problem solving.
                            </p>
                        </blockquote>
                    </div>                
                    <DialogFooter className="w-full flex flex-row items-center justify-end p-2">
                        <SocialIcon url='https://www.linkedin.com/in/petrando-richard/' />
                        <SocialIcon style={{ marginLeft:5 }} url='mailto:petrandorichard@gmail.com' />
                    </DialogFooter>
                </figure>
            </DialogContent>
        </Dialog>
    )
}

export default AppInfoButton
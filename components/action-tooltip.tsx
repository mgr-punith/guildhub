"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionToolTipProps {
  label: string;
  children: React.ReactNode;
  side?: "left" | "right" | "bottom" | "top";
  align?: "start" | "center" | "end";
}

export const ActionToolTip = ( {label, children, side, align} : ActionToolTipProps)=>{
    return(
        <div>
            <TooltipProvider>
                <Tooltip delayDuration={50}>
                    <TooltipTrigger asChild>
                        {children}
                    </TooltipTrigger>
                    <TooltipContent side={side} align={align}>
                        <p className="font-semibold">
                            {label.toLocaleLowerCase()}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

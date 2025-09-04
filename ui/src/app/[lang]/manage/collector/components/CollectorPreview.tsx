import Input from "@/components/form/Input";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";
import { backgroundRepeat } from "html2canvas/dist/types/css/property-descriptors/background-repeat";
import {
    FunctionComponent,
    JSXElementConstructor,
    ReactComponentElement,
    ReactElement,
} from "react";

const CollectorPreview = ({
    titleText,
    subtitleText,
    buttonText,
    showPreview,
    setShowPreview,
    remove,
    form,
}: any) => {
    const type = form.getValues("type");
    const popupSide = form.getValues("popupSide");
    const template = form.getValues("template");
    const direction = form.getValues("direction");
    const btnBgColor = form.getValues("btnBgColor");
    const btnTextColor = form.getValues("btnTextColor");
    const isRtl = direction == "rtl";
    const buttonStyles = {
        backgroundColor: btnBgColor,
        color: btnTextColor
    }

    const PositionWrapper = ({ children }: { children: ReactElement }) => {
        if (type === "bottom-popup") {
            return (
                <>
                    {showPreview && (
                        <div className={cn("fixed bottom-5 left-5 animate-fade-in", popupSide === "right" && 'left-auto right-5')}>
                            {children}
                        </div>
                    )}
                </>
            );
        }
        if (type === "center-popup") {
            return (
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                    <DialogContent raw={true}>{children}</DialogContent>
                </Dialog>
            );
        }
        if (type === "embeded") {
            return <>{showPreview && children}</>;
        }
    };

    const DirectionWrapper = ({ children }: { children: ReactElement }) => {
        return (
            <>
                {showPreview && (
                    <div style={{ direction: direction }}>{children}</div>
                )}
            </>
        );
    };

    const DemoWarningWrapper = ({ children }: { children: ReactElement }) => {
        return (
            <div className="flex flex-col gap-3 bg-secondary/30">
                <span className="opacity-50 text-sm">
                    This is a demo. This is how it will appear for you users
                </span>
                {children}
            </div>
        );
    };

    const BasicTemplatePreview = () => {
        return (
            <Card className="relative py-6 px-8 w-[450px] rounded-md bg-[#fefefe]">
                <div
                    className={cn(
                        "absolute top-5 right-5 w-5 h-5 cursor-pointer",
                        isRtl && "right-auto left-5"
                    )}
                    onClick={remove}
                >
                    <Cross2Icon />
                </div>
                <h2 className="font-semibold text-lg">{titleText}</h2>
                <p className="font-normal opacity-50 text-sm mb-5">
                    {subtitleText}
                </p>
                <Input placeholder="Your email" className="bg-white mb-2" />
                <Button className="w-full rounded-sm" style={buttonStyles}>{buttonText}</Button>
            </Card>
        );
    };

    const CenteredTemplatePreview = () => {
        return (
            <Card className="flex flex-col  items-center text-center relative py-9 px-11 w-[450px] rounded-md bg-[#fefefe]">
                <div
                    className={cn(
                        "absolute top-5 right-5 w-5 h-5 cursor-pointer",
                        isRtl && "right-auto left-5"
                    )}
                    onClick={remove}
                >
                    <Cross2Icon />
                </div>
                <h2 className="font-semibold text-lg">{titleText}</h2>
                <p className="font-normal opacity-50 text-sm mb-5">
                    {subtitleText}
                </p>
                <Input placeholder="Your email" className="bg-white mb-2" />
                <Button className="w-full rounded-sm" style={buttonStyles}>{buttonText}</Button>
            </Card>
        );
    };

    const MinimalTemplatePreview = () => {
        return (
            <Card className="relative py-4 px-6 w-[450px] rounded-md bg-[#fefefe]">
                <div
                    className={cn(
                        "absolute top-5 right-5 w-5 h-5 cursor-pointer",
                        isRtl && "right-auto left-5"
                    )}
                    onClick={remove}
                >
                    <Cross2Icon />
                </div>
                <h2 className="font-semibold text-lg">{titleText}</h2>
                <div className="flex w-full mt-4 gap-2">
                    <Input
                        placeholder="Your email"
                        className="bg-white !flex-grow w-full"
                    />
                    <Button className="rounded-sm whitespace-nowrap" style={buttonStyles}>
                        {buttonText}
                    </Button>
                </div>
            </Card>
        );
    };

    const Error = () => (
        <Card className="fixed bottom-5 left-5 animate-fade-in py-6 px-8 w-[450px] rounded-md bg-[#fefefe] text-destructive border-destructive">
            There seems to be an issue, please refresh the page or contact us!
        </Card>
    );

    const getPreviewFromTemplate = (
        template: string
    ): JSXElementConstructor<any> | null => {
        switch (template) {
            case "template-basic":
                return BasicTemplatePreview;
            case "template-minimal":
                return MinimalTemplatePreview;
            case "template-centered":
                return CenteredTemplatePreview;
            default:
                return null;
        }
    };

    const Preview = getPreviewFromTemplate(template);

    if (!Preview) return <Error />;
    return (
        <PositionWrapper>
            <DemoWarningWrapper>
                <DirectionWrapper>
                    <Preview />
                </DirectionWrapper>
            </DemoWarningWrapper>
        </PositionWrapper>
    );
};

export default CollectorPreview;

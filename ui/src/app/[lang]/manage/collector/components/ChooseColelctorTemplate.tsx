import { useController } from "react-hook-form";
import RadioCard from "./RadioCard";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import Button from "@/components/ui/button";
import IconButton from "@/components/form/IconButton";
import Loader from "@/components/General/Loader";
import { SaveIcon } from "lucide-react";

const ChooseColelctorTemplateForm = ({
    form,
    previousStep,
    nextStep,
    submitQuery,
}: any) => {
    const { field } = useController({
        name: "template",
        control: form.control,
        defaultValue: "template-basic",
    } as any);

    return (
        <div className="flex flex-col items-center gap-10 justify-center pt-9">
            <div>
                <h1 className="text-2xl font-semibold text-center mb-1">
                    Choose a template that you like
                </h1>
                <p className="text-md text-center opacity-60">
                    What UI template suits you best?
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center justify-center">
                <RadioCard
                    title={"Basic"}
                    image="collector-template-basic.png"
                    value="template-basic"
                    variant="template"
                    field={field}
                />
                <RadioCard
                    title={"Minimal"}
                    image="collector-template-minimal.png"
                    value="template-minimal"
                    variant="template"
                    field={field}
                />
                <RadioCard
                    title={"Centered"}
                    image="collector-template-centered.png"
                    value="template-centered"
                    variant="template"
                    field={field}
                />
            </div>
            <div className="flex items-center w-full">
                <IconButton onClick={previousStep} variant={"outline"}>
                    <ArrowLeftIcon />
                    <p>Back</p>
                </IconButton>
                <div className="flex items-center gap-3 ml-auto">
                    
                    <IconButton onClick={nextStep} variant={"outline"}>
                        <p>Next</p>
                        <ArrowRightIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ChooseColelctorTemplateForm;

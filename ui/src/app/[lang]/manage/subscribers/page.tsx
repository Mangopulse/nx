/* eslint-disable react/no-unescaped-entities */
"use client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import IconButton from "@/components/form/IconButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getSubscribersList from "@/services/manage/subscribers/getSubscribersList";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import DataTable from "@/components/General/Table";
import { ColumnDef } from "@tanstack/react-table";
import importSubscribers from "@/services/manage/subscribers/importSubscribers";
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, SetStateAction, useRef, useState } from "react";
import { DownloadIcon, ImportIcon, PlusIcon } from "lucide-react";
import getSubscribersCount from "@/services/manage/subscribers/getSubscribersCount";
import CSVDropzone from "./components/CSVDropZone";
import DownloadTemplateCard from "./components/DownloadTemplateCard";
import Input from "@/components/form/Input";
import AddSubscriberForm from "./components/AddSubscriberForm";
import CheckboxCard from "@/components/form/CheckboxCard";
import { CheckedState } from "@radix-ui/react-checkbox";

interface Subscriber {
    email: string;
    subscriptionDate: Date;
    lastUpdatedDate: Date;
}

export default function Subscribers() {
    const [subscribersToImport, setSubscribersToImport] = useState<Array<any>>(
        []
    );
    const [currentPage, setCurrentPage] = useState(1);

    const tableCols: ColumnDef<any>[] = [
        {
            accessorKey: "firstName",
            header: "First Name",
        },
        {
            accessorKey: "lastName",
            header: "Last Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phone",
            header: "Phone Number",
        },
        {
            accessorKey: "country",
            header: "Country",
        },
        {
            accessorKey: "subscriptionDate",
            header: "Date of subscription",
        },
    ];

    const { toast } = useToast();
    const [offset, setOffset] = useState(0);
    const [importSubscribersOpen, setImportSubscribersOpen] = useState(false);
    const [csvParsingLoading, setCsvParsingLoading] = useState(false);
    const pageSize = 10;

    const { data, isLoading, refetch } = useQuery(
        ["subscribers-list", offset],
        () =>
            getSubscribersList({
                offset: offset,
                limit: pageSize,
            }),
        {
            refetchOnWindowFocus: false,
        }
    );

    const subscribersCountQ = useQuery(
        ["subscribers-count"],
        () => getSubscribersCount(),
        {
            refetchOnWindowFocus: false,
        }
    );

    const importSubscribersQ = useMutation(importSubscribers, {
        onSuccess: (res: any) => {
            if (res?.code == 200) {
                toast({
                    title: "Subscribers imported successfully",
                });
                refetch();
                subscribersCountQ.refetch();
                setImportSubscribersOpen(false);
                setAddSubscriberOpen(false);
            } else
                toast({
                    description: "Something went wrong, try again please",
                    variant: "destructive",
                });
        },
    });

    const subscribers =
        data?.subscribers?.map((row: any) => ({
            email: row.email,
            firstName: row.firstName,
            lastName: row.lastName,
            phone: row.phone,
            country: row.country,
            subscriptionDate: new Date(
                row.subscriptionDate
            )?.toLocaleDateString(),
        })) || [];

    function validateEmail(value: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value.trim());
    }

    const [consent, setConsent] = useState<CheckedState>(false);

    const onEmailsSubmit = async () => {
        if (!consent || !subscribersToImport) return;
        await importSubscribersQ.mutateAsync({
            subscribers: subscribersToImport,
        });
    };

    const checkHeaders = (headersArray: string[]) => {
        return headersArray.some((header) =>
            [
                "firstname",
                "lastname",
                "email",
                "phonenumber",
                "country",
            ].includes(header.toLowerCase().replaceAll(" ", ""))
        );
    };

    const findHeaderColumnIndex = (
        headersArray: string[],
        headerName: string
    ) => {
        return headersArray.findIndex((header) =>
            header.toLowerCase().includes(headerName)
        );
    };

    const mapSubscribers = (headers: string[], subscribers: string[][]) => {
        const firstNameColumnIndex = findHeaderColumnIndex(headers, "first");
        const lastNameColumnIndex = findHeaderColumnIndex(headers, "last");
        const emailColumnIndex = findHeaderColumnIndex(headers, "email");
        const phoneColumnIndex = findHeaderColumnIndex(headers, "phone");
        const countryColumnIndex = findHeaderColumnIndex(headers, "country");
        return subscribers.map((subscriber: string[]) => ({
            email: subscriber[emailColumnIndex],
            firstName: subscriber[firstNameColumnIndex],
            lastName: subscriber[lastNameColumnIndex],
            phone: subscriber[phoneColumnIndex],
            country: subscriber[countryColumnIndex],
        }));
    };

    console.log(subscribersToImport);

    const handleFileSelect = (acceptedFiles: any) => {
        if (!acceptedFiles?.length) return;
        const selectedFile = acceptedFiles[0];
        if (!selectedFile) return;
        if (
            ![
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "text/csv",
            ].includes(selectedFile.type)
        ) {
            return toast({
                title: "Only .csv files are accepted",
                description: "Make sure your file extension is .csv",
                variant: "destructive",
            });
        }
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function (event) {
            const csv = event.target?.result as string;
            let arrFromCSV: any;
            try {
                arrFromCSV = csv
                    .split("\n")
                    .filter((e) => e !== "")
                    .map((e) => e.split(",").map((e) => e.trim()));
            } catch (e) {
                return toast({
                    title: "CSV is in unsupported format",
                    description: "Make sure you follow the template provided",
                    variant: "destructive",
                });
            }
            if (!arrFromCSV || !arrFromCSV?.length) {
                return toast({
                    title: "CSV is in unsupported format",
                    description: "Make sure you follow the template provided",
                    variant: "destructive",
                });
            }
            const headersExist = checkHeaders(arrFromCSV[0]);
            if (!headersExist) {
                return toast({
                    title: "No correct headers were not found",
                    description:
                        "Make sure you include the first row as the headers for your columns following the csv template",
                    variant: "destructive",
                });
            }
            // return console.log(arrFromCSV);
            setSubscribersToImport(((_) => {
                let cleanedSubscribers = [];
                let invalidEmailsCount = 0;
                const emailColumnIndex = findHeaderColumnIndex(
                    arrFromCSV[0],
                    "email"
                );
                if (emailColumnIndex === -1) {
                    toast({
                        title: "Email Column not found",
                        description:
                            "Make sure you include a column with emails with a header of 'email'",
                        variant: "destructive",
                    });
                    return [];
                }
                // find invalid emails
                const emails = arrFromCSV
                    .slice(1)
                    .map((row: string[]) => row[emailColumnIndex]);
                for (let i = 0; i < emails.length; i++) {
                    if (
                        !emails[i] ||
                        emails[i]?.trim() === "" ||
                        !validateEmail(emails[i].trim())
                    ) {
                        invalidEmailsCount++;
                        continue;
                    }
                    cleanedSubscribers.push(arrFromCSV[i + 1]);
                }
                if (invalidEmailsCount > 0) {
                    toast({
                        title: "Warning! Some of the subscribers were not imported",
                        description: `${invalidEmailsCount} subscriber${
                            invalidEmailsCount > 1 ? "s" : ""
                        } ${
                            invalidEmailsCount > 1 ? "were" : "was"
                        } either missing an email or the email was not valid.`,
                        variant: "warning",
                    });
                }

                cleanedSubscribers = mapSubscribers(
                    arrFromCSV[0],
                    cleanedSubscribers
                );
                return cleanedSubscribers;
            }) as SetStateAction<Array<any>>);
            setCsvParsingLoading(false);
        };
    };

    const pagesCount =
        subscribersCountQ.data?.count &&
        Math.ceil(subscribersCountQ.data?.count / pageSize);

    const [subscriberEmail, setSubscriberEmail] = useState();
    const [addSubscriberOpen, setAddSubscriberOpen] = useState(false);

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-primary/70">
                        {subscribersCountQ.isLoading ? (
                            "All Subscribers"
                        ) : (
                            <>
                                <span>
                                    You have{" "}
                                    <span className="font-semibold text-primary">
                                        {subscribersCountQ.data?.count}
                                    </span>{" "}
                                    subscribers.
                                </span>
                            </>
                        )}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Popover
                        open={addSubscriberOpen}
                        onOpenChange={setAddSubscriberOpen}
                    >
                        <PopoverTrigger
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "flex items-center gap-2"
                            )}
                        >
                            {/* <Send size={17} /> */}
                            <span> Add Subscriber </span>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] space-y-1 p-3 pt-2">
                            <AddSubscriberForm
                                importSubscribersQ={importSubscribersQ}
                            />
                        </PopoverContent>
                    </Popover>
                    <Dialog
                        open={importSubscribersOpen}
                        onOpenChange={(open) => {
                            setImportSubscribersOpen(open);
                            if (open) setSubscribersToImport([]);
                        }}
                    >
                        <DialogTrigger
                            className={cn(
                                buttonVariants(),
                                "flex items-center gap-2"
                            )}
                        >
                            <PlusIcon size={15} />
                            <span>Import Subscribers</span>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Import emails</DialogTitle>
                                <DialogDescription>
                                    Fill your subscribers' info in a csv file
                                    (excel, google sheets...) and drop it below
                                    to import them.
                                </DialogDescription>
                            </DialogHeader>
                            <CSVDropzone
                                handleFileSelect={handleFileSelect}
                                setCsvParsingLoading={setCsvParsingLoading}
                                csvParsingLoading={csvParsingLoading}
                                subscribers={subscribersToImport}
                            />
                            <CheckboxCard
                                name={"consent"}
                                label={"I have the consent of the subscriber"}
                                description={
                                    "This is required before importing"
                                }
                                id="consent"
                                onCheckedChange={(e: CheckedState) =>
                                    setConsent(e)
                                }
                            />
                            <div className="mt-3">
                                <DialogTitle className="text-sm mt-3 mb-1">
                                    Unsure about how to arrange your list?
                                </DialogTitle>
                                <DialogDescription className="text-sm mb-4">
                                    Download the csv template below and follow
                                    the format used in it. If your list does not
                                    have all the fields, keep the cell empty.
                                </DialogDescription>
                                <DownloadTemplateCard />
                            </div>

                            <DialogFooter className="flex items-center justify-end">
                                <IconButton
                                    onClick={onEmailsSubmit}
                                    disabled={
                                        !consent ||
                                        subscribersToImport?.length === 0
                                    }
                                >
                                    {importSubscribersQ.isLoading ? (
                                        <MiniRotatingLoader />
                                    ) : (
                                        "Submit"
                                    )}
                                </IconButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <DataTable
                columns={tableCols}
                data={subscribers}
                manualPagination={true}
                moveNext={() => {
                    setCurrentPage(currentPage + 1);
                    setOffset(offset + pageSize);
                }}
                movePrev={() => {
                    setCurrentPage(currentPage - 1);
                    setOffset(offset - pageSize);
                }}
                pageSize={pageSize}
                isLoading={isLoading}
                canMoveNext={
                    subscribersCountQ.data?.count
                        ? offset + pageSize < subscribersCountQ.data?.count
                        : true
                }
                canMovePrev={offset !== 0}
                pagesCount={pagesCount}
                currentPage={currentPage}
            />
        </>
    );
}

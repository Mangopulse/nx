import auth from "@/lib/Auth";
import getWebsiteConfig from "@/services/website/getWebsiteConfig";
import { Config } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function useWebsiteConfig(): {
    isLoading: boolean;
    isFetching: boolean;
    config: Config;
    refetch: Function;
} {
    const configQ = useQuery(
        ["website-config", auth.getUser()?.sender],
        getWebsiteConfig,
        { refetchOnWindowFocus: false }
    );
    if (configQ.isSuccess) {
        const senderType = configQ.data.senderType;
        const senderEmail = configQ.data.senderEmail;
        const currentSender = auth.getUser()?.sender;
        const senderChanged = (currentSender?.type !== senderType) || (currentSender?.email !== senderEmail);
        if (currentSender && senderChanged) {
            auth.setSender({
                ...currentSender,
                type: senderType,
                email: configQ.data.senderEmail,
            });
        }
    }

    return {
        isLoading: configQ.isLoading,
        isFetching: configQ.isFetching,
        refetch: configQ.refetch,
        config: configQ.data,
    };
}

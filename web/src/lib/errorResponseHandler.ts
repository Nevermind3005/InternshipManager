import { HTTPError } from "ky";
import { type IntlShape } from "react-intl";
import { toast } from "sonner";

export const errorResponseHandler = async (error: Error, intl: IntlShape) => {
    let message = intl.formatMessage({ id: "Error.Generic" });
    if (error instanceof HTTPError) {
        try {
            const data = await error.response.json();
            message = intl.formatMessage({ id: data.title });
        } catch {
            message = error.message;
        }
    }
    toast.error(message);
};

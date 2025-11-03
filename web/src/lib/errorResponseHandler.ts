import { HTTPError } from "ky";
import { type IntlShape } from "react-intl";
import { toast } from "sonner";

export const errorResponseHandler = async (error: Error, intl: IntlShape) => {
    let message = intl.formatMessage({ id: "Error.Generic" });
    if (error instanceof HTTPError) {
        try {
            const data = await error.response.json();
            console.log(1);
            message = intl.formatMessage({ id: data.title });
        } catch {
            console.log(2);

            message = error.message;
        }
    } else {
        console.log(3);

        message = error.message;
    }
    toast.error(message);
};

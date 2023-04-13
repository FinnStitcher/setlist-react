import { DateTime } from "luxon";

function useDateTime(isoDate) {
    // parse into luxon format
    const luxonDate = DateTime.fromISO(isoDate);

    // parse into locale string
    const formattedDate = luxonDate.toLocaleString(DateTime.DATETIME_MED);

    return formattedDate;
};

export default useDateTime;
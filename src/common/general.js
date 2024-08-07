import { statusColors } from "@/common/enumType.js";

export const toPascalCase = (str) => {
    return str
    .toLowerCase()
    .replace(/(?:^|\s|_|\-)\w/g, (match) => match.toUpperCase());
};

export const getStatusColor = (status) => {
    return statusColors[status.toLowerCase()] || '#009987'; // Default to white if status is not found
};
  
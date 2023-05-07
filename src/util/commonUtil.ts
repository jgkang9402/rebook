export const enterInput = (e: React.KeyboardEvent, paramFunc: () => void) => {
  if (e.key === "Enter") {
    paramFunc();
  }
};

export const isEmpty = (value: string | object | any[] | number): boolean => {
  if (typeof value === "string" && value.trim() === "") {
    return true;
  } else if (typeof value === "object" && value !== null) {
    return Object.keys(value).length === 0;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return false;
  }
};

type QueryObject = {
  [key: string]: string;
};

export const querystringToObject = (queryString: string): QueryObject => {
  const queryObject: QueryObject = {};

  if (!queryString) {
    return queryObject;
  }

  const queryParams = queryString.substr(1).split("&");

  for (const param of queryParams) {
    const [key, value] = param.split("=");

    if (!key) {
      continue;
    }

    queryObject[key] = value;
  }

  return queryObject;
};

export const objectToQuerystring = (queryObject: QueryObject): string => {
  const queryString = Object.entries(queryObject)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `?${queryString}`;
};

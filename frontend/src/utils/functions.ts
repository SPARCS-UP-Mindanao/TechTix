export const arraysEqual = (arrayA: any[], arrayB: any[]) => {
  return (
    Array.isArray(arrayA) &&
    Array.isArray(arrayB) &&
    arrayA.length === arrayB.length &&
    arrayA.every((value, index) => value === arrayB[index])
  );
};

export const deepEqual = <T extends { [_: string]: any }>(a: T, b: T) => {
  if (a === b) {
    return true;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (!a || !b || (typeof a !== "object" && typeof b !== "object")) {
    return a === b;
  }

  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  aKeys.sort();
  bKeys.sort();
  for (let i = 0; i < aKeys.length; i++) {
    if (aKeys[i] !== bKeys[i]) {
      return false;
    }

    const key = aKeys[i];
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return typeof a === typeof b;
};

export const isEmpty = (value: any) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  if (typeof value === "function") {
    return value.toString().trim() === "function() {}";
  }

  return false;
};

export const dateFormatter = (value: any) =>
  value ? new Date(value).toLocaleDateString(
    'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  ) : "";

export const timeFormatter = (value: any) =>
  value ? new Date(value).toLocaleTimeString(
    'en-US', {
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
    }
  ) : "";

export const fromToDateFormatter = (fromDate: Date, toDate: Date) => {
  const fromDateString = dateFormatter(fromDate)
  const toDateString = dateFormatter(toDate)
  const fromTimeString = timeFormatter(fromDate)
  const toTimeString = timeFormatter(toDate)

  // if dates are the same show only then show only the first date and their time
  if (fromDateString === toDateString) {
    return `${fromDateString} | ${fromTimeString} - ${toTimeString}`
  }

  // if dates are different show both dates and their time
  return `${fromDateString} ${fromTimeString} - ${toDateString} ${toTimeString}`
}


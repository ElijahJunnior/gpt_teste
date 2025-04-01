interface IComparison {
  first: string;
  second: string;
  sortType?: "asc" | "desc";
}

export function stringComparisonToSort({
  first,
  second,
  sortType = "asc",
}: IComparison): number {
  if (first < second) {
    return sortType === "asc" ? -1 : 1;
  } else if (first > second) {
    return sortType === "asc" ? 1 : -1;
  } else {
    return 0;
  }
}

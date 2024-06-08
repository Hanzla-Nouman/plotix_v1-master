interface Args {
  data: any[],
  isLoading?: boolean,
  take?: number
}

export default function prepareDataForMapping({ data, isLoading, take = 15 }: Args) {
  const dataToMap = isLoading
    ? Array(take).fill(null)
    : data;

  return dataToMap;
}

export function getUrlFromBucket(fileName: string) {
  if (process.env.S3_HOST) {
    return `http://${process.env.S3_HOST}:${process.env.S3_PORT}/ui/${process.env.NEXT_PUBLIC_S3_BUCKET}/${fileName}`;
  }
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${fileName}`;
}

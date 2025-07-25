export type RootPageProps = {
  name?: string;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  [key: string]: unknown;
};

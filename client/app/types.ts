export type JsonApiError = {
  errors: [
    {
      status: number;
      title: string;
    },
  ];
};

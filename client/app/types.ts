export type JsonApiError = {
  errors: [
    {
      status: number;
      title: string;
    },
  ];
};

export type Position = {
  x: number;
  y: number;
};

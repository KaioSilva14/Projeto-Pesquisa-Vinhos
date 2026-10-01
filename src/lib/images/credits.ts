import type { ImageAsset } from "@/schemas/image-asset";

/** Uma linha da lista de créditos (/sobre#creditos): a foto, de quem é e onde aparece. */
export type ImageCreditItem = {
  image: ImageAsset;
  /** Nome da entidade fotografada, com link para a página dela. */
  subjectName: string;
  href: string;
};

export type ImageCreditGroup = {
  title: string;
  items: ImageCreditItem[];
};

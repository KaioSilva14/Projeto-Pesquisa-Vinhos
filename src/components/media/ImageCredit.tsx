import type { ImageAsset } from "@/schemas/image-asset";
import { cn } from "@/lib/cn";

type ImageCreditProps = {
  image: Pick<
    ImageAsset,
    "credit" | "license" | "licenseUrl" | "sourceUrl" | "modified" | "isIllustrative"
  >;
  className?: string;
};

const linkClass = "underline underline-offset-2 hover:text-text";

/** Atribuição da foto: autor, licença e origem (exigência das licenças CC, IMAGES.md §3). */
export function ImageCredit({ image, className }: ImageCreditProps) {
  return (
    <p className={cn("text-caption text-text-subtle", className)}>
      {image.isIllustrative && <span className="font-medium">Imagem ilustrativa. </span>}
      Foto: {image.credit} ·{" "}
      {image.licenseUrl ? (
        <a href={image.licenseUrl} rel="noopener noreferrer license" className={linkClass}>
          {image.license}
        </a>
      ) : (
        image.license
      )}{" "}
      ·{" "}
      <a href={image.sourceUrl} rel="noopener noreferrer" className={linkClass}>
        Origem
      </a>
      {image.modified && <> · Modificada: {image.modified}</>}
    </p>
  );
}

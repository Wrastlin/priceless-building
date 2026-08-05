import React from "react";
import { Img, staticFile } from "remotion";
import { ProductPlaceholder } from "./ProductPlaceholder";

type ProductAssetProps = {
  productSrc?: string;
  alt: string;
  fit?: "contain" | "cover";
  position?: string;
};

const resolveProductSrc = (productSrc: string) => {
  if (
    productSrc.startsWith("http://") ||
    productSrc.startsWith("https://") ||
    productSrc.startsWith("data:")
  ) {
    return productSrc;
  }

  return staticFile(productSrc.replace(/^\/+/, ""));
};

export const ProductAsset: React.FC<ProductAssetProps> = ({
  productSrc,
  alt,
  fit = "contain",
  position = "center",
}) => {
  if (!productSrc) {
    return <ProductPlaceholder kind="fixture" pushAmount={0} />;
  }

  return (
    <Img
      src={resolveProductSrc(productSrc)}
      alt={alt}
      style={{
        width: "100%",
        height: "100%",
        objectFit: fit,
        objectPosition: position,
      }}
    />
  );
};

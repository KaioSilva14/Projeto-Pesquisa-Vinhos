import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EntityImage } from "@/components/media/EntityImage";
import { ImageCredit } from "@/components/media/ImageCredit";

import { exampleImage } from "../fixtures/images";

describe("EntityImage", () => {
  it("sem imagem, mostra 'Imagem indisponível' em vez de inventar uma", () => {
    render(<EntityImage image={undefined} variant="bottle" sizes="100vw" />);
    expect(screen.getByRole("img", { name: "Imagem indisponível" })).toBeInTheDocument();
  });

  it("mantém a proporção esperada no estado indisponível (sem pulo de layout)", () => {
    render(<EntityImage image={undefined} variant="bottle" sizes="100vw" />);
    expect(screen.getByRole("img", { name: "Imagem indisponível" })).toHaveClass("aspect-[3/4]");
  });

  it("com imagem, usa o texto alternativo cadastrado", () => {
    render(<EntityImage image={exampleImage} variant="grape" sizes="100vw" />);
    expect(screen.getByRole("img", { name: exampleImage.alt })).toBeInTheDocument();
  });

  it("se o arquivo falhar ao carregar, troca pelo aviso honesto", () => {
    render(<EntityImage image={exampleImage} variant="grape" sizes="100vw" />);
    fireEvent.error(screen.getByRole("img", { name: exampleImage.alt }));
    expect(screen.getByRole("img", { name: "Imagem indisponível" })).toBeInTheDocument();
  });

  it("mostra o crédito quando pedido", () => {
    render(<EntityImage image={exampleImage} variant="grape" sizes="100vw" showCredit />);
    expect(screen.getByText(/Foto: Autor Exemplo/)).toBeInTheDocument();
  });
});

describe("ImageCredit", () => {
  it("liga a licença e a origem", () => {
    render(<ImageCredit image={exampleImage} />);
    expect(screen.getByRole("link", { name: "CC BY 4.0" })).toHaveAttribute(
      "href",
      exampleImage.licenseUrl,
    );
    expect(screen.getByRole("link", { name: "Origem" })).toHaveAttribute(
      "href",
      exampleImage.sourceUrl,
    );
  });

  it("links externos não repassam acesso à janela (noopener)", () => {
    render(<ImageCredit image={exampleImage} />);
    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });

  it("marca imagens genéricas como ilustrativas", () => {
    render(<ImageCredit image={{ ...exampleImage, isIllustrative: true }} />);
    expect(screen.getByText(/Imagem ilustrativa\./)).toBeInTheDocument();
  });
});

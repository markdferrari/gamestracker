import { render, screen } from "@testing-library/react";
import type React from "react";
import { Header } from "../Header";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => {
    const { src, alt, ...rest } = props;
    return <img src={src} alt={alt} {...rest} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("../ThemeToggle", () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}));

describe("Header", () => {
  it("renders the logo and toggle", () => {
    render(<Header />);

    expect(screen.getByAltText("WhenCanIPlayIt logo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Theme" })).toBeInTheDocument();
  });
});

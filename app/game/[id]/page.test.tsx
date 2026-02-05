import { render, screen } from "@testing-library/react";
import type React from "react";
import GameDetailPage from "./page";
import type { IGDBGame } from "@/lib/igdb";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string },
  ) => {
    const { src, alt, ...rest } = props;
    return <img src={src} alt={alt} {...rest} />;
  },
}));

jest.mock("@/components/GameLinks", () => ({
  GameLinks: () => <div>Links</div>,
}));

jest.mock("@/components/ReviewSection", () => ({
  ReviewSection: () => <div>Reviews</div>,
}));

jest.mock("@/components/ScreenshotGallery", () => ({
  ScreenshotGallery: ({ title }: { title: string }) => <div>Gallery {title}</div>,
}));

jest.mock("@/lib/igdb", () => ({
  getGameById: jest.fn(),
  formatReleaseDate: jest.fn((timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }),
}));

jest.mock("@/lib/notes", () => ({
  getGameNote: jest.fn(),
}));

describe("GameDetailPage", () => {
  const getGameByIdMock = jest.requireMock("@/lib/igdb").getGameById as jest.Mock;
  const getGameNoteMock = jest.requireMock("@/lib/notes").getGameNote as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-02-05T00:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders a prominent release date badge", async () => {
    const game: IGDBGame = {
      id: 1,
      name: "Test Game",
      cover: { url: "//images.igdb.com/igdb/image/upload/t_thumb/test.jpg" },
      release_dates: [
        {
          human: "Feb 15, 2026",
          date: Math.floor(new Date("2026-02-15T00:00:00Z").getTime() / 1000),
          platform: { id: 167, name: "PlayStation 5" },
        },
      ],
      platforms: [{ id: 167, name: "PlayStation 5" }],
      summary: "Summary",
      screenshots: [],
    };

    getGameByIdMock.mockResolvedValue(game);
    getGameNoteMock.mockResolvedValue(null);

    const ui = await GameDetailPage({
      params: Promise.resolve({ id: "1" }),
    });

    render(ui);

    const badge = screen.getByTestId("release-date-hero");
    expect(badge).toHaveTextContent("Feb 15, 2026");
    expect(badge).toHaveTextContent("days away");
  });
});

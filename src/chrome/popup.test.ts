import { closePopup } from "@/chrome/popup";

describe("popup", () => {
  it("closes the window when close is called", () => {
    const closeMock = jest.fn();

    closePopup({ close: closeMock });

    expect(closeMock).toHaveBeenCalled();
  });
});

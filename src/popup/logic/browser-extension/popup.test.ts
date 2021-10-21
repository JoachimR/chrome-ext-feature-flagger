import { closePopup } from "@/popup/logic/browser-extension/popup";

describe("popup", () => {
  it("closes the window when close is called", () => {
    const closeMock = jest.fn();

    closePopup({ close: closeMock });

    expect(closeMock).toHaveBeenCalled();
  });
});

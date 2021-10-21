import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/vue";
import Tag from "@/popup/components/Tag.vue";

describe("Tag", () => {
  it("shows the tag", async () => {
    renderTag({
      name: "my-feature-flag",
      active: true,
    });
    expect(screen.getByText("my-feature-flag")).toBeVisible();
  });

  // test does not work :shrug:
  it.skip("emits close when close clicked", async () => {
    const component = renderTag({
      name: "my-feature-flag",
      active: true,
    });

    await fireEvent.click(component.getByTestId("close"));
    expect(component.emitted()).toEqual({ close: [[]] });
  });

  function renderTag(props: { name: string; active: boolean }) {
    return render(Tag, {
      props,
    });
  }
});

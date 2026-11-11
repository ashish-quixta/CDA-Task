import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ProductPage from "@/components/ProductPage";

describe("order sheet", () => {
  it("updates the live total for Delivery + Assembly + Hardware kit", async () => {
    const user = userEvent.setup();
    render(<ProductPage />);

    await user.click(
      screen.getByRole("button", { name: "Add to order" }),
    );
    const dialog = screen.getByRole("dialog");

    await user.click(within(dialog).getByLabelText("Delivery ($25)"));
    await user.click(within(dialog).getByLabelText("Assembly ($40)"));
    await user.click(within(dialog).getByLabelText("Hardware kit ($30)"));

    expect(within(dialog).getByText("$275")).toBeInTheDocument();
  });

  it("clears Assembly when Pickup is chosen and confirms without Assembly", async () => {
    const user = userEvent.setup();
    render(<ProductPage />);

    await user.click(
      screen.getByRole("button", { name: "Add to order" }),
    );
    const dialog = screen.getByRole("dialog");

    await user.click(within(dialog).getByLabelText("Delivery ($25)"));
    await user.click(within(dialog).getByLabelText("Assembly ($40)"));
    await user.click(within(dialog).getByLabelText("Pickup ($0)"));

    const assembly = within(dialog).getByLabelText("Assembly ($40)");
    expect(assembly).not.toBeChecked();
    expect(assembly).toBeDisabled();
    expect(within(dialog).getByRole("status")).toHaveTextContent("$180");

    await user.click(within(dialog).getByLabelText("Hardware kit ($30)"));
    await user.click(
      within(dialog).getByRole("button", { name: "Add to order" }),
    );

    expect(
      within(dialog).getByRole("heading", { name: "Added to your order" }),
    ).toBeInTheDocument();
    expect(within(dialog).queryByText("Assembly")).not.toBeInTheDocument();
  });

  it("shows a fulfillment error when submitting without a choice", async () => {
    const user = userEvent.setup();
    render(<ProductPage />);

    await user.click(
      screen.getByRole("button", { name: "Add to order" }),
    );
    const dialog = screen.getByRole("dialog");

    await user.click(
      within(dialog).getByRole("button", { name: "Add to order" }),
    );

    expect(within(dialog).getByRole("alert")).toHaveTextContent(
      "Choose pickup or delivery",
    );
    expect(
      within(dialog).getByRole("heading", { name: "Configure your shelf" }),
    ).toBeInTheDocument();
  });
});

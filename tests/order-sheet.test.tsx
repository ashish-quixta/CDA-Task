import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProductPage from "@/components/ProductPage";
import { PRODUCT } from "@/lib/product";

function mockProductOk() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => PRODUCT,
    }),
  );
}

describe("order sheet", () => {
  beforeEach(() => {
    mockProductOk();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function openDialog() {
    const user = userEvent.setup();
    render(<ProductPage />);

    const addButton = await screen.findByRole("button", {
      name: "Add to order",
    });
    await user.click(addButton);
    return { user, dialog: screen.getByRole("dialog") };
  }

  it("updates the live total for Delivery + Assembly + Hardware kit", async () => {
    const { user, dialog } = await openDialog();

    await user.click(within(dialog).getByLabelText("Delivery ($25)"));
    await user.click(within(dialog).getByLabelText("Assembly ($40)"));
    await user.click(within(dialog).getByLabelText("Hardware kit ($30)"));

    expect(within(dialog).getByText("$275")).toBeInTheDocument();
  });

  it("clears Assembly when Pickup is chosen and confirms without Assembly", async () => {
    const { user, dialog } = await openDialog();

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
    const { user, dialog } = await openDialog();

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

  it("shows an error state when the product API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "unavailable" }),
      }),
    );

    render(<ProductPage />);

    expect(
      await screen.findByText("Could not load the product"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();

    mockProductOk();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add to order" }),
      ).toBeInTheDocument();
    });
  });
});

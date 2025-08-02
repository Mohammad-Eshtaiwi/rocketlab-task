import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach, vi } from "vitest";
import Home from "@/app/page";
import QueryProvider from "@/lib/providers/QueryProvider";
import { queryClient } from "@/lib/queries/queryClient";
import { db } from "@/lib/db";

async function addTask(taskName: string, priority: string) {
  const user = userEvent.setup();

  // Re-query for the input every time to get the freshest element
  const taskInput = await screen.findByPlaceholderText("Add a new task");

  // This is the most reliable way to handle the input field
  await user.clear(taskInput); // Defensively clear it
  await user.type(taskInput, taskName);

  const prioritySelect = await screen.findByRole("combobox");
  await user.selectOptions(prioritySelect, priority);

  const addButton = await screen.findByRole("button", { name: /add/i });
  await user.click(addButton);
}

// Test wrapper that includes all providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}

// Helper to render the full app
function renderApp() {
  return render(
    <TestWrapper>
      <Home />
    </TestWrapper>
  );
}

describe("Task Management App - Full Integration", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // 1. Clear the React Query cache between tests.
    // This is crucial to prevent stale data from being used.
    queryClient.clear();

    // 2. Clear all data from the database tables.
    // This ensures no data leaks between tests from the DB side.
    await db.tasks.clear();
  });

  test("should render the complete app", async () => {
    renderApp();

    // Check that all main components are rendered
    expect(screen.getByPlaceholderText("Add a new task")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();

    // Should show empty state initially
    await waitFor(() => {
      expect(
        screen.getByText("No tasks yet. Add one above!")
      ).toBeInTheDocument();
    });
  });

  test("should handle complete task workflow", async () => {
    const user = userEvent.setup();
    renderApp();

    // Wait for initial load
    await waitFor(() => {
      expect(
        screen.getByText("No tasks yet. Add one above!")
      ).toBeInTheDocument();
    });

    // 1. Add first task
    await addTask("Buy groceries", "High");

    // Verify first task appears
    await waitFor(() => {
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText("high")).toBeInTheDocument();
      expect(screen.getByText("1 items left")).toBeInTheDocument();
    });

    // await waitFor(() => {
    //   expect(screen.getByPlaceholderText("Add a new task")).toHaveValue("");
    // });

    // 2. Add second task
    await addTask("Walk the dog", "Medium");

    // Verify second task appears
    await waitFor(() => {
      expect(screen.getByText("Walk the dog")).toBeInTheDocument();
      expect(screen.getByText("medium")).toBeInTheDocument();
      expect(screen.getByText("2 items left")).toBeInTheDocument();
    });

    // 3. Add third task
    await addTask("Finish project", "Low");

    // Verify third task appears
    await waitFor(() => {
      expect(screen.getByText("Finish project")).toBeInTheDocument();
      expect(screen.getByText("low")).toBeInTheDocument();
      expect(screen.getByText("3 items left")).toBeInTheDocument();
    });

    // 4. Complete first task (Buy groceries) by clicking the status button twice
    const statusButtons = screen.getAllByLabelText(/Mark task as/);

    await user.click(statusButtons[0]); // Last task's status button
    // Wait until the status button's data-status is "active" before clicking again
    await waitFor(() => {
      expect(statusButtons[0]).toHaveAttribute("data-status", "active");
    });
    await user.click(statusButtons[0]); // Last task's status button

    // Verify task count decreased
    await waitFor(() => {
      expect(screen.getByText("2 items left")).toBeInTheDocument();
    });

    // 5. Complete second task (Walk the dog) by clicking the status button twice
    await user.click(statusButtons[1]); // Second task's status button
    // Wait until the status button's data-status is "active" before clicking again
    await waitFor(() => {
      expect(statusButtons[1]).toHaveAttribute("data-status", "active");
    });
    await user.click(statusButtons[1]); // Second task's status button again

    // Verify task count decreased again
    await waitFor(() => {
      expect(screen.getByText("1 items left")).toBeInTheDocument();
    });

    // // 6. Test filtering to "Active" - should show only uncompleted task
    await user.click(statusButtons[2]); // First task's status button once to make it active
    await user.click(screen.getByText("Active"));

    await waitFor(() => {
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.queryByText("Finish project")).not.toBeInTheDocument();
      expect(screen.queryByText("Walk the dog")).not.toBeInTheDocument();
    });

    // // 7. Test filtering to "Completed" - should show completed tasks
    await user.click(screen.getByText("Completed"));

    await waitFor(() => {
      expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();
      expect(screen.queryByText("Finish project")).toBeInTheDocument();
      expect(screen.queryByText("Walk the dog")).toBeInTheDocument();
    });

    // 8. Test filtering back to "All" - should show all tasks
    await user.click(screen.getByText("All"));

    await waitFor(() => {
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText("Walk the dog")).toBeInTheDocument();
      expect(screen.getByText("Finish project")).toBeInTheDocument();
    });

    // 9. Test "Clear Completed" functionality
    vi.spyOn(window, "confirm").mockReturnValue(true);
    await user.click(screen.getByRole("button", { name: /clear completed/i }));

    await waitFor(() => {
      // Should only show the active task now
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.queryByText("Finish project")).not.toBeInTheDocument();
      expect(screen.queryByText("Walk the dog")).not.toBeInTheDocument();
      expect(screen.getByText("1 items left")).toBeInTheDocument();
    });
  });

  test("should handle task deletion", async () => {
    const user = userEvent.setup();
    renderApp();

    // Wait for initial load
    await waitFor(() => {
      expect(
        screen.getByText("No tasks yet. Add one above!")
      ).toBeInTheDocument();
    });

    // Add a task
    await user.type(
      screen.getByPlaceholderText("Add a new task"),
      "Task to delete"
    );
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Verify task appears
    await waitFor(() => {
      expect(screen.getByText("Task to delete")).toBeInTheDocument();
      expect(screen.getByText("1 items left")).toBeInTheDocument();
    });

    // Mock window.confirm to return true for deletion
    vi.spyOn(window, "confirm").mockReturnValue(true);

    // Delete the task
    const deleteButton = screen.getByLabelText(/Delete task/);
    await user.click(deleteButton);

    // Verify task is gone
    await waitFor(() => {
      expect(screen.queryByText("Task to delete")).not.toBeInTheDocument();
      expect(
        screen.getByText("No tasks yet. Add one above!")
      ).toBeInTheDocument();
    });
  });

  test("should handle form validation", async () => {
    const user = userEvent.setup();

    // Mock window.alert
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    renderApp();

    // Wait for initial load
    await waitFor(() => {
      expect(
        screen.getByText("No tasks yet. Add one above!")
      ).toBeInTheDocument();
    });

    // Try to submit empty form
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Should show alert for empty task
    expect(alertSpy).toHaveBeenCalledWith("Task is required");

    // Should still show empty state
    expect(
      screen.getByText("No tasks yet. Add one above!")
    ).toBeInTheDocument();
  });

  test("should show loading states", async () => {
    const user = userEvent.setup();
    renderApp();

    // Initially should show loading
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(
        screen.getByText("No tasks yet. Add one above!")
      ).toBeInTheDocument();
    });

    // Add a task to test button loading state
    await user.type(screen.getByPlaceholderText("Add a new task"), "Test task");

    // The button should briefly show "Adding..." state
    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    // Wait for task to appear
    await waitFor(() => {
      expect(screen.getByText("Test task")).toBeInTheDocument();
    });
  });
});

"use client";
import { useTasks } from "@/hooks/useTasks";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import Form from "@/components/Form";
import ListContainer from "@/components/List/ListContainer";
import ListItem from "@/components/List/ListItem";
import ListMeta from "@/components/List/ListMeta";

export default function Home() {
  const { activeFilter, setActiveFilter, getFilteredStatus, filterOptions } = useTaskFilters();
  const { tasks, isLoading, error } = useTasks(getFilteredStatus());

  const renderTasksContent = () => {
    if (isLoading) {
      return <div className="loading">Loading tasks...</div>;
    }

    if (tasks.length === 0) {
      return (
        <div className="empty-state">
          <p>No tasks yet. Add one above!</p>
        </div>
      );
    }

    return tasks.map((task) => (
      <ListItem key={task.id} task={task} />
    ));
  };

  if (error) {
    return (
      <main className="main-content">
        <div className="error">
          <h2>Error loading tasks</h2>
          <p>{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <Form />
      <ListContainer>
        <ListMeta 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filterOptions={filterOptions}
        />
        {renderTasksContent()}
      </ListContainer>
    </main>
  );
}

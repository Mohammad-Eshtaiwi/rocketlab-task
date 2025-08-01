"use client";
import Form from "@/components/Form";
import ListContainer from "@/components/List/ListContainer";
import ListItem from "@/components/List/ListItem";
import ListMeta from "@/components/List/ListMeta";

export default function Home() {
  let leftTasks = 0;
  return (
    <main className="main-content">
      <Form />
      <ListContainer>
        <ListMeta leftTasks={leftTasks} />
      </ListContainer>
    </main>
  );
}

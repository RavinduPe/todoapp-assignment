import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import TodoItem from "./TodoItem";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
    margin: 0,
    padding: 0,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    padding: 10,
    color: "#333",
  },
  addButton: {
    marginLeft: 12,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  prioritySelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
    borderWidth: 2,
    borderColor: "red",
    padding: 2,
    borderRadius: 8,
  },
  priorityButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#e0f7fa",
    fontSize: 16,
    fontWeight: "bold",
  },
  priorityButtonActive: {
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
});

export default function TodoList() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Doctor Appointment",
      completed: true,
      isEditing: false,
      priority: "High",
    },
    {
      id: 2,
      text: "Meeting at School",
      completed: false,
      isEditing: false,
      priority: "Medium",
    },
  ]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Low");
  const [filter, setFilter] = useState("all");

  function addTask() {
    if (text.trim()) {
      const newTask = { id: Date.now(), text, completed: false, priority };
      setTasks([...tasks, newTask]);
      setText("");
      setPriority("Low");
    }
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function toggleCompleted(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function toggleEdit(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isEditing: !task.isEditing } : task
      )
    );
  }

  function saveTask(id, newText, newPriority) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, text: newText, isEditing: false, priority: newPriority }
          : task
      )
    );
  }

  function getSortedTasks() {
    const filteredTasks =
      filter === "all"
        ? tasks
        : tasks.filter((task) =>
            filter === "completed" ? task.completed : !task.completed
          );

    return filteredTasks.sort((a, b) => {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "completed" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("completed")}
        >
          <Text style={styles.filterButtonText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "active" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("active")}
        >
          <Text style={styles.filterButtonText}>Not Completed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {getSortedTasks().map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
            toggleEdit={toggleEdit}
            saveTask={saveTask}
          />
        ))}
      </ScrollView>
      <View>
        <View style={styles.prioritySelector}>
          <View style={{ left: 10, bottom: -10 }}>
            <Text style={{ fontWeight: "bold" }}>Select priority :- </Text>
          </View>
          <TouchableOpacity onPress={() => setPriority("High")}>
            <Text
              style={[
                styles.priorityButton,
                priority === "High" && styles.priorityButtonActive,
              ]}
            >
              High
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPriority("Medium")}>
            <Text
              style={[
                styles.priorityButton,
                priority === "Medium" && styles.priorityButtonActive,
              ]}
            >
              Medium
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPriority("Low")}>
            <Text
              style={[
                styles.priorityButton,
                priority === "Low" && styles.priorityButtonActive,
              ]}
            >
              Low
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="New Task"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

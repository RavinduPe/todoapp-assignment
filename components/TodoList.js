import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Keyboard,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    marginTop: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    //borderRadius: 10,
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
    justifyContent: "space-around",
    marginTop: 29,
    marginBottom: 4,
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    borderColor: "black",
    borderWidth: 2,
  },
  filterButtonActive: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  scrollView: {},
  prioritySelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 2,
    //borderRadius: 8,
    backgroundColor: "#c9c1c3",
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
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Low");
  const [filter, setFilter] = useState("all");

  const image = {
    uri: "https://th.bing.com/th?id=OIP.RACWOcN34QYYZiIu9s_W2wHaE8&w=306&h=204&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.3&pid=3.1&rm=2",
  };
  //Load data
  useEffect(() => {
    const retrieveData = async () => {
      try {
        const jsonTasks = await AsyncStorage.getItem("@tasks");
        const loadedTasks = jsonTasks != null ? JSON.parse(jsonTasks) : [];
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Error loading tasks: ", error);
      }
    };
    retrieveData();
  }, []);

  //Save data
  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonTasks = JSON.stringify(tasks);
        await AsyncStorage.setItem("@tasks", jsonTasks);
      } catch (error) {
        console.error("Error saving tasks: ", error);
      }
    };
    storeData();
  }, [tasks]);

  function addTask() {
    if (text.trim()) {
      const newTask = { id: Date.now(), text, completed: false, priority };
      setTasks([...tasks, newTask]);
      setText("");
      setPriority("Low");
    } else {
      Alert.alert("Alert", "Task text cannot be empty.", [{ text: "OK" }]);
    }
    Keyboard.dismiss();
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
      <ImageBackground
        source={image}
        resizeMode="stretch"
        style={{ flex: 1, justifyContent: "center" }}
      >
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
            <View style={{ left: 2, bottom: -10 }}>
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
      </ImageBackground>
    </View>
  );
}

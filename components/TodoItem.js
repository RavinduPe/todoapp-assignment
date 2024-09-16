import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, CheckBox } from 'react-native';

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  todoItemText: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  editInput: {
    flex: 1,
    fontSize: 18,
    padding: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  prioritySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  priorityButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e0f7fa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  priorityButtonActive: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
});

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return '#ea9e06'; // Orange
    case 'Medium':
      return '#e8b336'; // Yellow
    case 'Low':
      return '#ebeb61'; // Light Yellow
    default:
      return '#ffffff'; // Default White
  }
};

export default function TodoItem({ task, deleteTask, toggleCompleted, toggleEdit, saveTask }) {
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setPriority] = useState(task.priority);

  return (
    <View style={[styles.todoItem, { backgroundColor: getPriorityColor(editPriority) }]}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={task.completed}
          onValueChange={() => toggleCompleted(task.id)}
          trackColor={{ true: '#4CAF50', false: '#ccc' }}
        />
      </View>

      {task.isEditing ? (
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
          />
          <View style={styles.prioritySelector}>
            <TouchableOpacity onPress={() => setPriority('High')}>
              <Text style={[styles.priorityButton, editPriority === 'High' && styles.priorityButtonActive]}>
                High
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPriority('Medium')}>
              <Text style={[styles.priorityButton, editPriority === 'Medium' && styles.priorityButtonActive]}>
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPriority('Low')}>
              <Text style={[styles.priorityButton, editPriority === 'Low' && styles.priorityButtonActive]}>
                Low
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={[styles.todoItemText, task.completed && styles.completed]}>
          {task.text}
        </Text>
      )}

      {task.isEditing ? (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => saveTask(task.id, editText, editPriority)}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => toggleEdit(task.id)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(task.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

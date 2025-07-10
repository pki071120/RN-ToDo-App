// components/ToDoItem.js
import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Pressable,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { Fontisto, FontAwesome, Feather } from "@expo/vector-icons";
import { theme } from "./color";

const ToDoItem = ({ todoKey, toDos, setTodos, saveToDos, deleteTodo }) => {
	const [newText, setNewText] = useState(toDos[todoKey].text);
	const [updateMode, setUpdateMode] = useState(false);

	const completeTodo = (key) => {
		const newToDos = { ...toDos };
		newToDos[key].completed = !newToDos[key].completed;
		setTodos(newToDos);
		saveToDos(newToDos);
	};

	const updateTodo = (key) => {
		const newToDos = { ...toDos };
		newToDos[key].text = newText;
		setUpdateMode(false);
		setTodos(newToDos);
		saveToDos(newToDos);
	};

	return (
		<View key={todoKey} style={styles.toDo}>
			<View style={styles.toDoTextContainer}>
				{updateMode ? (
					<TextInput
						style={styles.toDoInput}
						value={newText}
						placeholder="Update To Do Here"
						autoCorrect
						autoFocus
						returnKeyType="done"
						placeholderTextColor="#999999"
						onChangeText={(payload) => setNewText(payload)}
						onSubmitEditing={() => updateTodo(todoKey)}
					/>
				) : (
					<>
						<Pressable onPress={() => completeTodo(todoKey)}>
							<Feather
								name={toDos[todoKey].completed ? "check-square" : "square"}
								size={22}
								color="white"
							/>
						</Pressable>
						<Text
							style={{
								...styles.toDoText,
								textDecorationLine: toDos[todoKey].completed
									? "line-through"
									: "none",
								color: toDos[todoKey].completed ? theme.toDoBg : "white",
							}}
						>
							{toDos[todoKey].text}
						</Text>
					</>
				)}
			</View>
			<View style={styles.actions}>
				<TouchableOpacity onPress={() => setUpdateMode((prev) => !prev)}>
					<FontAwesome
						name="pencil-square-o"
						size={22}
						color={updateMode ? "white" : theme.toDoBg}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => deleteTodo(todoKey)}>
					<Fontisto name="trash" size={20} color={theme.toDoBg} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	toDo: {
		backgroundColor: theme.grey,
		marginBottom: 10,
		paddingVertical: 20,
		paddingHorizontal: 20,
		borderRadius: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	toDoTextContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	toDoText: {
		fontSize: 16,
		fontWeight: "800",
	},
	toDoInput: {
		fontSize: 16,
		color: "grey",
	},
	actions: {
		flexDirection: "row",
		gap: 15,
	},
});

export default ToDoItem;

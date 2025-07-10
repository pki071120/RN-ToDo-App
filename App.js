import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ScrollView,
	ActivityIndicator,
	Alert,
	Pressable,
} from "react-native";
import { theme } from "./color";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto, FontAwesome, Feather } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";
const WORKING_KEY = "@working";

export default function App() {
	const [working, setWorking] = useState(true);
	const [text, setText] = useState("");
	const [toDos, setTodos] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const loadMode = async () => {
		try {
			const loaded = await AsyncStorage.getItem(WORKING_KEY);
			if (loaded !== null) {
				setWorking(JSON.parse(loaded));
			}
		} catch (e) {
			console.log(e);
		}
	};

	const travel = async () => {
		setWorking(false);
		await AsyncStorage.setItem(WORKING_KEY, JSON.stringify(false));
	};

	const work = async () => {
		setWorking(true);
		await AsyncStorage.setItem(WORKING_KEY, JSON.stringify(true));
	};

	const onChangeText = (payload) => setText(payload);

	const saveToDos = async (toSave) => {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
	};

	const loadToDos = async () => {
		try {
			setIsLoading(true);
			const loaded = await AsyncStorage.getItem(STORAGE_KEY);
			if (loaded) {
				setTodos(JSON.parse(loaded));
			}
			setIsLoading(false);
		} catch (e) {
			console.log(e);
		}
	};

	const addTodo = async () => {
		if (!text) return;
		const newTodo = {
			...toDos,
			[Date.now()]: { text, work: working, completed: false },
		};
		setTodos(newTodo);
		await saveToDos(newTodo);
		setText("");
	};

	const deleteTodo = (key) => {
		Alert.alert("Delete To Do", "Are you sure?", [
			{ text: "Cancel" },
			{
				text: "Sure",
				style: "destructive",
				onPress: () => {
					const newToDos = { ...toDos };
					delete newToDos[key];
					setTodos(newToDos);
					saveToDos(newToDos);
				},
			},
		]);
	};

	const completeTodo = (key) => {
		const newToDos = { ...toDos };
		newToDos[key].completed = !newToDos[key].completed;
		setTodos(newToDos);
		saveToDos(newToDos);
	};

	useEffect(() => {
		loadToDos();
		loadMode();
	}, []);
	return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<View style={styles.header}>
				<TouchableOpacity onPress={work}>
					<Text
						style={{ ...styles.btnText, color: working ? "#fff" : theme.grey }}
					>
						Work
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={travel}>
					<Text
						style={{ ...styles.btnText, color: working ? theme.grey : "#fff" }}
					>
						Travel
					</Text>
				</TouchableOpacity>
			</View>
			<TextInput
				onSubmitEditing={addTodo}
				returnKeyType="done"
				value={text}
				autoCapitalize="sentences"
				onChangeText={onChangeText}
				placeholder={working ? "Add a To Do" : "Where do you want to go?"}
				style={styles.input}
			/>
			<ScrollView>
				{isLoading ? (
					<ActivityIndicator color="white" size="large" />
				) : (
					Object.keys(toDos).map((key) =>
						toDos[key].work === working ? (
							<View key={key} style={styles.toDo}>
								<Pressable onPress={() => completeTodo(key)}>
									<Feather
										name={toDos[key].completed ? "check-square" : "square"}
										size={24}
										color="white"
									/>
								</Pressable>
								<Text
									style={{
										...styles.toDoText,
										textDecorationLine: toDos[key].completed
											? "line-through"
											: "none",
										color: toDos[key].completed ? theme.toDoBg : "white",
									}}
								>
									{toDos[key].text}
								</Text>
								<View style={styles.actions}>
									<TouchableOpacity>
										<FontAwesome
											name="pencil-square-o"
											size={22}
											color={theme.toDoBg}
										/>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => deleteTodo(key)}>
										<Fontisto name="trash" size={20} color={theme.toDoBg} />
									</TouchableOpacity>
								</View>
							</View>
						) : null
					)
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.background,
		paddingHorizontal: 20,
	},

	header: {
		flexDirection: "row",
		marginTop: 100,
		justifyContent: "space-between",
		padding: 16,
	},

	btnText: {
		fontSize: 38,
		fontWeight: "600",
	},

	input: {
		backgroundColor: "white",
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 30,
		marginVertical: 20,
		fontSize: 18,
	},

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

	toDoText: {
		fontSize: 16,
		fontWeight: "800",
	},

	actions: {
		flexDirection: "row",
		gap: 15,
	},
});

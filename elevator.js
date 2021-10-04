// input
const INPUT_STR = [
	"00:05-Julie-2-5",
	"00:12-Sharon-1-6",
	"00:15-Steve-1-7",
	"01:18-Christine-5-4",
];

const TIME = 600;

// helper functions to convert time string to seconds int and vice versa
const convertTimeStringToSeconds = (timeString) => {
	const inputArr = timeString.split(":");
	const minutes = Number(inputArr[0]);
	const seconds = Number(inputArr[1]);
	return minutes * 60 + seconds;
};

const convertSecondsToTimeString = (secondsInt) => {
	const minutes = Math.floor(secondsInt / 60) % 60;
	const seconds = secondsInt % 60;

	return [minutes, seconds].map((v) => (v < 10 ? "0" + v : v)).join(":");
};

// take array of input strings and create input info objects
const parseInputStringArr = (inputArr) => {
	return inputArr.map((inputStr) => {
		const currInputArr = inputStr.split("-");
		const start = Number(currInputArr[2]);
		const stop = Number(currInputArr[3]);
		return {
			time: convertTimeStringToSeconds(currInputArr[0]),
			name: currInputArr[1],
			start,
			stop,
			direction: start > stop ? -1 : 1,
			waitingTime: 0,
		};
	});
};

// generate mock data for testing
const mockInputStr = (iterator) => {
	const prob = Math.random() * 100 < 10;
	if (prob) {
		const time = convertSecondsToTimeString(iterator);
		const name = `Person${iterator}`;
		const start = Math.floor(Math.random() * 12) + 1;
		let stop;
		while (true) {
			stop = Math.floor(Math.random() * 12) + 1;
			if (stop !== start) break;
		}
		return [time, name, start, stop].join("-");
	} else {
		return null;
	}
};

const generateMockInput = (totalTime) => {
	let result = [];
	for (let i = 0; i < totalTime; i++) {
		const mock = mockInputStr(i);
		if (mock) result.push(mock);
	}

	return parseInputStringArr(result);
};

// begin with initial state
const getInitialConditions = (inputArr) => ({
	time: 0,
	displayTime: convertSecondsToTimeString(0),
	position: 1,
	direction: 0,
	passengerDirection: 0,
	futureInput: inputArr,
	waitingPassengers: [],
	currentPassengers: [],
	completedPassengers: [],
	delay: 0,
});

// calculate next position
const getNextPosition = (position, direction, delay) => {
	return delay !== 0
		? position
		: Math.round((position + direction / 10) * 10) / 10;
};

// calcualte next state
const getNextConditions = (lastCondition, getDirectionFn) => {
	// destructure last state
	const {
		time,
		position,
		direction,
		passengerDirection,
		futureInput,
		waitingPassengers,
		currentPassengers,
		completedPassengers,
		delay,
	} = lastCondition;

	// increment time
	const newTime = time + 1;

	// move position
	const newPosition = getNextPosition(position, direction, delay);

	// count down delay unless already at 0
	let newDelay = delay === 0 ? 0 : delay - 1;

	// move any future passengers into waiting if their call time has been reached
	const newWaitingPassengers = [
		...waitingPassengers,
		...futureInput.filter((inputObj) => inputObj.time <= newTime),
	];

	const newFutureInput = futureInput.filter(
		(inputObj) => inputObj.time > newTime
	);

	// move any waiting passengers if elevator has reached their start floor and they are allowed on
	const newCurrentPassengers = [
		...currentPassengers,
		...newWaitingPassengers.filter((inputObj) => {
			const { start, direction: inputDirection } = inputObj;
			// check that the direction the passenger is going matches the direction of the passengers in the elevator
			return (
				(passengerDirection === 0 || passengerDirection === inputDirection) &&
				start === newPosition
			);
		}),
	];

	// remove from waiting list; increment waiting time
	const filteredNewWaitingPassengers = newWaitingPassengers
		.filter((inputObj) => {
			const { start, direction: inputDirection } = inputObj;
			return (
				(passengerDirection !== 0 && passengerDirection !== inputDirection) ||
				start !== newPosition
			);
		})
		.map((inputObj) => ({
			...inputObj,
			waitingTime: inputObj.waitingTime + 1,
		}));

	// move any current passengers to completed list if their stop has been reached; increment waiting time of the rest
	const filteredCurrentPassengers = newCurrentPassengers
		.filter((inputObj) => {
			const { stop } = inputObj;
			return stop !== newPosition;
		})
		.map((inputObj) => ({
			...inputObj,
			waitingTime: inputObj.waitingTime + 1,
		}));

	// keep track of completed passengers
	const newCompletedPassengers = [
		...completedPassengers,
		...newCurrentPassengers.filter((inputObj) => {
			const { stop } = inputObj;
			return stop === newPosition;
		}),
	];

	// calculate direction to move elevator
	const {
		elevatorDirection: newElevatorDirection,
		passengerDirection: newPassengerDirection,
		directionDelay = 0,
	} = getDirectionFn(
		position,
		direction,
		passengerDirection,
		filteredNewWaitingPassengers,
		filteredCurrentPassengers
	);

	// factor in elevator turnaround delay or passenger entry/exit delay
	if (directionDelay > 0) {
		newDelay = directionDelay;
	}

	if (
		filteredCurrentPassengers.length !== currentPassengers.length &&
		delay === 0
	) {
		newDelay = 15;
	}

	return {
		time: newTime,
		displayTime: convertSecondsToTimeString(newTime),
		position: newPosition,
		direction: newElevatorDirection,
		passengerDirection: newPassengerDirection,
		futureInput: newFutureInput,
		waitingPassengers: filteredNewWaitingPassengers,
		currentPassengers: filteredCurrentPassengers,
		completedPassengers: newCompletedPassengers,
		delay: newDelay,
	};
};

// STANDARD ALGORITHM
const getDirection = (
	currPos,
	currDir,
	currPassDir,
	waitingPassengers,
	currPassengers
) => {
	if (currPassengers.length === 0) {
		if (waitingPassengers.length === 0)
			// if no current passengers and no waiting, elevator stays idle
			return {
				elevatorDirection: 0,
				passengerDirection: 0,
			};
		else {
			// move elevator toward floor of first waiting passenger
			// IMPORTANT: since there are no current passengers, elevator does not have a passenger direction
			const targetPos = waitingPassengers[0].start;
			return {
				elevatorDirection: targetPos >= currPos ? 1 : -1,
				passengerDirection: 0,
			};
		}
	} else {
		if (currPassDir === 0) {
			const targetPos = currPassengers[0].stop;
			return {
				elevatorDirection: targetPos >= currPos ? 1 : -1,
				passengerDirection: targetPos >= currPos ? 1 : -1,
			};
		}

		let sameDirectionPassengers = [];

		if (currPassDir === -1) {
			sameDirectionPassengers = currPassengers.filter(
				(inputObj) => inputObj.stop <= currPos
			);
		} else if (currPassDir === 1) {
			sameDirectionPassengers = currPassengers.filter(
				(inputObj) => inputObj.stop >= currPos
			);
		}

		if (sameDirectionPassengers.length > 0)
			return { elevatorDirection: currDir, passengerDirection: currDir };
		return { elevatorDirection: 0, passengerDirection: 0 };
	}
};

// SMART ALGORITHM
const getDirectionSmart = (
	currPos,
	currDir,
	currPassDir,
	waitingPassengers,
	currPassengers
) => {
	if (currPassengers.length === 0) {
		if (waitingPassengers.length === 0) {
			return {
				elevatorDirection: currPos < 6 ? 1 : currPos > 6 ? -1 : 0,
				passengerDirection: 0,
			};
		} else {
			const targetPos = waitingPassengers[0].start;
			const newElevatorDirection = targetPos >= currPos ? 1 : -1;
			return {
				elevatorDirection: newElevatorDirection,
				passengerDirection: 0,
				directionDelay: newElevatorDirection !== currDir ? 5 : 0,
			};
		}
	} else {
		if (currPassDir === 0) {
			const targetPos = currPassengers[0].stop;
			return {
				elevatorDirection: targetPos >= currPos ? 1 : -1,
				passengerDirection: targetPos >= currPos ? 1 : -1,
			};
		}

		let sameDirectionPassengers = [];

		if (currPassDir === -1) {
			sameDirectionPassengers = currPassengers.filter(
				(inputObj) => inputObj.stop <= currPos
			);
		} else if (currPassDir === 1) {
			sameDirectionPassengers = currPassengers.filter(
				(inputObj) => inputObj.stop >= currPos
			);
		}

		if (sameDirectionPassengers.length > 0)
			return { elevatorDirection: currDir, passengerDirection: currDir };
		return { elevatorDirection: 0, passengerDirection: 0 };
	}
};

// RUN SIMULATION STARTS HERE
const simulate = (totalTime, initialInputArr, algorithm) => {
	let log = [];
	let finalCompletedPassengers = [];
	let currConditions = getInitialConditions(initialInputArr);
	const stringifyArr = (arr) => arr.join(",");

	for (let time = 0; time < totalTime; time++) {
		const {
			displayTime,
			position,
			direction,
			currentPassengers,
			waitingPassengers,
			completedPassengers,
		} = currConditions;

		const passengers = currentPassengers.map((passenger) => passenger.name);

		const elevatorFloor =
			(position * 10) % 10 > 0 ? Math.floor(position) + 0.5 : position;

		const buttonsInElevator = [
			...new Set(currentPassengers.map((passenger) => passenger.stop)),
		];

		const upButtonList = [
			...new Set(
				waitingPassengers
					.filter((passenger) => passenger.direction === 1)
					.map((passenger) => passenger.start)
			),
		];

		const downButtonList = [
			...new Set(
				waitingPassengers
					.filter((passenger) => passenger.direction === -1)
					.map((passenger) => passenger.start)
			),
		];
		const elevatorDirection =
			direction === 1 ? "Up" : direction === -1 ? "Down" : "";

		const printArr = [
			displayTime,
			stringifyArr(passengers),
			elevatorFloor,
			stringifyArr(buttonsInElevator),
			stringifyArr(upButtonList),
			stringifyArr(downButtonList),
			elevatorDirection,
		];

		if (time % 5 === 0) {
			log.push(printArr.join("-"));
		}

		currConditions = getNextConditions(currConditions, algorithm);
		finalCompletedPassengers = completedPassengers;
	}

	const average = (arr) => {
		return arr.length === 0 ? 0 : arr.reduce((p, c) => p + c, 0) / arr.length;
	};

	const waitingTimes = finalCompletedPassengers.map((passenger) => {
		return `${passenger.name}: ${passenger.waitingTime}`;
	});

	const avgWaitingTime = average(
		finalCompletedPassengers.map((passenger) => passenger.waitingTime)
	);

	console.log(log.join("\n"));
	console.log(waitingTimes.join(", "));
	console.log("Average Waiting time: " + avgWaitingTime);
	return log;
};

const standard = getDirection;
const smart = getDirectionSmart;

const mockedInput = generateMockInput(100);

const INPUT_ARR = parseInputStringArr(INPUT_STR);

const runSimulation = simulate(TIME, INPUT_ARR, standard);
// const runSimulationSmart = simulate(TIME, INPUT_ARR, smart);
// const runSimulation = simulate(TIME, mockedInput, standard);
// const runSimulationSmart = simulate(TIME, mockedInput, smart);

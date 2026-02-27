const codingLevels = [
  {
    id: 1,
    world: 1,
    worldName: "The Awakening",
    title: "Wake Up",
    concept: "Function Calls",
    objective: "Move the robot to the star",
    instruction: "The robot is 6 steps away from the star. Tell it exactly how many steps to move.",
    hint: "The number you put inside the ( ) tells the robot how many steps to take. Count the cells between the robot and the star!",
    code: {
      prefix: "robot.move(",
      suffix: ");",
      answer: 6,
      placeholder: "?",
    },
    grid: {
      cols: 8,
      rows: 5,
      robotStart: { row: 2, col: 1 },
      goalPosition: { row: 2, col: 7 },
    },
    successMessage: "robot.move(6) — perfect execution",
    conceptReveal: "You just used a function call — a command that tells the robot what to do and how much.",
    nextLevel: 2,
  },
  {
    id: 2,
    world: 1,
    worldName: "The Awakening",
    title: "The Distance Changes",
    concept: "Variables",
    objective: "Store the distance before you use it",
    instruction: "The goal moves every time you run. Store the distance in a variable so your code always works.",
    hint: "A variable is like a labelled box. Put the number in the box, then use the box name instead.",
    code: {
      prefix: "let steps = ",
      suffix: ";\nrobot.move(steps);",
      answer: 5,
      placeholder: "?",
    },
    grid: {
      cols: 8,
      rows: 5,
      robotStart: { row: 2, col: 1 },
      goalPosition: { row: 2, col: 6 },
    },
    successMessage: "let steps = 5 — variable stored and used",
    conceptReveal: "You just used a variable — a named container that holds a value so you can reuse it.",
    nextLevel: 3,
  },
];

export default codingLevels;
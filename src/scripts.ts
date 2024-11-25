let score = {
  correct: 0,
  incorrect: 0,
};

document.addEventListener("DOMContentLoaded", () => {
  const firstOperand = document.querySelector<HTMLSpanElement>("#firstOperand");
  const secondOperand =
    document.querySelector<HTMLSpanElement>("#secondOperand");

  const operator = document.querySelector<HTMLSpanElement>("#operator");
  const userResult = document.querySelector<HTMLInputElement>("#result-input");
  const animationResult =
    document.querySelector<HTMLSpanElement>("#animation-result");

  const scoreCorrectEl =
    document.querySelector<HTMLInputElement>("#score-correct");
  const scoreIncorrectEl =
    document.querySelector<HTMLInputElement>("#score-incorrect");

  if (
    !firstOperand ||
    !secondOperand ||
    !operator ||
    !userResult ||
    !animationResult ||
    !scoreCorrectEl ||
    !scoreIncorrectEl
  ) {
    console.error("Missing element");
    return;
  }

  let isAnimating = false;

  const currentOperands = {
    firstOperandValue: 0,
    secondOperandValue: 0,
    operator: "",
  };

  const handleOperation = (event: KeyboardEvent) => {
    if (
      event.key === "Enter" &&
      document.activeElement === userResult &&
      userResult.value
    ) {

      if(isAnimating === true) return;
      isAnimating = true;

      let result: number;

      const { firstOperandValue, secondOperandValue, operator } =
        currentOperands;
      switch (operator) {
        case "+":
          result = firstOperandValue + secondOperandValue;
          break;
        case "-":
          result = firstOperandValue - secondOperandValue;
          break;
        case "x":
          result = firstOperandValue * secondOperandValue;
          break;
        case "/":
          result = firstOperandValue / secondOperandValue;
          break;
        default:
          return;
      }


      if (result === parseFloat(userResult.value)) {
        animationResult.classList.add("animation-result");
        animationResult.textContent = "CORRECT!";
        score.correct = score.correct + 1;
        scoreCorrectEl.textContent = score.correct.toString();
        animationResult.addEventListener(
          "animationend",
          () => {
            animationResult.classList.remove("animation-result"); 
            animationResult.style.opacity = "0";
            animationResult.style.transform = "scale(0)";
            generateRandomOperation();
            isAnimating = false;
          },
          { once: true },
        );
      } else {
        score.incorrect = score.incorrect + 1;
        scoreIncorrectEl.textContent = score.incorrect.toString();
        userResult.classList.add("animation-text-error");
        userResult.addEventListener(
          "animationend",
          () => {
            userResult.classList.remove("animation-text-error");
            isAnimating = false;
          },
          { once: true },
        );
      }
    }
  };

  const generateRandomOperation = () => {
    const operators = ["+", "-", "x"];
    animationResult.textContent = "";

    const randomOperator =
      operators[Math.floor(Math.random() * operators.length)];

    operator.textContent = randomOperator;

    const largestNumberLimit = 100;
    const firstOperandValue = Math.floor(Math.random() * largestNumberLimit);
    const secondOperandValue = Math.floor(Math.random() * largestNumberLimit);

    firstOperand.textContent = firstOperandValue.toString();
    secondOperand.textContent = secondOperandValue.toString();

    currentOperands.firstOperandValue = firstOperandValue;
    currentOperands.secondOperandValue = secondOperandValue;
    currentOperands.operator = randomOperator;

    userResult.value = "";
  };

  document.addEventListener("keydown", (event) => {
    if (event.code === "KeyR") {
      generateRandomOperation();
    }
    if (event.code === "KeyN") {
      score.correct = 0;
      score.incorrect = 0;
      scoreCorrectEl.textContent = score.correct.toString();
      scoreIncorrectEl.textContent = score.incorrect.toString();
    }
  });

  userResult.focus();
  userResult.addEventListener("input", () => {
    userResult.value = userResult.value.replace(/[^0-9-]/g, "");
  });

  document.addEventListener("keydown", handleOperation);

  generateRandomOperation();
});

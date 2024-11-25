let score = {
  correct: 0,
  incorrect: 0,
};

const currentOperands = {
  firstOperandValue: 0,
  secondOperandValue: 0,
  operator: "",
};

document.addEventListener("DOMContentLoaded", () => {
  const firstOperandEl =
    document.querySelector<HTMLSpanElement>("#firstOperand");
  const secondOperandEl =
    document.querySelector<HTMLSpanElement>("#secondOperand");

  const operatorEl = document.querySelector<HTMLSpanElement>("#operator");
  const userResult = document.querySelector<HTMLInputElement>("#result-input");
  const animationResultEl =
    document.querySelector<HTMLSpanElement>("#animation-result");

  const scoreCorrectEl =
    document.querySelector<HTMLInputElement>("#score-correct");
  const scoreIncorrectEl =
    document.querySelector<HTMLInputElement>("#score-incorrect");

  if (
    !firstOperandEl ||
    !secondOperandEl ||
    !operatorEl ||
    !userResult ||
    !animationResultEl ||
    !scoreCorrectEl ||
    !scoreIncorrectEl
  ) {
    console.error("Missing element");
    return;
  }

  let isAnimating = false;

  const generateRandomOperation = () => {
    animationResultEl.textContent = "";

    const operators = ["+", "-", "x"];
    const randomOperator =
      operators[Math.floor(Math.random() * operators.length)];

    const largestNumberLimit = 100;
    const firstOperandValue = Math.floor(Math.random() * largestNumberLimit);
    const secondOperandValue = Math.floor(Math.random() * largestNumberLimit);

    currentOperands.firstOperandValue = firstOperandValue;
    currentOperands.secondOperandValue = secondOperandValue;
    currentOperands.operator = randomOperator;

    chrome.storage.local.set({ currentOperands });

    userResult.value = "";
  };

  // Use saved state if any
  chrome.storage.local.get(["score"], (result) => {
    if (result.score) {
      score = result.score;
      scoreCorrectEl.textContent = score.correct.toString();
      scoreIncorrectEl.textContent = score.incorrect.toString();
    }
  });

  chrome.storage.local.get(["currentOperands"], (result) => {
    if (result.currentOperands) {
      currentOperands.firstOperandValue =
        result.currentOperands.firstOperandValue;
      currentOperands.secondOperandValue =
        result.currentOperands.secondOperandValue;
      currentOperands.operator = result.currentOperands.operator;
    } else {
      generateRandomOperation();
    }
    firstOperandEl.textContent = currentOperands.firstOperandValue.toString();
    secondOperandEl.textContent = currentOperands.secondOperandValue.toString();
    operatorEl.textContent = currentOperands.operator;
  });

  const handleOperation = (event: KeyboardEvent) => {
    if (
      event.key === "Enter" &&
      document.activeElement === userResult &&
      userResult.value
    ) {
      if (isAnimating === true) return;
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
        animationResultEl.classList.add("animation-result");
        animationResultEl.textContent = "CORRECT!";
        score.correct = score.correct + 1;
        scoreCorrectEl.textContent = score.correct.toString();
        chrome.storage.local.set({ score });
        animationResultEl.addEventListener(
          "animationend",
          () => {
            animationResultEl.classList.remove("animation-result");
            animationResultEl.style.opacity = "0";
            animationResultEl.style.transform = "scale(0)";
            generateRandomOperation();
            firstOperandEl.textContent =
              currentOperands.firstOperandValue.toString();
            secondOperandEl.textContent =
              currentOperands.secondOperandValue.toString();
            operatorEl.textContent = currentOperands.operator;

            isAnimating = false;
          },
          { once: true },
        );
      } else {
        userResult.classList.add("animation-text-error");
        score.incorrect = score.incorrect + 1;
        scoreIncorrectEl.textContent = score.incorrect.toString();
        chrome.storage.local.set({ score });

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

  document.addEventListener("keydown", (event) => {
    if (event.code === "KeyR") {
      generateRandomOperation();
      firstOperandEl.textContent = currentOperands.firstOperandValue.toString();
      secondOperandEl.textContent =
        currentOperands.secondOperandValue.toString();
      operatorEl.textContent = currentOperands.operator;
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
});


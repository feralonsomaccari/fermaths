let score = {
  corrects: 0,
  misses: 0,
};

document.addEventListener("DOMContentLoaded", () => {
  const firstOperand = document.querySelector<HTMLSpanElement>("#firstOperand");
  const secondOperand =
    document.querySelector<HTMLSpanElement>("#secondOperand");

  const operator = document.querySelector<HTMLSpanElement>("#operator");
  const userResult = document.querySelector<HTMLInputElement>("#result-input");
  const animationResult =
    document.querySelector<HTMLSpanElement>("#animation-result");

  const scoreCorrectsEl =
    document.querySelector<HTMLInputElement>("#score-corrects");
  const scoreMissesEl =
    document.querySelector<HTMLInputElement>("#score-misses");

  if (
    !firstOperand ||
    !secondOperand ||
    !operator ||
    !userResult ||
    !animationResult ||
    !scoreCorrectsEl ||
    !scoreMissesEl
  ) {
    console.error("Missing element");
    return;
  }

  document.addEventListener("keydown", (event) => {
    if (event.code === "KeyR") {
      generateRandomOperation();
    }
    if (event.code === "KeyN") {
      score.corrects = 0;
      score.misses = 0;
      scoreCorrectsEl.textContent = score.corrects.toString();
      scoreMissesEl.textContent = score.misses.toString();
    }
  });

  userResult.focus();
  userResult.addEventListener("input", () => {
    userResult.value = userResult.value.replace(/[^0-9-]/g, "");
  });

  const generateRandomOperation = () => {
    const operators = ["+", "-", "x"];

    const randomOperator =
      operators[Math.floor(Math.random() * operators.length)];

    operator.textContent = randomOperator;

    const largestNumberLimit = 100;
    const firstOperandValue = Math.floor(Math.random() * largestNumberLimit);
    const secondOperandValue = Math.floor(Math.random() * largestNumberLimit);

    firstOperand.textContent = firstOperandValue.toString();
    secondOperand.textContent = secondOperandValue.toString();
    const handleOperation = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        document.activeElement === userResult &&
        userResult.value
      ) {
        let result: number;
        switch (randomOperator) {
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
          score.corrects = score.corrects + 1;
          scoreCorrectsEl.textContent = score.corrects.toString();
          animationResult.addEventListener("animationend", () => {
            animationResult.style.opacity = "0";
            animationResult.style.transform = "scale(0)";
            generateRandomOperation();
          });
        } else {
          score.misses = score.misses + 1;
          scoreMissesEl.textContent = score.misses.toString();
        }
      }
    };
    document.addEventListener("keydown", handleOperation);
    userResult.value = "";
  };

  generateRandomOperation();
});

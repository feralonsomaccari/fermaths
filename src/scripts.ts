document.addEventListener("DOMContentLoaded", () => {
  const firstOperand = document.querySelector<HTMLSpanElement>("#firstOperand");
  const secondOperand =
    document.querySelector<HTMLSpanElement>("#secondOperand");

  const operator = document.querySelector<HTMLSpanElement>("#operator");
  const userResult = document.querySelector<HTMLInputElement>("#result-input");
  const animationResult =
    document.querySelector<HTMLSpanElement>("#animation-result");

  if (
    !firstOperand ||
    !secondOperand ||
    !operator ||
    !userResult ||
    !animationResult
  ) {
    console.error("Missing element");
    return;
  }

  userResult.focus();

  userResult.addEventListener("input", () => {
    userResult.value = userResult.value.replace(/[^0-9-]/g, "");
  });

  const generateRandomOperation = () => {
    const operators = ["+", "-", "x", "/"];

    const randomOperator = operators[Math.floor(Math.random() * 4)];

    operator.textContent = randomOperator;

    const largestNumberLimit = 100;
    const firstOperandValue = Math.floor(Math.random() * largestNumberLimit);
    const secondOperandValue = Math.floor(Math.random() * largestNumberLimit);

    firstOperand.textContent = firstOperandValue.toString();
    secondOperand.textContent = secondOperandValue.toString();
    const handleOperation = (event: KeyboardEvent) => {
      if (event.key === "Enter" && document.activeElement === userResult) {
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
          animationResult.addEventListener("animationend", () => {
            setTimeout(() => {
              animationResult.style.opacity = "0";
              animationResult.style.transform = "scale(0)";

              generateRandomOperation();
            }, 200);
          });
        } else {
        }
      }
    };
    document.addEventListener("keydown", handleOperation);
    userResult.value = "";
  };

  generateRandomOperation();
});

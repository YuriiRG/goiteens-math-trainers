import React, { useState } from "react";
import Latex from "../Latex";
import LatexInput, { fixLatex } from "../LatexInput";
import { diff, convertFromLaTeX } from "nerdamer";
import { Select, SubmitButton } from "../shared";

require("nerdamer/all");

export default function Derivative() {
  const [math, setMath] = useState("");
  const [degree, setDegree] = useState(1);
  const [result, setResult] = useState<
    | {
        success: true;
        data: string;
      }
    | {
        success: false;
        error: string;
      }
  >();
  const diffText = `\\frac{d${degree > 1 ? `^{${degree}}` : ""}}{d${
    degree > 1 ? `^{${degree}}` : ""
  }x}`;
  return (
    <div>
      <h2 className="text-2xl">
        Онлайн калькулятор. Розв'язання похідних онлайн
      </h2>
      Знайти похідну{" "}
      <Select
        value={`${degree}`}
        onChange={(newValue) => {
          setResult(undefined);
          setDegree(Number(newValue));
        }}
        options={[
          { value: "1", text: "1" },
          { value: "2", text: "2" },
          { value: "3", text: "3" },
          { value: "4", text: "4" },
          { value: "5", text: "5" },
          { value: "6", text: "6" },
        ]}
      />
      -ого порядку:
      <div className="mt-2 flex items-center">
        <Latex className="text-2xl" text={`${diffText}`} />
        <LatexInput
          defaultValue={math}
          className="grow text-xl"
          onInput={(newMath) => {
            setResult(undefined);
            setMath(newMath);
          }}
        />
      </div>
      <SubmitButton
        className="my-2"
        onClick={() => {
          try {
            if (math.includes("null") || math.includes("undefined")) {
              throw "invalid latex";
            }
            const expr = convertFromLaTeX(fixLatex(math));
            try {
              const derivative = diff(expr, "x", degree);
              const tex = derivative.toTeX();
              setResult({ success: true, data: tex });
            } catch (e) {
              setResult({
                success: false,
                error: "Програма не може знайти похідну",
              });
            }
          } catch (e) {
            setResult({ success: false, error: "Некоректна формула" });
          }
        }}
      >
        Порахувати
      </SubmitButton>
      {result &&
        (result.success ? (
          <div>
            <Latex
              text={`${diffText}\\left(${math}\\right)=${result.data}`}
              blockMode
            />
          </div>
        ) : (
          <div>{result.error}</div>
        ))}
    </div>
  );
}

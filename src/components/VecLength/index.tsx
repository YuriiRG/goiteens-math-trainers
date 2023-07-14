import React, { type ReactNode, Fragment } from "react";
import { useState } from "react";
import { z } from "zod";
import { pointDistance, vectorLength } from "./math";
import Latex from "../Latex";

const floatRegex = /^-?[0-9]+([.,][0-9]+)?$/;
const floatTransform = (str: string): number => {
  return Number(str.replace(",", "."));
};

const floatArraySchema = z.array(
  z.string().regex(floatRegex).transform(floatTransform),
);

export default function App() {
  const [vectorStr, setVectorStr] = useState<string[]>(["0", "0"]);
  const [startPointStr, setStartPointStr] = useState<string[]>(["0", "0"]);
  const [endPointStr, setEndPointStr] = useState<string[]>(["0", "0"]);
  const [mode, setMode] = useState<string>("coords");
  const [showResult, setShowResult] = useState(false);

  const vectorParseResult = floatArraySchema.safeParse(vectorStr);
  const vector = vectorParseResult.success ? vectorParseResult.data : undefined;

  const startParseResult = floatArraySchema.safeParse(startPointStr);
  const startPoint = startParseResult.success
    ? startParseResult.data
    : undefined;

  const endParseResult = floatArraySchema.safeParse(endPointStr);
  const endPoint = endParseResult.success ? endParseResult.data : undefined;

  let result: number | undefined = undefined;
  if (vector && mode === "coords") {
    result = vectorLength(vector);
  } else if (startPoint && endPoint && mode === "points") {
    result = pointDistance(startPoint, endPoint);
  }

  return (
    <div>
      <h1 className="mb-3 text-3xl font-bold">
        Калькулятор для обрахунку довжини вектора (модуля вектора)
      </h1>
      <Select
        label="Розмірність вектора:"
        id="dimensions"
        value={vectorStr.length}
        onChange={(e) => {
          setVectorStr(Array(Number(e.target.value)).fill("0"));
          setStartPointStr(Array(Number(e.target.value)).fill("0"));
          setEndPointStr(Array(Number(e.target.value)).fill("0"));
          setShowResult(false);
        }}
        options={[
          { value: "2", text: "2" },
          { value: "3", text: "3" },
          { value: "4", text: "4" },
          { value: "5", text: "5" },
          { value: "6", text: "6" },
        ]}
      />
      <Select
        label={
          <>
            Форма представлення вектора <Latex text="\vec{a}" />
            {""}:
          </>
        }
        id="mode"
        value={mode}
        onChange={(e) => {
          setShowResult(false);
          setMode(e.target.value);
        }}
        options={[
          { value: "coords", text: "Координатами" },
          { value: "points", text: "Точками" },
        ]}
      />
      <p className="mb-1">Введіть значення вектора:</p>
      {mode === "coords" && (
        <VectorInput
          value={vectorStr}
          setValue={(newValue) => {
            setShowResult(false);
            setVectorStr(newValue);
          }}
          startLabel={<Latex text="\vec{a} = \{" />}
          separator={<Latex text=";\ " />}
          endLabel={<Latex text="\}" />}
        />
      )}
      {mode === "points" && (
        <>
          <p className="mb-1">Початкова точка</p>
          <VectorInput
            value={startPointStr}
            setValue={(newValue) => {
              setShowResult(false);
              setStartPointStr(newValue);
            }}
            startLabel={<Latex text="A = (" />}
            separator={<Latex text=",\ " />}
            endLabel={<Latex text=")" />}
          />
          <p className="mb-1">Кінцева точка</p>
          <VectorInput
            value={endPointStr}
            setValue={(newValue) => {
              setShowResult(false);
              setEndPointStr(newValue);
            }}
            startLabel={<Latex text="B = (" />}
            separator={<Latex text=",\ " />}
            endLabel={<Latex text=")" />}
          />
        </>
      )}
      <button
        className="mb-2 rounded bg-gray-200 p-2 transition-colors hover:bg-gray-300"
        onClick={() => setShowResult(true)}
      >
        Порахувати
      </button>
      <br />
      {!showResult && <Latex className="block" text={`|\\vec{a}| =`} />}
      {showResult && result !== undefined && (
        <Latex
          text={`|\\vec{a}| ${
            Number.isInteger(result) ? "=" : "\\approx"
          } ${result}`}
        />
      )}
      {showResult && result === undefined && <>Невірні вхідні дані</>}

      <h2 className="mt-2 text-2xl font-bold">Теорія</h2>
      <p>
        Модуль вектора (довжина вектора) <Latex text="|\vec{a}|" /> в
        прямокутних декартових координатах дорівнює квадратному кореню з суми
        квадратів його координат.
      </p>
      <p>
        Наприклад для вектора <Latex text="\vec{a} = \{a_x; a_y; a_z\}" />{" "}
        довжина вектора обраховується наступним чином:
      </p>
      <Latex
        className="block"
        text="|\vec{a}| = \sqrt{a_x^2 + a_y^2 + a_z^2}"
        blockMode
      />
    </div>
  );
}

function Select({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: ReactNode;
  options: { value: string | number; text: ReactNode }[];
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  return (
    <fieldset className="mb-2">
      <label htmlFor={id} className="mr-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="rounded bg-gray-200 p-1 align-baseline"
      >
        {options.map(({ value, text }) => (
          <option key={value} value={value} className="">
            {text}
          </option>
        ))}
      </select>
    </fieldset>
  );
}

function VectorInput({
  value,
  setValue,
  startLabel,
  endLabel,
  separator,
}: {
  value: string[];
  setValue: (newValue: string[]) => void;
  startLabel?: ReactNode;
  endLabel?: ReactNode;
  separator?: ReactNode;
}) {
  return (
    <fieldset className="mb-2">
      {startLabel}
      {value.map((num, i) => (
        <Fragment key={i}>
          <input
            type="string"
            className="w-10 rounded border-2 border-solid border-gray-200"
            value={num}
            onChange={(e) => {
              setValue(value.map((old, j) => (j === i ? e.target.value : old)));
            }}
          />
          {i !== value.length - 1 ? separator : null}
        </Fragment>
      ))}
      {endLabel}
    </fieldset>
  );
}
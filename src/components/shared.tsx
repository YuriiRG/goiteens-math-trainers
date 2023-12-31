import React, {
  FormEventHandler,
  ForwardedRef,
  Fragment,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  forwardRef,
} from "react";
import { twMerge } from "tailwind-merge";
import Latex from "./Latex";
import { z } from "zod";

// .min(1) is a workaround for "" being parsed like 0
export const floatSchema = z.string().min(1).pipe(z.coerce.number().safe());
export const intSchema = z.string().min(1).pipe(z.coerce.number().safe().int());

export function convertPointsToVector(
  startPoint: number[],
  endPoint: number[],
) {
  return startPoint.map((n, i) => endPoint[i] - n);
}

export function ComplexInput({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: {
    re: string;
    im: string;
  };
  onChange: (newValue: { re: string; im: string }) => void;
}) {
  return (
    <fieldset>
      <Latex text={`${id} =\\ `} />
      <NumberInput
        id={id && `Re(${id})`}
        value={value.re}
        onChange={(newValue) => onChange({ ...value, re: newValue })}
        className="w-16"
      />
      <Latex text="\ +\ " />
      <NumberInput
        id={id && `Im(${id})`}
        value={value.im}
        onChange={(newValue) => onChange({ ...value, im: newValue })}
        className="w-16"
      />
      <Latex text="i" />
    </fieldset>
  );
}

export const NumberInput = forwardRef(function NumberInput(
  {
    integer = false,
    className = "",
    id,
    value,
    onChange,
    positive = false,
    onInput,
  }: {
    children?: ReactNode;
    value?: string;
    onChange?: (newValue: string) => void;
    id?: string;
    integer?: boolean;
    className?: string;
    positive?: boolean;
    onInput?: FormEventHandler<HTMLInputElement>;
  },
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      onInput={onInput}
      ref={ref}
      id={id}
      value={value}
      onChange={(e) => (onChange ? onChange(e.target.value) : undefined)}
      type="number"
      step={integer ? 1 : "any"}
      className={twMerge("w-52 rounded border-2 border-gray-300", className)}
      required
      min={positive ? 0 : undefined}
    />
  );
});

export function Select({
  id,
  options,
  value,
  onChange,
  className,
}: {
  className?: string;
  id?: string;
  options: { value: string; text: ReactNode }[];
  value?: string;
  onChange?: (newValue: string) => void;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={twMerge("rounded bg-gray-200 p-1 align-baseline", className)}
    >
      {options.map(({ value, text }) => (
        <option key={value} value={value}>
          {text}
        </option>
      ))}
    </select>
  );
}

export function VectorInput({
  value,
  onChange,
  startLabel,
  endLabel,
  separator,
  className,
}: {
  className?: string;
  value: string[];
  onChange: (newValue: string[]) => void;
  startLabel?: ReactNode;
  endLabel?: ReactNode;
  separator?: ReactNode;
}) {
  return (
    <fieldset
      className={twMerge("flex min-w-0 flex-wrap items-baseline", className)}
    >
      {startLabel}
      {value.map((num, i) => (
        <Fragment key={i}>
          <NumberInput
            className="w-16"
            value={num}
            onChange={(newValue) => {
              onChange(value.map((old, j) => (j === i ? newValue : old)));
            }}
          />
          {i !== value.length - 1 ? separator : null}
        </Fragment>
      ))}
      {endLabel}
    </fieldset>
  );
}

export function SubmitButton({
  children,
  onClick,
  className,
}: {
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className={twMerge(
        "rounded bg-gray-200 p-2 transition-colors hover:bg-gray-300",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

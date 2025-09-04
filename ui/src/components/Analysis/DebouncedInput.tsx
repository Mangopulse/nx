import React, { useState, useEffect } from "react";
import Input, { InputProps } from "../ui/input"; // Assuming InputProps comes from your input component

interface DebouncedInputProps {
  onChange: (value: string) => void;
  debounce?: number;
}

const initialValue: string = '';

export default function DebouncedInput({
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps): React.ReactElement {
  const [value, setValue] = useState<string>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
  );
}

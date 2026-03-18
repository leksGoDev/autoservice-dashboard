import type { ChangeEventHandler, FC } from "react";

interface CustomersRegistrySearchProps {
  value: string;
  placeholder: string;
  ariaLabel: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const CustomersRegistrySearch: FC<CustomersRegistrySearchProps> = ({
  value,
  placeholder,
  ariaLabel,
  onChange,
}) => {
  return (
    <div className="customers-registry__toolbar">
      <input
        className="customers-registry__search"
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={onChange}
      />
    </div>
  );
};

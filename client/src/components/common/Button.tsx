import classNames from "classnames";

interface ButtonProps {
    onClick?: () => void;
    className: string;
    type?: "submit" | "button" | "reset";
    testId?: string;
}
export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    className,
    type = "submit",
    testId,
}) => {
    return (
        <button
            data-testid={testId}
            type={type}
            onClick={onClick}
            className={classNames(
                "bg-rose-400 p-2 rounded-lg hover:bg-rose-600 text-white",
                className
            )}
        >
            {children}
        </button>
    );
};
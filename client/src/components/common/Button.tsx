import classNames from "classnames";

interface IButtonProps {
    className?: string;
    text?: string;
    icon?: React.ReactElement;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}
export const Button: React.FC<IButtonProps> = ({
    children,
    type,
    className,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            type={type || "submit"}
            className={classNames(
                "bg-rose-400 p-2 rounded-lg  hover:bg-rose-600 text-white",
                className
            )}
        >
            {children}
        </button>
    );
};

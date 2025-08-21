import { cn } from "../lib/utils";

export const Logo = ({ className, uniColor }) => {
  return (
    <div className={cn("text-foreground font-bold text-xl", className)}>
      FreeJobAI
    </div>
  );
};

export const LogoIcon = ({ className, uniColor }) => {
  return (
    <div className={cn("text-foreground font-bold text-lg", className)}>FJ</div>
  );
};

export const LogoStroke = ({ className }) => {
  return (
    <div className={cn("text-foreground font-bold text-lg", className)}>
      FreeJobAI
    </div>
  );
};

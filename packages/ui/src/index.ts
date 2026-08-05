import "./styles/index.css";

/* ------------------------------------------------------------------ layout */
export { Box } from "./components/box";
export type { BoxElement, BoxProps } from "./components/box";

export { Stack } from "./components/stack";
export type { StackProps } from "./components/stack";

export { Inline } from "./components/inline";
export type { InlineProps } from "./components/inline";

export { Container } from "./components/container";
export type { ContainerProps, ContainerSize } from "./components/container";

export { Grid } from "./components/grid";
export type { GridProps } from "./components/grid";

export { Separator } from "./components/separator";
export type { SeparatorProps } from "./components/separator";

export { VisuallyHidden } from "./components/visually-hidden";
export type { VisuallyHiddenProps } from "./components/visually-hidden";

/* -------------------------------------------------------------- typography */
export { Text } from "./components/text";
export type {
  TextLeading,
  TextProps,
  TextSize,
  TextTone,
  TextWeight,
} from "./components/text";

export { Heading } from "./components/heading";
export type { HeadingLevel, HeadingProps, HeadingSize } from "./components/heading";

export { Label } from "./components/label";
export type { LabelProps } from "./components/label";

export { Code } from "./components/code";
export type { CodeProps } from "./components/code";

export { Link } from "./components/link";
export type { LinkProps } from "./components/link";

/* ----------------------------------------------------------------- actions */
export { Button } from "./components/button";
export type { ButtonProps, ButtonSize, ButtonVariant } from "./components/button";

export { IconButton } from "./components/icon-button";
export type { IconButtonProps } from "./components/icon-button";

export { ButtonGroup } from "./components/button-group";
export type { ButtonGroupProps } from "./components/button-group";

/* ------------------------------------------------------------------- forms */
export { Input } from "./components/input";
export type { InputProps, InputSize } from "./components/input";

export { Textarea } from "./components/textarea";
export type { TextareaProps } from "./components/textarea";

export { FormField } from "./components/form-field";
export type { FormFieldProps } from "./components/form-field";

export { FormMessage } from "./components/form-message";
export type { FormMessageProps, FormMessageTone } from "./components/form-message";

/* ------------------------------------------------------------ data display */
export { Card, CardBody, CardFooter, CardHeader } from "./components/card";
export type {
  CardBodyProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardVariant,
} from "./components/card";

export { Badge } from "./components/badge";
export type { BadgeProps, BadgeTone, BadgeVariant } from "./components/badge";

/* ---------------------------------------------------------------- feedback */
export { Alert } from "./components/alert";
export type { AlertProps, AlertTone } from "./components/alert";

export { Spinner } from "./components/spinner";
export type { SpinnerProps } from "./components/spinner";

export { ToastProvider, useToast } from "./components/toast";
export type { ToastOptions, ToastProviderProps, ToastTone } from "./components/toast";

/* ---------------------------------------------------------------- overlays */
export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog";
export type {
  DialogBodyProps,
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogProps,
  DialogSize,
  DialogTitleProps,
  DialogTriggerProps,
} from "./components/dialog";

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./components/dropdown-menu";
export type {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuTriggerProps,
} from "./components/dropdown-menu";

export { Tabs, TabsList, TabsPanel, TabsTrigger } from "./components/tabs";
export type {
  TabsListProps,
  TabsPanelProps,
  TabsProps,
  TabsTriggerProps,
  TabsVariant,
} from "./components/tabs";

/* --------------------------------------------------------------- utilities */
export { cn } from "./utilities/cn";
export type { ClassValue } from "./utilities/cn";
export type {
  RadiusToken,
  ShadowToken,
  SpaceToken,
  SurfaceToken,
} from "./utilities/tokens";
